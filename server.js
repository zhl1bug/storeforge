// 云桨 · 一图全店  —  Node 代理服务
// 把 DashScope API Key 留在服务端,前端通过 /api/... 调用。
// 启动:  DASHSCOPE_API_KEY=sk-xxx node server.js
// 访问:  http://localhost:8787/

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = parseInt(process.env.PORT || '8787', 10);
const API_KEY = process.env.DASHSCOPE_API_KEY || readKeyFile();
const STATIC_DIR = __dirname;

function readKeyFile() {
  // 备用:从 .dashscope-key 文件读取(只用于本地开发,不要提交到 git)
  try {
    return fs.readFileSync(path.join(__dirname, '.dashscope-key'), 'utf8').trim();
  } catch { return ''; }
}

if (!API_KEY) {
  console.warn('\n  [warn] DASHSCOPE_API_KEY 未设置 — 真实 API 会返回 401');
  console.warn('  设置方式:');
  console.warn('    export DASHSCOPE_API_KEY=sk-xxx && node server.js');
  console.warn('  或把 SK 写入 .dashscope-key 文件\n');
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg':  'image/svg+xml',
  '.glb':  'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.ico':  'image/x-icon',
};

const TRIPO_URL  = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/video-generation/3d-generation';
const ZIMAGE_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation';
const TASK_URL   = (id) => `https://dashscope.aliyuncs.com/api/v1/tasks/${id}`;

function readBody(req) {
  return new Promise((resolve, reject) => {
    let chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end',  () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

async function callDashScope({ method = 'POST', url: u, body = null, async: isAsync = false }) {
  const headers = {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type':  'application/json',
  };
  if (isAsync) headers['X-DashScope-Async'] = 'enable';

  const t0 = Date.now();
  const res = await fetch(u, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let parsed;
  try { parsed = JSON.parse(text); } catch { parsed = { raw: text }; }
  console.log(`  → ${method} ${u.split('aliyuncs.com')[1]}  [${res.status}]  ${Date.now()-t0}ms`);
  return { status: res.status, body: parsed };
}

async function handleApi(req, res, pathname) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    // POST /api/3d/generate  — 启动 3D 生成任务
    if (pathname === '/api/3d/generate' && req.method === 'POST') {
      const body = JSON.parse(await readBody(req) || '{}');
      const input = body.image
        ? { image: body.image }
        : (body.images && body.images.length ? { images: body.images } : { prompt: body.prompt || '' });
      const r = await callDashScope({
        url: TRIPO_URL,
        async: true,
        body: {
          model: body.model || 'Tripo/Tripo-P1.0',
          input,
          parameters: { texture_quality: body.texture_quality || 'standard' },
        },
      });
      res.writeHead(r.status);
      res.end(JSON.stringify(r.body));
      return;
    }

    // POST /api/image/generate  — 启动文生图任务 (Z-Image / 同步返回)
    if (pathname === '/api/image/generate' && req.method === 'POST') {
      const body = JSON.parse(await readBody(req) || '{}');
      const prompt = body.prompt || '';
      const size = body.size || '1024*1024';
      const n = body.n || 1;
      const r = await callDashScope({
        url: ZIMAGE_URL,
        // multimodal-generation 端点是同步返回的,不要加 X-DashScope-Async
        async: false,
        body: {
          model: body.model || 'z-image-turbo',
          input: {
            messages: [
              { role: 'user', content: [{ text: prompt }] },
            ],
          },
          parameters: { n, size, watermark: false, ...(body.parameters || {}) },
        },
      });
      res.writeHead(r.status);
      res.end(JSON.stringify(r.body));
      return;
    }

    // GET /api/poll/:task_id  — 通用轮询任务状态
    const pollMatch = pathname.match(/^\/api\/poll\/([\w-]+)$/);
    if (pollMatch && req.method === 'GET') {
      const taskId = pollMatch[1];
      const r = await callDashScope({ method: 'GET', url: TASK_URL(taskId) });
      res.writeHead(r.status);
      res.end(JSON.stringify(r.body));
      return;
    }

    // GET /api/health  — 健康检查
    if (pathname === '/api/health') {
      res.writeHead(200);
      res.end(JSON.stringify({ ok: true, hasKey: !!API_KEY }));
      return;
    }

    // GET /api/proxy?url=...  — 转发外部图片 / GLB,统一为同源,避免 CORS
    if (pathname === '/api/proxy' && req.method === 'GET') {
      const targetUrl = new URL(req.url, 'http://localhost').searchParams.get('url');
      if (!targetUrl) { res.writeHead(400); res.end('missing url'); return; }
      // 仅允许 aliyun 系域名,避免被滥用作开放代理
      let host;
      try { host = new URL(targetUrl).hostname; } catch { res.writeHead(400); res.end('bad url'); return; }
      const allowed = host.endsWith('.aliyuncs.com')
                   || host.endsWith('.aliyun.com')
                   || host === 'aliyuncs.com'
                   || host === 'aliyun.com'
                   || host.endsWith('.tripo3d.com')
                   || host === 'tripo3d.com';
      if (!allowed) {
        res.writeHead(403); res.end(JSON.stringify({ error: 'host not allowed', host }));
        return;
      }
      const upstream = await fetch(targetUrl);
      const ct = upstream.headers.get('content-type') || 'application/octet-stream';
      const buf = Buffer.from(await upstream.arrayBuffer());
      res.writeHead(upstream.status, {
        'Content-Type': ct,
        'Content-Length': buf.length,
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(buf);
      return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: 'route not found', path: pathname }));
  } catch (err) {
    console.error('[api error]', err);
    res.writeHead(500);
    res.end(JSON.stringify({ error: String(err && err.message || err) }));
  }
}

function safeJoin(base, rel) {
  const target = path.normalize(path.join(base, rel));
  return target.startsWith(base) ? target : null;
}

function handleStatic(req, res, pathname) {
  if (pathname === '/' || pathname === '') pathname = '/index.html';
  const filePath = safeJoin(STATIC_DIR, pathname);
  if (!filePath) { res.writeHead(403); res.end('Forbidden'); return; }
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) { res.writeHead(404); res.end('Not found'); return; }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  });
}

const server = http.createServer(async (req, res) => {
  const { pathname } = url.parse(req.url, true);
  if (pathname.startsWith('/api/')) {
    await handleApi(req, res, pathname);
  } else {
    handleStatic(req, res, pathname);
  }
});

server.listen(PORT, () => {
  console.log('');
  console.log('  ┌─────────────────────────────────────────────┐');
  console.log('  │                                             │');
  console.log('  │     云桨 · 一图全店  Dev Server  🚀          │');
  console.log('  │                                             │');
  console.log(`  │     http://localhost:${PORT}/                   │`);
  console.log('  │                                             │');
  console.log(`  │     API Key:  ${API_KEY ? '✓ 已加载' : '✗ 未设置 (仅演示模式可用) '}         │`);
  console.log('  │                                             │');
  console.log('  └─────────────────────────────────────────────┘');
  console.log('');
});
