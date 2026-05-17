# 云桨 · 一图全店

一张商品平铺图 → 可交互 3D 模型 + 全套上架素材 + 详情页长图

## 两种运行模式

### 模式一:演示模式 (默认,无需 Key)

双击 `index.html`,或在终端:

```bash
open index.html
```

所有 3D / 素材 / 详情图全部本地程序化生成,瞬时无成本,适合现场演示流程。

### 模式二:真实生成模式 (接入阿里云 DashScope)

需要 Node.js (≥ 18) 和 DashScope API Key。

**1) 设置 API Key**

```bash
export DASHSCOPE_API_KEY=sk-xxxxxxxxxxxxxxxx
```

或写入文件 `.dashscope-key`(已在 .gitignore 排除):

```bash
echo "sk-xxxxxxxxxxxxxxxx" > .dashscope-key
```

**2) 起代理服务**

```bash
node server.js
```

服务跑在 `http://localhost:8787/`,SK 留在服务端,前端通过 `/api/...` 转发。

**3) 浏览器打开 http://localhost:8787/**

顶栏右上角有「演示模式 / 真实生成」开关,切到「真实生成」后点 **开始生成** 会真正调用:

- Tripo 3D (`Tripo/Tripo-P1.0`) — 文生 3D,约 3-5 分钟出 GLB
- Z-Image (`z-image-turbo`) — 文生图,30-60 秒出图,默认生成 4 张关键素材

## 接口说明 (代理转发)

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/api/3d/generate` | 启动 Tripo 任务,body: `{prompt}` 或 `{image: url}` |
| POST | `/api/image/generate` | 启动 Z-Image 任务,body: `{prompt, size, n}` |
| GET  | `/api/poll/:task_id` | 轮询任务状态 (PENDING → RUNNING → SUCCEEDED/FAILED) |
| GET  | `/api/health` | 健康检查 |

## 文件结构

```
demo1/
├── server.js            Node 代理(转发 DashScope)
├── index.html           主页面
├── styles.css           样式
├── script.js            前端逻辑(3D 渲染 / 套图 / 详情图 / 下载)
├── .dashscope-key       (可选) SK 文件,不要提交
└── README.md
```

## 注意

- **不要把 SK 写进 script.js**。代理就是为了挡这个。
- 生成的图片 / GLB URL 默认有效期 24 小时,要长期保存请下载到本地或 OSS。
- 真实生成有费用,按调用计费,价格见 [阿里云百炼计费](https://help.aliyun.com/zh/model-studio/billing-for-model-studio)。
