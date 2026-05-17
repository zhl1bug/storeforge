// ============ State ============
const state = {
  selectedSample: null,
  selectedFile: null,
  productType: 'shoe',
  color: '#c0392b',
  template: 'minimal',
  scene: null,
  camera: null,
  renderer: null,
  controls: null,
  productMesh: null,
  startTime: null,
  edits: {
    brand: '云桨',
    brandCn: '云桨',
    title: 'Air Runner Pro',
    subtitle: '城市轻跑系列',
    price: '299',
    origPrice: '599',
    slogans: ['轻量缓震', '透气网面', '防滑大底'],
    sloganDescs: ['EVA 中底回弹', '飞织鞋面通风', 'XPU 防滑橡胶'],
    specs: [
      { label: '尺码', value: '36-46' },
      { label: '重量', value: '约 280g (单只)' },
      { label: '材质', value: '飞织 + 橡胶大底' },
      { label: '适用', value: '日常通勤 / 慢跑' },
    ],
  },
  detailSections: {
    promo: true,
    hero: true,
    slogans: true,
    scene: true,
    material: true,
    annotation: true,
    specs: true,
    reviews: true,
    variants: true,
    trust: true,
  },
  mode: 'real',           // 'mock' | 'real'  — 真实模式调 Tripo / Z-Image
  realModelUrl: null,     // Tripo 返回的 GLB URL
  realAssets: {},         // 'category-idx' => image URL
  realHeroImage: null,    // 详情图 hero 用的 真实图
  realBaseColor: null,    // 生成时使用的 SKU 标准色,变色功能用它做色相基准
  recolorHue: 0,          // 本地变色时的色相偏移 (deg)
  uploadedImage: null,     // 用户上传的 File 对象
  uploadedImageBase64: null, // 用户上传图片的 base64 data URL
  isUploadedImage: false,  // 是否用户上传了图片(而非选择样本)
  threeRendersReady: false, // 3D 模型渲染是否已完成(为 false 时套图显示 loading)
};

const SAMPLES = {
  shoe: {
    name: '鞋子',
    color: '#c0392b',
    edits: {
      title: 'Air Runner Pro',
      subtitle: '城市轻跑系列',
      price: '299',
      origPrice: '599',
      slogans: ['轻量缓震', '透气网面', '防滑大底'],
      sloganDescs: ['EVA 中底回弹', '飞织鞋面通风', 'XPU 防滑橡胶'],
      specs: [
        { label: '尺码', value: '36-46' },
        { label: '重量', value: '约 280g (单只)' },
        { label: '材质', value: '飞织 + 橡胶大底' },
        { label: '适用', value: '日常通勤 / 慢跑' },
      ],
    },
  },
  bag: {
    name: '包袋',
    color: '#5b3a8a',
    edits: {
      title: '云朵手提包',
      subtitle: '轻奢通勤系列',
      price: '799',
      origPrice: '1299',
      slogans: ['头层牛皮', '大容量', '通勤通用'],
      sloganDescs: ['进口意大利植鞣', '可装 14 寸笔电', '商务+出差+约会'],
      specs: [
        { label: '尺寸', value: '34 × 26 × 12 cm' },
        { label: '重量', value: '约 850 g' },
        { label: '材质', value: '头层牛皮 + 真丝内衬' },
        { label: '适用', value: '通勤 / 商务 / 旅行' },
      ],
    },
  },
  bottle: {
    name: '杯具',
    color: '#2c5f8d',
    edits: {
      title: '钛系保温杯',
      subtitle: '24h 长效保温',
      price: '189',
      origPrice: '329',
      slogans: ['钛合金内胆', '24h 保温', '一键开盖'],
      sloganDescs: ['316 食品级钛合金', '6h 水温 ≥ 65°C', '单手即可操作'],
      specs: [
        { label: '容量', value: '500 ml / 750 ml' },
        { label: '重量', value: '约 320 g' },
        { label: '材质', value: '316 钛 + Tritan' },
        { label: '适用', value: '通勤 / 户外 / 健身' },
      ],
    },
  },
  chair: {
    name: '座椅',
    color: '#2c2c2c',
    edits: {
      title: '人体工学办公椅',
      subtitle: '久坐不累系列',
      price: '1299',
      origPrice: '2199',
      slogans: ['腰部承托', '高密度网布', '5 档调节'],
      sloganDescs: ['进口 PA 加纤骨架', '透气不闷热', '坐高/腰托/扶手/靠背/底盘'],
      specs: [
        { label: '承重', value: '150 kg' },
        { label: '高度', value: '110 - 125 cm' },
        { label: '材质', value: '尼龙 + 透气网布' },
        { label: '适用', value: '办公 / 学习 / 电竞' },
      ],
    },
  },
  jewelry: {
    name: '珠宝',
    color: '#c0392b',
    edits: {
      title: '晶莹 · 钻石戒指',
      subtitle: '臻品婚戒系列',
      price: '4980',
      origPrice: '7980',
      slogans: ['18K 玫瑰金', '6 爪经典镶嵌', '主石 0.5 ct'],
      sloganDescs: ['比利时切工', '光线 360° 折射', 'D-IF 顶级净度'],
      specs: [
        { label: '主石', value: '0.5 ct 圆形钻石' },
        { label: '底托', value: '18K 玫瑰金' },
        { label: '工艺', value: '比利时切工 / 镭射编码' },
        { label: '尺码', value: '8 - 23 号 (可调)' },
      ],
    },
  },
  generic: {
    name: '自定义商品',
    color: '#333333',
    edits: {
      title: '我的商品',
      subtitle: '品质之选',
      price: '199',
      origPrice: '399',
      slogans: ['精选材质', '匠心工艺', '品质保证'],
      sloganDescs: ['严选优质原料', '精湛制作工艺', '严格品控检测'],
      specs: [
        { label: '规格', value: '标准款' },
        { label: '材质', value: '高品质材料' },
        { label: '重量', value: '以实物为准' },
        { label: '适用', value: '通用' },
      ],
    },
  },
};

// ============ Templates ============
// Each template controls the background palette + brand/decoration overlay for assets.
const TEMPLATES = {
  minimal: {
    name: '极简',
    bgMain: '#ffffff',
    bgScenes: [
      'linear-gradient(180deg,#eef0f2,#dce0e4)',
      'linear-gradient(180deg,#f2ece0,#e6ddc8)',
      '#1e2228',
    ],
    ink: '#111111',
    inkOnDark: '#f5f5f5',
    priceColor: '#111111',
    overlay: (item, category, idx) => {
      const isDarkBg = category === 'scene' && idx === 2;
      const ink = isDarkBg ? '#f5f5f5' : '#111111';
      const e = state.edits;
      return `
        <text x="14" y="22" font-size="9" font-weight="700" letter-spacing="2" fill="${ink}">${e.brand}</text>
        <line x1="14" y1="27" x2="38" y2="27" stroke="${ink}" stroke-width="1.2"/>
        <text x="186" y="22" text-anchor="end" font-size="6.5" letter-spacing="2" fill="${ink}" opacity="0.55">SS26 · COLLECTION</text>
        <text x="186" y="190" text-anchor="end" font-size="7.5" letter-spacing="1" fill="${ink}" opacity="0.6">${item.label}</text>
      `;
    },
  },

  cny: {
    name: '国潮',
    bgMain: 'linear-gradient(135deg,#f5e9d0,#e8c994)',
    bgScenes: [
      'linear-gradient(180deg,#c47852,#e8b888)',
      'linear-gradient(180deg,#f0d6b0,#d8a878)',
      'linear-gradient(180deg,#722222,#9c3a3a)',
    ],
    ink: '#5c1c1c',
    inkOnDark: '#fdf2e0',
    priceColor: '#a02828',
    overlay: (item, category, idx) => {
      const isDarkBg = category === 'scene' && idx === 2;
      const seal = '#a02828';
      const ink = isDarkBg ? '#fdf2e0' : '#5c1c1c';
      const e = state.edits;
      const cn = e.brandCn || '臻品';
      return `
        <text x="18" y="26" font-size="14" font-family="STSong,SongTi SC,serif" font-weight="700" fill="${seal}">${cn[0] || '臻'}</text>
        <text x="18" y="42" font-size="14" font-family="STSong,SongTi SC,serif" font-weight="700" fill="${seal}">${cn[1] || '品'}</text>
        <rect x="166" y="14" width="22" height="22" fill="${seal}"/>
        <text x="177" y="29" text-anchor="middle" font-size="11" font-weight="700" font-family="STKaiti,KaiTi,serif" fill="#fdf2e0">甄</text>
        <text x="100" y="188" text-anchor="middle" font-size="9" font-family="STSong,serif" letter-spacing="3" fill="${ink}">— ${item.label} —</text>
        <text x="100" y="200" text-anchor="middle" font-size="6.5" letter-spacing="2" fill="${ink}" opacity="0.6">匠 心 之 选</text>
      `;
    },
  },

  outdoor: {
    name: '户外',
    bgMain: 'linear-gradient(180deg,#9bb0c0,#c2b48a)',
    bgScenes: [
      'linear-gradient(180deg,#4e7090,#7895a8)',
      'linear-gradient(180deg,#7c9460,#9aac80)',
      'linear-gradient(180deg,#384a58,#5e7382)',
    ],
    ink: '#2d4a3a',
    inkOnDark: '#e8eee4',
    priceColor: '#2d4a3a',
    overlay: (item, category, idx) => {
      const isDark = category === 'scene' && idx === 2;
      const ink = isDark ? '#e8eee4' : '#2d4a3a';
      const e = state.edits;
      return `
        <text x="14" y="24" font-size="13" font-weight="800" letter-spacing="2" fill="${ink}">${e.brand}</text>
        <text x="14" y="35" font-size="6.5" letter-spacing="3" fill="${ink}" opacity="0.75">PERFORMANCE WEAR</text>
        <path d="M 162 30 L 174 14 L 184 24 L 190 18 L 192 30 Z" fill="${ink}" opacity="0.85"/>
        <path d="M 0 175 L 35 168 L 65 175 L 100 165 L 140 175 L 170 170 L 200 175 L 200 200 L 0 200 Z" fill="${ink}" opacity="0.18"/>
        <rect x="14" y="180" width="78" height="14" rx="1" fill="${ink}"/>
        <text x="53" y="190" text-anchor="middle" font-size="8" font-weight="600" letter-spacing="1" fill="#fff">${item.label}</text>
        <text x="186" y="190" text-anchor="end" font-size="7" fill="${ink}" font-weight="600">¥ ${e.price}</text>
      `;
    },
  },

  festival: {
    name: '大促',
    bgMain: 'linear-gradient(135deg,#e74c3c,#c0392b)',
    bgScenes: [
      'linear-gradient(135deg,#f39c12,#e74c3c)',
      'linear-gradient(135deg,#c0392b,#922b21)',
      'linear-gradient(135deg,#fde047,#f39c12)',
    ],
    ink: '#fff',
    inkOnDark: '#fff',
    priceColor: '#c0392b',
    overlay: (item, category, idx) => {
      const goldOnRed = !(category === 'scene' && idx === 2);
      const accent = goldOnRed ? '#ffeb3b' : '#c0392b';
      const ink = goldOnRed ? '#fff' : '#c0392b';
      const e = state.edits;
      const discount = Math.max(0, parseInt(e.origPrice) - parseInt(e.price)) || 50;
      return `
        <text x="14" y="24" font-size="13" font-weight="800" fill="${ink}">限时特惠</text>
        <text x="14" y="38" font-size="9" font-weight="600" fill="${accent}">立减 ${discount} 元</text>
        <circle cx="172" cy="32" r="22" fill="${accent}" stroke="#fff" stroke-width="1.5"/>
        <text x="172" y="28" text-anchor="middle" font-size="7" font-weight="700" fill="#c0392b">特惠价</text>
        <text x="172" y="42" text-anchor="middle" font-size="12" font-weight="800" fill="#c0392b">¥${e.price}</text>
        <rect x="0" y="178" width="200" height="22" fill="rgba(0,0,0,0.35)"/>
        <text x="100" y="192" text-anchor="middle" font-size="7.5" font-weight="600" fill="#fff" letter-spacing="1">✓ 顺丰包邮   ✓ 7天无理由   ✓ 假一赔十</text>
      `;
    },
  },
};

// ============ DOM Setup ============
const $ = (id) => document.getElementById(id);

document.querySelectorAll('.sample-btn').forEach(btn => {
  btn.addEventListener('click', () => selectSample(btn.dataset.sample));
});

$('upload-card').addEventListener('click', () => $('file-input').click());
$('file-input').addEventListener('change', (e) => {
  if (e.target.files[0]) {
    const file = e.target.files[0];
    state.uploadedImage = file;
    state.isUploadedImage = true;
    // 上传图片时不预设任何商品类别,使用通用类型避免影响生成
    state.productType = 'generic';
    const url = URL.createObjectURL(file);
    const reader = new FileReader();
    reader.onload = () => {
      state.uploadedImageBase64 = reader.result;
    };
    reader.readAsDataURL(file);
    // 使用通用预设文案,不根据类别限制生成内容
    const gen = SAMPLES.generic;
    if (gen) {
      state.color = gen.color;
      Object.assign(state.edits, JSON.parse(JSON.stringify(gen.edits)));
      syncEditInputs();
    }
    showPreview(url, file.name, 'generic');
    // 类别选择器作为可选选项,不影响生成逻辑
    $('preview-type-wrap').style.display = 'flex';
  }
});

// 上传图片时的商品类别切换(仅影响文案预设,不影响 3D/图片生成)
$('upload-type-select')?.addEventListener('change', (e) => {
  if (state.isUploadedImage) {
    state._displayType = e.target.value;
    const sample = SAMPLES[e.target.value];
    if (sample) {
      state.color = sample.color;
      Object.assign(state.edits, JSON.parse(JSON.stringify(sample.edits)));
      syncEditInputs();
    }
  }
});

$('sku-card').addEventListener('click', (e) => {
  if (e.target.tagName !== 'INPUT') $('sku-input').focus();
});
$('sku-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && e.target.value) {
    state.isUploadedImage = false;
    state.uploadedImage = null;
    state.uploadedImageBase64 = null;
    $('preview-type-wrap').style.display = 'none';
    showPreview(samplePreviewSVG('bag'), e.target.value.slice(0, 40) + (e.target.value.length > 40 ? '...' : ''), 'bag');
  }
});

$('start-btn').addEventListener('click', runPipeline);
$('restart-btn').addEventListener('click', () => location.reload());

let currentTab = 'main';
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentTab = btn.dataset.tab;
    renderAssetGrid(currentTab);
  });
});

document.querySelectorAll('.platform-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const platforms = { taobao: '淘宝', jd: '京东', douyin: '抖音' };
    const name = platforms[btn.dataset.platform];
    toast(`已同步到${name},商品 ID:SKU-${Math.floor(Math.random()*90000)+10000}`);
  });
});

document.querySelectorAll('.template-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.classList.contains('active')) return;
    document.querySelectorAll('.template-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.template = btn.dataset.template;
    renderAssetGrid(currentTab);
    renderDetailImage();
    toast('已切换至「' + TEMPLATES[state.template].name + '」模版');
  });
});

// ===== Mode switch (mock vs real API) =====
document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.classList.contains('active')) return;
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.mode = btn.dataset.mode;
    if (state.mode === 'real') {
      toast('真实生成 · Tripo 3D + Z-Image 文生图');
      $('time-text').textContent = 'Tripo + Z-Image · 预计 2-3 分钟';
      const est = document.querySelector('.preview-est');
      if (est) est.textContent = '预计 2-3 分钟 · 真实调用 Tripo / Z-Image';
    } else {
      toast('演示模式 · 瞬时生成');
      $('time-text').textContent = '演示模式 · 流程演示无 API 调用';
      const est = document.querySelector('.preview-est');
      if (est) est.textContent = '演示模式 · 几秒钟跑完流程';
    }
  });
});

// ===== Edit panel inputs =====
let editTimer = null;
function scheduleEditRender() {
  clearTimeout(editTimer);
  editTimer = setTimeout(() => {
    renderAssetGrid(currentTab);
    renderDetailImage();
  }, 80);
}

document.querySelectorAll('.edit-input').forEach(inp => {
  inp.addEventListener('input', () => {
    state.edits[inp.dataset.edit] = inp.value;
    scheduleEditRender();
  });
});

document.querySelectorAll('.slogan-title').forEach(inp => {
  inp.addEventListener('input', () => {
    state.edits.slogans[+inp.dataset.i] = inp.value;
    scheduleEditRender();
  });
});

document.querySelectorAll('.slogan-desc').forEach(inp => {
  inp.addEventListener('input', () => {
    state.edits.sloganDescs[+inp.dataset.i] = inp.value;
    scheduleEditRender();
  });
});

document.querySelectorAll('.spec-label').forEach(inp => {
  inp.addEventListener('input', () => {
    state.edits.specs[+inp.dataset.i].label = inp.value;
    scheduleEditRender();
  });
});

document.querySelectorAll('.spec-value').forEach(inp => {
  inp.addEventListener('input', () => {
    state.edits.specs[+inp.dataset.i].value = inp.value;
    scheduleEditRender();
  });
});

document.querySelectorAll('.sec-toggle').forEach(cb => {
  cb.addEventListener('change', () => {
    state.detailSections[cb.dataset.section] = cb.checked;
    renderDetailImage();
  });
});

const downloadDetailBtn = document.getElementById('download-detail');
if (downloadDetailBtn) {
  downloadDetailBtn.addEventListener('click', downloadDetailImage);
}

// ============ Sample preview SVGs ============
function samplePreviewSVG(type) {
  // Use the same 2D product representation as asset cards for consistency
  const color = SAMPLES[type].color;
  const inner = productAsSVG(type, color, 0, 1);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <rect width="200" height="200" fill="#fafafa"/>
    ${inner}
  </svg>`;
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

function selectSample(type) {
  // 清除用户上传的图片状态,切回样本模式
  state.isUploadedImage = false;
  state.uploadedImage = null;
  state.uploadedImageBase64 = null;
  $('preview-type-wrap').style.display = 'none';
  state.threeRendersReady = true; // 样本模式直接显示编辑区
  updateEditorState();
  state.productType = type;
  const sample = SAMPLES[type];
  state.color = sample.color;
  document.querySelectorAll('.sample-btn').forEach(b => b.classList.toggle('active', b.dataset.sample === type));
  // Apply sample-specific edits (title, slogans, specs, price)
  if (sample.edits) {
    Object.assign(state.edits, JSON.parse(JSON.stringify(sample.edits)));
    syncEditInputs();
    // If result is visible, re-render to reflect new edits
    if ($('step-result') && $('step-result').style.display !== 'none') {
      renderAssetGrid(currentTab);
      renderDetailImage();
    }
  }
  showPreview(samplePreviewSVG(type), sample.name, type);
}

function syncEditInputs() {
  document.querySelectorAll('.edit-input').forEach(inp => {
    const key = inp.dataset.edit;
    if (state.edits[key] !== undefined) inp.value = state.edits[key];
  });
  document.querySelectorAll('.slogan-title').forEach(inp => {
    inp.value = state.edits.slogans[+inp.dataset.i] || '';
  });
  document.querySelectorAll('.slogan-desc').forEach(inp => {
    inp.value = state.edits.sloganDescs[+inp.dataset.i] || '';
  });
  document.querySelectorAll('.spec-label').forEach(inp => {
    inp.value = (state.edits.specs[+inp.dataset.i] || {}).label || '';
  });
  document.querySelectorAll('.spec-value').forEach(inp => {
    inp.value = (state.edits.specs[+inp.dataset.i] || {}).value || '';
  });
}

function showPreview(src, name, type) {
  state.productType = type;
  $('preview-img').src = src;
  $('preview-name').textContent = name;
  $('preview-row').style.display = 'flex';
}

// ============ Pipeline ============
const LOGS = [
  { delay: 100,  msg: '读取输入图像', type: 'info' },
  { delay: 350,  msg: '识别商品类型', type: 'info' },
  { delay: 650,  msg: '生成三维网格 (14,832 面)', type: 'ok' },
  { delay: 950,  msg: 'UV 展开与材质烘焙', type: 'info' },
  { delay: 1250, msg: '基础模型就绪', type: 'ok' },
  { delay: 1500, msg: '加载套图模版库 (4 套)', type: 'info' },
  { delay: 1750, msg: '默认套用「极简」模版', type: 'info' },
  { delay: 2000, msg: '版式与品牌字体应用完毕', type: 'ok' },
  { delay: 2200, msg: '渲染 5 张主图', type: 'info' },
  { delay: 2500, msg: '合成 3 张场景图', type: 'info' },
  { delay: 2750, msg: '生成细节与变体图', type: 'info' },
  { delay: 3000, msg: '适配平台尺寸 (淘宝 / 京东 / 抖音)', type: 'info' },
  { delay: 3200, msg: '全部素材生成完毕,可直接上架', type: 'ok' },
];

async function runPipeline() {
  state.startTime = Date.now();
  $('step-pipeline').style.display = 'block';
  $('step-input').style.opacity = '0.6';
  $('step-input').style.pointerEvents = 'none';
  $('step-pipeline').scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Reset visuals
  document.querySelectorAll('.pipe-step').forEach(s => {
    s.classList.remove('active', 'done');
    s.querySelector('.pipe-bar').style.width = '0%';
  });
  $('pipeline-log').innerHTML = '';
  $('pipeline-status').textContent = '运行中';

  // Reset any previous real-mode state
  state.realModelUrl = null;
  state.realAssets = {};
  state.realHeroImage = null;
  state.realBaseColor = null;
  state.threeRendersReady = false; // 3D 完成前套图区域显示 loading
  updateEditorState();

  if (state.mode === 'real') {
    await runRealPipeline();
  } else {
    await runMockPipeline();
  }

  $('pipeline-status').textContent = '已完成';
  showResult();
}

async function runMockPipeline() {
  const steps = document.querySelectorAll('.pipe-step');
  const stepDurations = [900, 800, 900, 600];
  for (let i = 0; i < steps.length; i++) {
    steps[i].classList.add('active');
    const bar = steps[i].querySelector('.pipe-bar');
    bar.style.transition = `width ${stepDurations[i]}ms linear`;
    bar.style.width = '100%';
    await sleep(stepDurations[i]);
    steps[i].classList.remove('active');
    steps[i].classList.add('done');
  }
  LOGS.forEach(log => {
    setTimeout(() => addLog(log.msg, log.type), log.delay);
  });
  await sleep(400);
}

// ---- Real pipeline: call Tripo + Z-Image via /api proxy ----
async function runRealPipeline() {
  const steps = document.querySelectorAll('.pipe-step');
  // 生成时锁定 SKU 标准色作为变色功能的基准
  state.realBaseColor = SAMPLES[state.productType]?.color || state.color;
  // 上传图片时使用通用类型生成提示词,避免被预设类别带偏
  const genType = state.isUploadedImage ? 'generic' : state.productType;
  const productPrompt = makeProductPrompt(genType, state.color, state.edits);
  const imagePrompts = makeAssetPrompts(genType, state.color, state.edits);

  // ---- 状态条: 显示 + 初始化所有缩略图占位 ----
  $('pipeline-statusbar').style.display = 'flex';
  initStatusThumbs(imagePrompts);
  const startTime = Date.now();
  const phaseTimer = startPhaseRotator(startTime);

  try {
    // ===== Step 1: 启动 Tripo 3D =====
    setStep(0, true);
    addLog(`提示词: ${productPrompt.short}`, 'info');
    addLog('提交 Tripo 3D 任务...', 'info');

    const tripoTaskId = await startTripoTask(productPrompt.full);
    if (!tripoTaskId) throw new Error('Tripo 任务启动失败');
    addLog(`Tripo task_id: ${tripoTaskId.slice(0, 12)}...`, 'ok');
    setStepProgress(0, 100);

    // ===== AI 分析: 自动生成商品文案 (后台不阻塞) =====
    if (state.isUploadedImage && state.uploadedImageBase64) {
      analyzeProductImage(state.uploadedImageBase64).then(ai => {
        if (!ai || !ai.title) return;
        addLog(`AI 生成文案: ${ai.title}`, 'ok');
        if (ai.brand) state.edits.brand = ai.brand;
        if (ai.brandCn) state.edits.brandCn = ai.brandCn;
        if (ai.title) state.edits.title = ai.title;
        if (ai.subtitle) state.edits.subtitle = ai.subtitle;
        if (ai.price) state.edits.price = String(ai.price);
        if (ai.origPrice) state.edits.origPrice = String(ai.origPrice);
        if (Array.isArray(ai.slogans)) ai.slogans.forEach((s,i)=>{if(i<3)state.edits.slogans[i]=s});
        if (Array.isArray(ai.sloganDescs)) ai.sloganDescs.forEach((s,i)=>{if(i<3)state.edits.sloganDescs[i]=s});
        if (Array.isArray(ai.specs)) ai.specs.forEach((s,i)=>{if(i<4&&state.edits.specs[i]){if(s.label)state.edits.specs[i].label=s.label;if(s.value)state.edits.specs[i].value=s.value}});
        syncEditInputs();
        try { if ($('step-result').style.display !== 'none') renderDetailImage(); } catch {}
      }).catch(err => { console.warn('AI 文案生成失败:', err); });
    }

    // ===== Step 2: 并发提交全部 Z-Image 任务 =====
    setStep(1, true);
    addLog(`并发提交 ${imagePrompts.length} 个 Z-Image 任务 (主图 / 场景 / 细节 / 变体 / Hero)`, 'info');
    let completed = 0;
    const totalGens = imagePrompts.length;

    // 启动 Tripo 轮询 (后台进行,不阻塞)
    const tripoPromise = pollTaskUntilDone(tripoTaskId, 'Tripo 3D', (st, elapsed) => {
      // step 2 进度条根据 Tripo 时间推进
      // do nothing here, status bar 的 phaseTimer 已经在更新文案
    });

    // 并发跑所有图片生成 (限流 4,失败自动重试 2 次)
    const gate = gateLimit(4);
    const imagePromises = imagePrompts.map((p) => {
      markThumb(p.slot, 'running');
      return gate(() => callImageGenWithRetry(p.prompt, '1024*1024'))
        .then(url => {
          const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
          state.realAssets[p.slot] = url;
          if (p.slot === 'hero') state.realHeroImage = url;
          markThumb(p.slot, 'done', url);
          completed++;
          updateThumbCount(completed, totalGens);
          addLog(`✓ ${labelOfSlot(p.slot)}  已就绪  (${elapsed}s)`, 'ok');
          setStepProgress(1, 10 + (completed / totalGens) * 90);
          // 结果区已经展示时,实时刷新对应的卡片 / 详情图
          if ($('step-result').style.display !== 'none') {
            try {
              renderAssetGrid(currentTab);
              renderDetailImage();
            } catch {}
          }
          return { slot: p.slot, url };
        })
        .catch(err => {
          markThumb(p.slot, 'fail');
          addLog(`× ${labelOfSlot(p.slot)}  ${err.message || err}`, 'warn');
          return { slot: p.slot, url: null };
        });
    });

    // 等到至少 6 张图就绪就展示结果(不必等全 13 张)
    await raceUntilCount(imagePromises, Math.min(6, imagePrompts.length));
    setStep(2, true);
    setStepProgress(1, (completed / totalGens) * 100);
    addLog(`首批素材就绪 (${completed}/${totalGens}),提前展示`, 'ok');

    // ===== Step 3: 提前展示结果,Tripo 继续在后台 =====
    setPhase('套图就绪 · 3D 模型仍在生成,稍后自动加载');
    showResult();
    setStepProgress(2, 30);

    // 后台等 Tripo 完成 (不阻塞 UI)
    let tripoDone = false;
    let imagesDone = false;
    const finalize = () => {
      if (!tripoDone || !imagesDone) return;
      setPhase('全部完成');
      clearInterval(phaseTimer);
      const spinner = document.querySelector('.sb-spinner');
      if (spinner) {
        spinner.style.borderTopColor = '#16a34a';
        spinner.style.animation = 'none';
      }
    };

    tripoPromise.then(glbUrl => {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
      if (glbUrl) {
        state.realModelUrl = glbUrl;
        addLog(`✓ Tripo GLB 就绪  (${elapsed}s)`, 'ok');
        setStepProgress(2, 100);
        setStep(3, true);
        setStepProgress(3, 100);
        if (state.scene) loadGLBIntoScene(glbUrl);
        toast('3D 模型已加载完成');
      } else {
        addLog('Tripo 未返回 GLB,回退程序化模型', 'warn');
        hideThreeLoading();
        if (state.scene && !state.productMesh) {
          const fallback = buildProductMesh(state.productType, state.color);
          state.scene.add(fallback);
          state.productMesh = fallback;
        }
        // Tripo 失败时放行,让 Z-Image 结果(或程序化 SVG)显示出来
        state.threeRendersReady = true;
        updateEditorState();
        try { renderAssetGrid(currentTab); renderDetailImage(); } catch {}
      }
      tripoDone = true;
      finalize();
    }).catch(err => {
      addLog('Tripo 失败: ' + (err.message || err), 'warn');
      hideThreeLoading();
      if (state.scene && !state.productMesh) {
        const fallback = buildProductMesh(state.productType, state.color);
        state.scene.add(fallback);
        state.productMesh = fallback;
      }
      // Tripo 失败时放行,让 Z-Image 结果(或程序化 SVG)显示出来
      state.threeRendersReady = true;
      updateEditorState();
      try { renderAssetGrid(currentTab); renderDetailImage(); } catch {}
      tripoDone = true;
      finalize();
    });

    // 等所有图片完成 (含重试 / 失败) 后再标"全部完成"
    Promise.allSettled(imagePromises).then(() => {
      addLog(`Z-Image 全部任务结束 (${completed}/${totalGens})`, completed === totalGens ? 'ok' : 'warn');
      imagesDone = true;
      finalize();
      // 最后再刷一次,确保所有就绪的图都进入卡片
      if ($('step-result').style.display !== 'none') {
        try { renderAssetGrid(currentTab); renderDetailImage(); } catch {}
      }
    });

    // 让 runPipeline 立刻结束 (Tripo 在后台跑)
  } catch (err) {
    console.error('real pipeline error', err);
    const msg = String(err.message || err);
    addLog('错误: ' + msg, 'warn');
    if (/not activated|未开通/i.test(msg)) {
      toast('Tripo 模型未在账号下开通,请到百炼控制台「模型市场」开通后重试');
    } else {
      toast('真实生成失败:' + msg.slice(0, 60));
    }
    clearInterval(phaseTimer);
  }
}

// ============ 实时状态条 ============
function labelOfSlot(slot) {
  const map = {
    'main-0': '主图 正面', 'main-1': '主图 45°', 'main-2': '主图 侧面', 'main-3': '主图 俯视', 'main-4': '主图 背面',
    'scene-0': '场景 户外', 'scene-1': '场景 室内', 'scene-2': '场景 工作室',
    'detail-0': '细节 材质', 'detail-1': '细节 Logo',
    'variant-0': '变体 红', 'variant-1': '变体 蓝',
    'hero': '详情 Hero',
  };
  return map[slot] || slot;
}

function slotMatchesTab(slot, tab) {
  return slot.startsWith(tab + '-') || (tab === 'main' && slot === 'hero');
}

function initStatusThumbs(prompts) {
  const wrap = $('sb-thumbs');
  wrap.innerHTML = '';
  // 紧凑显示 5+3+2+2+1 = 13,但只显示前 8 个用 +N 表示其余
  const shown = prompts.slice(0, 8);
  shown.forEach(p => {
    const t = document.createElement('div');
    t.className = 'sb-thumb pending';
    t.dataset.slot = p.slot;
    t.title = labelOfSlot(p.slot);
    wrap.appendChild(t);
  });
  if (prompts.length > 8) {
    const more = document.createElement('div');
    more.className = 'sb-thumb pending';
    more.textContent = '+' + (prompts.length - 8);
    wrap.appendChild(more);
  }
  updateThumbCount(0, prompts.length);
}

function markThumb(slot, status, url) {
  const wrap = $('sb-thumbs');
  if (!wrap) return;
  const t = wrap.querySelector(`[data-slot="${slot}"]`);
  if (!t) return;
  t.classList.remove('pending', 'running', 'done', 'fail');
  t.classList.add(status);
  if (status === 'done' && url) {
    t.innerHTML = `<img src="${proxyImageUrl(url)}" alt="" referrerpolicy="no-referrer">`;
  } else if (status === 'fail') {
    t.textContent = '!';
  }
}

function updateThumbCount(done, total) {
  const el = $('sb-count');
  if (el) el.textContent = `${done}/${total}`;
}

function setPhase(text) {
  const el = $('sb-phase');
  if (el) el.textContent = text;
}

// ============ 并发限流闸门 ============
function gateLimit(concurrency = 4) {
  const queue = [];
  let running = 0;
  function pump() {
    while (running < concurrency && queue.length > 0) {
      const job = queue.shift();
      running++;
      Promise.resolve()
        .then(job.fn)
        .then(job.resolve, job.reject)
        .finally(() => { running--; pump(); });
    }
  }
  return function wrap(fn) {
    return new Promise((resolve, reject) => {
      queue.push({ fn, resolve, reject });
      pump();
    });
  };
}

// 带重试的 Z-Image 调用
async function callImageGenWithRetry(prompt, size, retries = 2, retryDelay = 2500) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const url = await callImageGen(prompt, size);
      if (url) return url;
      throw new Error('empty url');
    } catch (err) {
      lastErr = err;
      if (attempt < retries) {
        await sleep(retryDelay * (attempt + 1));
      }
    }
  }
  throw lastErr;
}

function raceUntilCount(promises, n) {
  let done = 0;
  return new Promise(resolve => {
    if (n <= 0 || promises.length === 0) return resolve();
    promises.forEach(p => Promise.resolve(p).then(() => {
      if (++done >= n) resolve();
    }, () => {
      if (++done >= n) resolve();
    }));
  });
}

function startPhaseRotator(startTime) {
  const phases = [
    [0,   '提交任务,准备资源'],
    [12,  '解析提示词 · 加载 Tripo 模型'],
    [25,  '粗几何重建中'],
    [50,  '网格细化 14,832 → 28,400 面'],
    [80,  'UV 展开 + 材质烘焙'],
    [110, 'PBR 纹理生成'],
    [140, '导出 GLB · 收尾中'],
    [170, '即将完成,正在压缩'],
  ];

  function fmt(s) {
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}:${String(r).padStart(2, '0')}`;
  }

  function tick() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    let cur = phases[0][1];
    for (const [t, txt] of phases) {
      if (elapsed >= t) cur = txt;
    }
    setPhase(cur);
    const elapsedEl = $('sb-elapsed');
    if (elapsedEl) elapsedEl.textContent = `已运行 ${fmt(elapsed)}`;
    const eta = Math.max(0, 150 - elapsed);
    const etaEl = $('sb-eta');
    if (etaEl) etaEl.textContent = eta > 0 ? `预计还需 ${fmt(eta)}` : '即将完成';
  }
  tick();
  return setInterval(tick, 1000);
}

function setStep(idx, active) {
  const steps = document.querySelectorAll('.pipe-step');
  for (let i = 0; i <= idx; i++) {
    if (i < idx) {
      steps[i].classList.remove('active');
      steps[i].classList.add('done');
      const bar = steps[i].querySelector('.pipe-bar');
      bar.style.transition = 'width 300ms linear';
      bar.style.width = '100%';
    } else if (i === idx && active) {
      steps[i].classList.add('active');
    }
  }
}
function setStepProgress(idx, pct) {
  const steps = document.querySelectorAll('.pipe-step');
  const bar = steps[idx]?.querySelector('.pipe-bar');
  if (bar) {
    bar.style.transition = 'width 500ms linear';
    bar.style.width = Math.min(100, pct) + '%';
  }
}

// ---- Prompt builders ----
// 真实生成使用 SKU 自带的"标准色",与用户在调色板里挑的颜色无关 — 颜色后处理
function makeProductPrompt(type, color, edits) {
  const baseColor = SAMPLES[type]?.color || color;
  const colorWords = {
    '#c0392b': 'red', '#2c5f8d': 'blue', '#3a7d44': 'green',
    '#d4a017': 'yellow gold', '#2c2c2c': 'black', '#5b3a8a': 'purple',
  };
  const c = colorWords[baseColor] || 'colored';
  const title = edits.title || '';
  // 用户上传图片时,Tripo 走图生 3D,prompt 仅做辅助说明
  const refPrefix = state.uploadedImageBase64 ? '根据参考图生成: ' : '';
  const base = {
    shoe:    `${refPrefix}a ${c} shoe, footwear product, 3d model, isolated on white`,
    bag:     `${refPrefix}a ${c} bag, handbag or backpack, 3d model`,
    bottle:  `${refPrefix}a ${c} bottle, drinking container, modern design, 3d model`,
    chair:   `${refPrefix}a ${c} chair, seating furniture, 3d model`,
    jewelry: `${refPrefix}a ${c} jewelry item, accessory, 3d model`,
  }[type] || `${refPrefix}a ${c} product, 3d model`;
  return { short: base.slice(0, 60), full: base + ', ' + (title ? title + ', ' : '') + 'product photography, high quality' };
}

function makeAssetPrompts(type, color, edits) {
  const baseColor = SAMPLES[type]?.color || color;
  const colorWords = {
    '#c0392b': '红色', '#2c5f8d': '蓝色', '#3a7d44': '绿色',
    '#d4a017': '金黄色', '#2c2c2c': '黑色', '#5b3a8a': '紫色',
  };
  const c = colorWords[baseColor] || '彩色';
  const productCn = {
    shoe: '鞋子', bag: '包袋', bottle: '杯具', chair: '座椅', jewelry: '珠宝',
  }[type] || '商品';
  const baseStyle = '电商商品摄影, 简洁干净, 高质量, 8K, 锐利清晰, 无水印';
  const whiteBg = '纯白背景, 摄影棚灯光';

  return [
    { slot: 'main-0', prompt: `${c}${productCn}, 正面平拍, ${whiteBg}, ${baseStyle}` },
    { slot: 'main-1', prompt: `${c}${productCn}, 45度斜视角, ${whiteBg}, ${baseStyle}` },
    { slot: 'main-2', prompt: `${c}${productCn}, 侧面视角, ${whiteBg}, ${baseStyle}` },
    { slot: 'main-3', prompt: `${c}${productCn}, 俯视角度, ${whiteBg}, ${baseStyle}` },
    { slot: 'main-4', prompt: `${c}${productCn}, 背面视角, ${whiteBg}, ${baseStyle}` },
    { slot: 'scene-0', prompt: `${c}${productCn}, 户外阳光场景, 自然光摄影, 生活方式, ${baseStyle}` },
    { slot: 'scene-1', prompt: `${c}${productCn}, 现代室内场景, 暖色调, 生活方式摄影, ${baseStyle}` },
    { slot: 'scene-2', prompt: `${c}${productCn}, 工作室深色背景, 戏剧化布光, ${baseStyle}` },
    { slot: 'detail-0', prompt: `${c}${productCn} 材质特写, 微距摄影, ${whiteBg}, ${baseStyle}` },
    { slot: 'detail-1', prompt: `${c}${productCn} Logo 区域特写, 微距, ${whiteBg}, ${baseStyle}` },
    { slot: 'variant-0', prompt: `红色${productCn}, 45度视角, ${whiteBg}, ${baseStyle}` },
    { slot: 'variant-1', prompt: `蓝色${productCn}, 45度视角, ${whiteBg}, ${baseStyle}` },
    { slot: 'hero', prompt: `${c}${productCn}, 极具质感的产品大图, ${whiteBg}, 顶级电商主图, ${baseStyle}` },
  ];
}

// ---- API callers (via /api proxy) ----
async function startTripoTask(prompt) {
  const body = { texture_quality: 'standard' };

  // 如果用户上传了图片,传给 Tripo 做图生 3D(同时保留文本提示做辅助)
  if (state.uploadedImageBase64) {
    body.image = state.uploadedImageBase64;
    body.prompt = prompt;
    addLog('使用用户上传图片进行 3D 重建', 'info');
  } else {
    body.prompt = prompt;
  }

  const r = await fetch('/api/3d/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await r.json();
  if (!r.ok || data.code) {
    throw new Error(`Tripo 失败: ${data.code || r.status} ${data.message || ''}`);
  }
  return data.output?.task_id;
}

async function callImageGen(prompt, size = '1024*1024') {
  const r = await fetch('/api/image/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, size, n: 1 }),
  });
  const data = await r.json();
  if (!r.ok || data.code) {
    throw new Error(`Z-Image 失败: ${data.code || r.status} ${data.message || ''}`);
  }
  // 解析: output.choices[0].message.content[0].image
  const content = data.output?.choices?.[0]?.message?.content || [];
  const imgItem = content.find(c => c.image);
  return imgItem?.image || null;
}

// ---- 商品图片 AI 分析:自动生成品牌、标题、卖点等文案 ----
async function analyzeProductImage(base64Image) {
  if (!base64Image) return null;
  const prompt = '你是一位电商运营专家。请分析这张商品图片,以JSON格式返回以下字段:\n'
    + '{\n'
    + '  "brand": "建议的品牌英文名(1-2个单词)",\n'
    + '  "brandCn": "建议的品牌中文名(2个字,如\'云舟\')",\n'
    + '  "title": "商品标题(简洁有力,不超过15字)",\n'
    + '  "subtitle": "副标题(不超过10字,如\'轻奢通勤系列\')",\n'
    + '  "price": "建议售价(数字,整数)",\n'
    + '  "origPrice": "建议划线价(数字,整数,比售价高30-100%)",\n'
    + '  "slogans": ["卖点1(4字)", "卖点2(4字)", "卖点3(4字)"],\n'
    + '  "sloganDescs": ["卖点1描述(不超过10字)", "卖点2描述", "卖点3描述"],\n'
    + '  "specs": [\n'
    + '    {"label": "规格一", "value": "值"},\n'
    + '    {"label": "规格二", "value": "值"},\n'
    + '    {"label": "材质", "value": "主要材质描述"},\n'
    + '    {"label": "适用", "value": "适用场景"}\n'
    + '  ]\n'
    + '}\n'
    + '只返回JSON,不要其他文字。';
  try {
    const r = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Image }),
    });
    const data = await r.json();
    addLog('商品 AI 分析完成,正在生成文案...', 'info');
    const content = data.output?.choices?.[0]?.message?.content || '';
    // 尝试解析 JSON:优先找 ```json ... ``` 块,否则全文提取
    let json = null;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    const raw = jsonMatch ? jsonMatch[1].trim() : content.trim();
    // 找第一个 { 和最后一个 } 之间的内容
    const braceStart = raw.indexOf('{');
    const braceEnd = raw.lastIndexOf('}');
    if (braceStart !== -1 && braceEnd > braceStart) {
      try { json = JSON.parse(raw.slice(braceStart, braceEnd + 1)); } catch {}
    }
    if (!json) {
      addLog('× 商品 AI 分析解析失败,继续使用默认文案', 'warn');
      return null;
    }
    if (!json.title) return null;
    return json;
  } catch (err) {
    addLog(`× 商品 AI 分析失败: ${err.message}`, 'warn');
    console.warn('商品分析失败:', err);
    return null;
  }
}

async function pollTaskUntilDone(taskId, label = 'task', onProgress, intervalMs = 5000, maxMs = 8 * 60 * 1000) {
  const start = Date.now();
  let lastStatus = '';
  while (Date.now() - start < maxMs) {
    await sleep(intervalMs);
    const r = await fetch(`/api/poll/${taskId}`);
    const data = await r.json();
    const status = data.output?.task_status || 'UNKNOWN';
    const elapsed = Date.now() - start;
    if (onProgress) onProgress(status, elapsed);
    if (status !== lastStatus) {
      addLog(`${label}: ${status}  (${Math.round(elapsed/1000)}s)`, status === 'SUCCEEDED' ? 'ok' : 'info');
      lastStatus = status;
    }
    if (status === 'SUCCEEDED') {
      // 阿里云百炼 Tripo 的 GLB URL 在 output.results[0].pbr_model_url
      const out = data.output;
      return out.results?.[0]?.pbr_model_url
          || out.results?.[0]?.model_url
          || out.results?.[0]?.url
          || out.output_glb_url
          || null;
    }
    if (status === 'FAILED' || status === 'CANCELED') {
      const out = data.output || {};
      throw new Error(`${label} ${status}: ${out.code || ''} ${out.message || ''}`.trim());
    }
  }
  throw new Error(`${label} 超时`);
}

function addLog(msg, type='info') {
  const el = $('pipeline-log');
  const line = document.createElement('div');
  line.className = 'log-line ' + type;
  const now = new Date();
  const ts = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
  line.innerHTML = `<span class="log-ts">${ts}</span>${msg}`;
  el.appendChild(line);
  el.scrollTop = el.scrollHeight;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ============ Result ============
function showResult() {
  $('step-result').style.display = 'block';
  $('step-result').scrollIntoView({ behavior: 'smooth', block: 'start' });
  updateEditorState();

  // 在真实模式下显示真实耗时;否则显示假数据
  if (state.mode === 'real' && state.startTime) {
    const sec = Math.floor((Date.now() - state.startTime) / 1000);
    const mm = String(Math.floor(sec / 60)).padStart(2, '0');
    const ss = String(sec % 60).padStart(2, '0');
    $('elapsed').textContent = `${mm}:${ss}`;
  } else {
    const fakeSec = 280 + Math.floor(Math.random() * 30);
    const mm = String(Math.floor(fakeSec / 60)).padStart(2, '0');
    const ss = String(fakeSec % 60).padStart(2, '0');
    $('elapsed').textContent = `${mm}:${ss}`;
  }

  // 幂等:已经初始化过 3D 场景就不重置 (避免覆盖已加载的 GLB)
  if (!state.scene) {
    initThreeJS();
  } else if (state.realModelUrl && !state.productMesh?.isObject3D) {
    // 边界情况:scene 在但 mesh 丢了 — 重新加载
    loadGLBIntoScene(state.realModelUrl);
  }
  renderAssetGrid(currentTab || 'main');
  renderDetailImage();
}

// ============ Three.js 3D Viewer ============
function initThreeJS() {
  const container = $('three-canvas');
  container.innerHTML = '';
  const w = container.clientWidth;
  const h = container.clientHeight;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xfafafa);
  const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
  camera.position.set(3.5, 2.5, 4.5);

  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // Lighting (light, neutral)
  const ambient = new THREE.AmbientLight(0xffffff, 0.55);
  scene.add(ambient);
  const dir = new THREE.DirectionalLight(0xffffff, 0.95);
  dir.position.set(5, 8, 5);
  dir.castShadow = true;
  dir.shadow.mapSize.width = 1024;
  dir.shadow.mapSize.height = 1024;
  dir.shadow.camera.left = -5;
  dir.shadow.camera.right = 5;
  dir.shadow.camera.top = 5;
  dir.shadow.camera.bottom = -5;
  scene.add(dir);
  const fill = new THREE.DirectionalLight(0xffffff, 0.25);
  fill.position.set(-5, 3, -5);
  scene.add(fill);

  // Ground - subtle light circle
  const groundGeo = new THREE.CircleGeometry(8, 64);
  const groundMat = new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.9 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -1.2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Product mesh — 真实模式没拿到 GLB 之前显示 loading 占位,不放程序化模型
  const isRealWaiting = state.mode === 'real' && !state.realModelUrl;
  let product = null;
  if (!isRealWaiting) {
    product = buildProductMesh(state.productType, state.color);
    scene.add(product);
  }

  // Controls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.2;
  controls.minDistance = 3;
  controls.maxDistance = 10;
  controls.target.set(0, 0, 0);

  Object.assign(state, { scene, camera, renderer, controls, productMesh: product });

  if (isRealWaiting) {
    showThreeLoading();
  }

  // If we have a real GLB from Tripo, swap in
  if (state.realModelUrl) {
    loadGLBIntoScene(state.realModelUrl);
  }

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    const w = container.clientWidth, h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}

function loadGLBIntoScene(url) {
  if (typeof THREE.GLTFLoader !== 'function') {
    toast('GLTFLoader 未加载');
    return;
  }
  const loader = new THREE.GLTFLoader();
  toast('加载 3D 模型中...');
  const safeUrl = proxyImageUrl(url);
  loader.load(
    safeUrl,
    (gltf) => {
      if (state.productMesh) state.scene.remove(state.productMesh);
      const model = gltf.scene || gltf.scenes[0];
      // Auto-scale + center
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3()).length();
      const scale = 2.6 / Math.max(0.001, size);
      model.scale.set(scale, scale, scale);
      box.setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);
      // Enable shadows
      model.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
      state.scene.add(model);
      state.productMesh = model;
      hideThreeLoading();
      toast('3D 模型加载完成');

      // GLB 加载完成 → 从三维模型渲染套图(覆盖 Z-Image 结果,保证跟商品一致)
      setTimeout(() => {
        captureAllThreeAssets();
        // 刷新资产网格和详情图
        try {
          renderAssetGrid(currentTab);
          renderDetailImage();
        } catch (e) { console.warn('re-render after capture', e); }
      }, 300);
    },
    undefined,
    (err) => {
      console.error('GLB load error', err);
      hideThreeLoading();
      toast('GLB 加载失败 (跨域?),保留程序化模型');
    }
  );
}

function showThreeLoading() {
  const container = $('three-canvas');
  if (!container) return;
  let overlay = container.querySelector('.three-loading');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'three-loading';
    overlay.innerHTML = `
      <div class="tl-spinner"></div>
      <div class="tl-text">Tripo 3D 模型生成中</div>
      <div class="tl-sub">通常 1-3 分钟 · 完成后自动加载</div>
    `;
    container.appendChild(overlay);
  }
  overlay.style.display = 'flex';
}

function hideThreeLoading() {
  const container = $('three-canvas');
  if (!container) return;
  const overlay = container.querySelector('.three-loading');
  if (overlay) overlay.remove();
}

// 切换内容编辑区的 loading / 可编辑状态
function updateEditorState() {
  const loading = $('editor-loading');
  const fields = $('edit-fields');
  if (!loading || !fields) return;
  const showLoading = state.isUploadedImage && !state.threeRendersReady;
  loading.style.display = showLoading ? 'flex' : 'none';
  fields.style.display = showLoading ? 'none' : 'flex';
}

// ============ Three.js → 商品套图截图 ============
// 用三维模型渲染代替 Z-Image 生成商品图,确保图片跟上传的商品一致
const THREE_CAPTURE_ANGLES = {
  'main-0':  { pos: [0, 1.0, 4.0],   label: '正面' },
  'main-1':  { pos: [3.0, 1.5, 3.0], label: '45°' },
  'main-2':  { pos: [4.0, 0.5, 0],   label: '侧面' },
  'main-3':  { pos: [0, 4.5, 0.01],  label: '俯视' },
  'main-4':  { pos: [-3.5, 1.0, 0],  label: '背面' },
  'scene-0': { pos: [2.5, 2.0, 3.5], label: '场景' },
  'scene-1': { pos: [-2.0, 1.5, 3.5],label: '场景' },
  'scene-2': { pos: [0, 2.5, 4.5],   label: '场景' },
  'detail-0':{ pos: [0.8, 0.5, 2.0], label: '材质' },
  'detail-1':{ pos: [-0.5, 1.2, 1.8],label: 'Logo' },
  'variant-0':{ pos: [3.0, 1.5, 3.0],label: '变体' },
  'variant-1':{ pos: [3.0, 1.5, 3.0],label: '变体' },
  'hero':    { pos: [0, 1.5, 4.5],   label: 'Hero' },
};

function captureThreeAsset(slot, width = 1024, height = 1024) {
  if (!state.camera || !state.renderer || !state.scene) return null;
  const angle = THREE_CAPTURE_ANGLES[slot];
  if (!angle) return null;

  try {
    // 记住原始视角
    const origPos = state.camera.position.clone();
    const origTarget = state.controls.target.clone();

    // 定位相机
    state.camera.position.set(angle.pos[0], angle.pos[1], angle.pos[2]);
    state.camera.lookAt(0, 0, 0);
    state.controls.target.set(0, 0, 0);
    state.controls.update();

    // 渲染 & 截图
    state.renderer.render(state.scene, state.camera);
    const dataUrl = state.renderer.domElement.toDataURL('image/png');

    // 恢复原始视角
    state.camera.position.copy(origPos);
    state.controls.target.copy(origTarget);
    state.controls.update();

    return dataUrl;
  } catch (err) {
    console.warn('captureThreeAsset error:', slot, err);
    return null;
  }
}

function captureAllThreeAssets() {
  if (!state.camera || !state.renderer || !state.scene) return {};
  const results = {};
  let count = 0;

  // 创建离屏渲染器,高分辨率捕获
  let capRenderer;
  try {
    capRenderer = new THREE.WebGLRenderer({
      antialias: true, preserveDrawingBuffer: true, alpha: true,
    });
    capRenderer.setSize(1024, 1024);
    capRenderer.setPixelRatio(1);
    capRenderer.shadowMap.enabled = true;
    capRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
  } catch (e) {
    console.warn('offline renderer failed, fallback to main', e);
    capRenderer = null;
  }

  const renderer = capRenderer || state.renderer;
  const rWidth = capRenderer ? 1024 : state.renderer.domElement.width;
  const rHeight = capRenderer ? 1024 : state.renderer.domElement.height;

  // 记住原始视角
  const origPos = state.camera.position.clone();
  const origTarget = state.controls.target.clone();

  for (const slot of Object.keys(THREE_CAPTURE_ANGLES)) {
    const angle = THREE_CAPTURE_ANGLES[slot];
    try {
      state.camera.position.set(angle.pos[0], angle.pos[1], angle.pos[2]);
      state.camera.aspect = rWidth / rHeight;
      state.camera.updateProjectionMatrix();
      state.camera.lookAt(0, 0, 0);
      state.controls.target.set(0, 0, 0);
      state.controls.update();

      renderer.render(state.scene, state.camera);
      results[slot] = renderer.domElement.toDataURL('image/png');
      count++;
    } catch (e) {
      console.warn('capture failed:', slot, e);
    }
  }

  // 恢复原始视角
  state.camera.position.copy(origPos);
  state.camera.aspect = state.renderer.domElement.width / state.renderer.domElement.height;
  state.camera.updateProjectionMatrix();
  state.controls.target.copy(origTarget);
  state.controls.update();
  state.renderer.render(state.scene, state.camera);

  if (capRenderer) capRenderer.dispose();

  if (count > 0) {
    state.realAssets = { ...state.realAssets, ...results };
    if (results['hero']) state.realHeroImage = results['hero'];
    addLog(`3D 模型渲染完成: ${count} 张套图`, 'ok');
  }
  state.threeRendersReady = true; // 标记 3D 渲染完成,套图可以显示了
  updateEditorState();
  return results;
}

function buildProductMesh(type, color) {
  const group = new THREE.Group();
  const mat = (c, opts = {}) => new THREE.MeshStandardMaterial({
    color: new THREE.Color(c), roughness: 0.5, metalness: 0.15, ...opts
  });

  if (type === 'shoe') {
    // ===== Upper (main shoe body) - 2D side profile extruded =====
    const upperShape = new THREE.Shape();
    upperShape.moveTo(-1.25, 0.18);
    upperShape.lineTo(1.45, 0.18);
    // Toe rise
    upperShape.bezierCurveTo(1.6, 0.18, 1.7, 0.33, 1.55, 0.53);
    // Toe top
    upperShape.bezierCurveTo(1.4, 0.6, 1.0, 0.6, 0.6, 0.58);
    // Lace dip (slight valley)
    upperShape.bezierCurveTo(0.4, 0.56, 0.25, 0.5, 0.15, 0.55);
    // Rising up to heel collar
    upperShape.bezierCurveTo(0.0, 0.65, -0.15, 0.8, -0.35, 0.98);
    upperShape.bezierCurveTo(-0.55, 1.12, -0.75, 1.2, -0.9, 1.22);
    // Collar peak
    upperShape.bezierCurveTo(-1.05, 1.22, -1.15, 1.15, -1.2, 1.05);
    // Heel back down
    upperShape.bezierCurveTo(-1.32, 0.85, -1.38, 0.55, -1.32, 0.3);
    upperShape.bezierCurveTo(-1.3, 0.22, -1.28, 0.19, -1.25, 0.18);
    upperShape.closePath();

    const upperGeom = new THREE.ExtrudeGeometry(upperShape, {
      depth: 0.95,
      bevelEnabled: true,
      bevelThickness: 0.18,
      bevelSize: 0.18,
      bevelSegments: 6,
      curveSegments: 28,
    });
    upperGeom.translate(0, 0, -0.475);
    upperGeom.computeVertexNormals();
    const upper = new THREE.Mesh(upperGeom, mat(color, { roughness: 0.55 }));
    group.add(upper);

    // ===== Sole (white, slightly wider) =====
    const soleShape = new THREE.Shape();
    soleShape.moveTo(-1.3, 0);
    soleShape.lineTo(1.5, 0);
    soleShape.bezierCurveTo(1.65, 0, 1.7, 0.08, 1.62, 0.18);
    soleShape.lineTo(-1.25, 0.18);
    soleShape.bezierCurveTo(-1.4, 0.18, -1.4, 0.05, -1.3, 0);
    soleShape.closePath();

    const soleGeom = new THREE.ExtrudeGeometry(soleShape, {
      depth: 1.0,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.12,
      bevelSegments: 4,
      curveSegments: 16,
    });
    soleGeom.translate(0, 0, -0.5);
    soleGeom.computeVertexNormals();
    const sole = new THREE.Mesh(soleGeom, mat(0xffffff, { roughness: 0.75 }));
    group.add(sole);

    // ===== Sole stripe (thin colored band along the sole top) =====
    const stripeShape = new THREE.Shape();
    stripeShape.moveTo(-1.25, 0.18);
    stripeShape.lineTo(1.45, 0.18);
    stripeShape.lineTo(1.55, 0.26);
    stripeShape.lineTo(-1.3, 0.26);
    stripeShape.closePath();
    const stripeGeom = new THREE.ExtrudeGeometry(stripeShape, {
      depth: 1.05, bevelEnabled: false,
    });
    stripeGeom.translate(0, 0, -0.525);
    const stripe = new THREE.Mesh(stripeGeom, mat(0xeeeeee, { roughness: 0.6 }));
    group.add(stripe);

    // ===== Swoosh accent (curved tube on each side) =====
    [0.66, -0.66].forEach(z => {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.5, 0.35, z),
        new THREE.Vector3(-0.15, 0.45, z),
        new THREE.Vector3(0.3, 0.5, z),
        new THREE.Vector3(0.8, 0.52, z),
        new THREE.Vector3(1.2, 0.4, z),
      ]);
      const swooshGeom = new THREE.TubeGeometry(curve, 32, 0.055, 8, false);
      const swoosh = new THREE.Mesh(swooshGeom, mat(0xffffff, { roughness: 0.5 }));
      group.add(swoosh);
    });

    // ===== Tongue =====
    const tongueShape = new THREE.Shape();
    tongueShape.moveTo(-0.05, 0);
    tongueShape.lineTo(0.55, 0);
    tongueShape.bezierCurveTo(0.6, 0.1, 0.55, 0.22, 0.5, 0.25);
    tongueShape.lineTo(0, 0.25);
    tongueShape.bezierCurveTo(-0.08, 0.22, -0.1, 0.1, -0.05, 0);
    tongueShape.closePath();
    const tongueGeom = new THREE.ExtrudeGeometry(tongueShape, {
      depth: 0.75, bevelEnabled: true,
      bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 3, curveSegments: 12,
    });
    tongueGeom.translate(0, 0.45, -0.375);
    const tongue = new THREE.Mesh(tongueGeom, mat(0xeeeeee, { roughness: 0.85 }));
    group.add(tongue);

    // ===== Laces (4 horizontal strands arcing over the tongue) =====
    const laceArcs = [
      { x: 0.4,  yArc: 0.78 },
      { x: 0.22, yArc: 0.88 },
      { x: 0.04, yArc: 0.98 },
      { x: -0.14, yArc: 1.06 },
    ];
    laceArcs.forEach(p => {
      const yEnd = 0.6;
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(p.x, yEnd, 0.48),
        new THREE.Vector3(p.x + 0.01, p.yArc, 0),
        new THREE.Vector3(p.x, yEnd, -0.48),
      ]);
      const laceGeom = new THREE.TubeGeometry(curve, 18, 0.024, 6, false);
      const lace = new THREE.Mesh(laceGeom, mat(0xffffff, { roughness: 0.92 }));
      group.add(lace);
    });

    // ===== Eyelets (small dark dots on either side of the lace gap) =====
    laceArcs.forEach(p => {
      [0.48, -0.48].forEach(z => {
        const eyeletGeom = new THREE.RingGeometry(0.025, 0.045, 12);
        const eyelet = new THREE.Mesh(eyeletGeom, mat(0x222222, { roughness: 0.4 }));
        eyelet.position.set(p.x, 0.6, z);
        eyelet.rotation.y = z > 0 ? -Math.PI / 2 : Math.PI / 2;
        group.add(eyelet);
      });
    });

    // ===== Heel pull tab =====
    const tabGeom = new THREE.BoxGeometry(0.12, 0.18, 0.4);
    const tab = new THREE.Mesh(tabGeom, mat(0xeeeeee, { roughness: 0.85 }));
    tab.position.set(-1.18, 1.1, 0);
    tab.rotation.z = -0.4;
    group.add(tab);

    // Scale and position so the shoe is centered around origin
    group.scale.set(0.85, 0.85, 0.85);
    group.position.y = -0.55;
  } else if (type === 'bag') {
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 1.4, 0.6),
      mat(color)
    );
    group.add(body);
    const flap = new THREE.Mesh(
      new THREE.BoxGeometry(1.65, 0.6, 0.08),
      mat(color)
    );
    flap.position.set(0, 0.4, 0.32);
    group.add(flap);
    const handleGeo = new THREE.TorusGeometry(0.4, 0.06, 12, 32, Math.PI);
    const handle = new THREE.Mesh(handleGeo, mat(0x2c2c2c, { metalness: 0.7 }));
    handle.position.set(0, 0.95, 0);
    handle.rotation.x = -Math.PI / 2;
    group.add(handle);
    const clasp = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.15, 0.15),
      mat(0xb89968, { metalness: 0.8, roughness: 0.3 })
    );
    clasp.position.set(0, 0.05, 0.35);
    group.add(clasp);
  } else if (type === 'bottle') {
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 1.8, 32),
      mat(color, { metalness: 0.55, roughness: 0.35 })
    );
    group.add(body);
    const neck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.5, 0.25, 32),
      mat(color, { metalness: 0.55, roughness: 0.35 })
    );
    neck.position.y = 1.02;
    group.add(neck);
    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.35, 0.3, 32),
      mat(0x2c2c2c, { roughness: 0.7 })
    );
    cap.position.y = 1.3;
    group.add(cap);
    const label = new THREE.Mesh(
      new THREE.CylinderGeometry(0.505, 0.505, 0.6, 32),
      mat(0xffffff, { roughness: 0.4 })
    );
    label.position.y = -0.1;
    group.add(label);
  } else if (type === 'chair') {
    const seat = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.18, 1.4),
      mat(color)
    );
    seat.position.y = 0;
    group.add(seat);
    const back = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 1.5, 0.18),
      mat(color)
    );
    back.position.set(0, 0.84, -0.6);
    group.add(back);
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const leg = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.08, 0.7),
        mat(0x333333, { metalness: 0.8, roughness: 0.3 })
      );
      leg.position.set(Math.cos(angle) * 0.35, -0.5, Math.sin(angle) * 0.35);
      leg.rotation.y = -angle;
      group.add(leg);
    }
    const col = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 0.8, 16),
      mat(0x333333, { metalness: 0.8, roughness: 0.3 })
    );
    col.position.y = -0.45;
    group.add(col);
    [-1, 1].forEach(side => {
      const arm = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.5, 0.7),
        mat(0x222222, { roughness: 0.5 })
      );
      arm.position.set(side * 0.76, 0.35, -0.1);
      group.add(arm);
    });
  } else if (type === 'jewelry') {
    // ===== Band (torus) =====
    const band = new THREE.Mesh(
      new THREE.TorusGeometry(0.8, 0.14, 24, 64),
      mat(0xc8a868, { metalness: 0.9, roughness: 0.18 })
    );
    band.rotation.x = Math.PI / 2;
    group.add(band);

    // ===== Inner band highlight (slightly thinner ring inside, lighter) =====
    const innerBand = new THREE.Mesh(
      new THREE.TorusGeometry(0.8, 0.04, 16, 64),
      mat(0xe8d4a8, { metalness: 0.95, roughness: 0.15 })
    );
    innerBand.rotation.x = Math.PI / 2;
    innerBand.position.y = 0.08;
    group.add(innerBand);

    // ===== Setting / mount (small cup holding the gem) =====
    const mount = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.18, 0.18, 16),
      mat(0xc8a868, { metalness: 0.9, roughness: 0.2 })
    );
    mount.position.y = 0.22;
    group.add(mount);

    // ===== Main gem (octahedron — diamond shape) =====
    const gem = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.32, 0),
      mat(color, { metalness: 0.5, roughness: 0.05 })
    );
    gem.position.y = 0.46;
    gem.rotation.y = Math.PI / 4;
    gem.scale.set(1.1, 1.4, 1.1);
    group.add(gem);

    // ===== Prongs (4 small bars holding the gem) =====
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const prong = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.25, 0.05),
        mat(0xc8a868, { metalness: 0.9, roughness: 0.2 })
      );
      prong.position.set(Math.cos(a) * 0.2, 0.36, Math.sin(a) * 0.2);
      prong.rotation.y = -a;
      prong.rotation.z = -Math.cos(a) * 0.25;
      prong.rotation.x = Math.sin(a) * 0.25;
      group.add(prong);
    }

    // ===== Side accent diamonds (3 on each side of the band shoulders) =====
    [-1, 1].forEach(side => {
      for (let i = 0; i < 3; i++) {
        const a = side * (0.35 + i * 0.18);
        const accent = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.06 - i * 0.012, 0),
          mat(0xffffff, { metalness: 0.2, roughness: 0.05 })
        );
        accent.position.set(Math.sin(a) * 0.82, 0.16, Math.cos(a) * 0.05);
        accent.rotation.y = Math.PI / 4;
        group.add(accent);
      }
    });

    // Sit the ring on the ground
    group.position.y = -0.5;
    group.scale.set(1.25, 1.25, 1.25);
  }

  group.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return group;
}

function applyColor(group, color) {
  group.traverse(o => {
    if (o.isMesh && o.material && o.material.color) {
      const c = o.material.color;
      const hex = '#' + c.getHexString();
      const accents = ['#ffffff','#eeeeee','#2c2c2c','#222222','#333333','#b89968','#c8a868','#e8d4a8'];
      if (!accents.includes(hex)) {
        o.material.color = new THREE.Color(color);
      }
    }
  });
}

// ============ Asset Grid ============
const ASSETS = {
  main:    [
    { label: '正面',    angle: 0 },
    { label: '45°',     angle: 45 },
    { label: '侧面',    angle: 90 },
    { label: '俯视',    angle: 30 },
    { label: '背面',    angle: 180 },
  ],
  scene:   [
    { label: '户外',    angle: 25 },
    { label: '室内',    angle: 35 },
    { label: '工作室',  angle: 15 },
  ],
  detail:  [
    { label: '材质特写', angle: 60, zoom: 1.6 },
    { label: 'Logo 特写', angle: 0, zoom: 2 },
  ],
  variant: [
    { label: '红色',    angle: 30, color: '#c0392b' },
    { label: '蓝色',    angle: 30, color: '#2c5f8d' },
  ],
};

function renderAssetGrid(tab) {
  const grid = $('asset-grid');
  grid.innerHTML = '';
  const items = ASSETS[tab];
  items.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'asset-card';
    card.style.animationDelay = (idx * 40) + 'ms';
    card.innerHTML = makeAssetSVG(item, state.productType, tab, idx);
    card.addEventListener('click', () => downloadAssetCard(item, state.productType, tab, idx));
    grid.appendChild(card);
  });
  $('asset-count').textContent = items.length + ' 张';
}

function makeAssetSVG(item, type, category, idx) {
  const template = TEMPLATES[state.template];
  const color = item.color || state.color;

  // Determine background from template + category
  const rawBg = category === 'scene'
    ? template.bgScenes[idx % template.bgScenes.length]
    : template.bgMain;

  const isGradient = rawBg.startsWith('linear-');
  const gradId = 'g' + Math.random().toString(36).slice(2, 9);
  const gradientDef = isGradient
    ? `<defs><linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">${parseGradient(rawBg)}</linearGradient></defs>`
    : '';
  const fill = isGradient ? `url(#${gradId})` : rawBg;

  // Use real image if available for this slot
  // 上传图片后,3D 渲染完成前不显示 Z-Image 结果,显示 loading
  const realKey = `${category}-${idx}`;
  const realUrl = realAssetOrNull(state.realAssets[realKey]);

  let productSVG;
  if (realUrl) {
    const safe = escAttr(proxyImageUrl(realUrl));
    productSVG = `<image href="${safe}" x="20" y="20" width="160" height="160" preserveAspectRatio="xMidYMid meet" crossorigin="anonymous"/>`;
  } else if (state.mode === 'real') {
    // 真实模式但此 slot 还没出图 — 显示 loading 占位
    productSVG = `
      <rect x="20" y="20" width="160" height="160" rx="6" fill="#f1f1f4">
        <animate attributeName="fill" values="#f1f1f4;#e2e2e8;#f1f1f4" dur="1.6s" repeatCount="indefinite"/>
      </rect>
      <g transform="translate(100,98)">
        <circle r="14" fill="none" stroke="#c8c8d0" stroke-width="2.5" stroke-dasharray="22 22" stroke-linecap="round">
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="1.2s" repeatCount="indefinite"/>
        </circle>
      </g>
      <text x="100" y="138" text-anchor="middle" font-size="9" fill="#9999a8" letter-spacing="1">生成中...</text>
    `;
  } else {
    productSVG = productAsSVG(type, color, item.angle || 0, item.zoom || 1);
  }
  const overlay = template.overlay(item, category, idx);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
    ${gradientDef}
    <rect width="200" height="200" fill="${fill}"/>
    ${productSVG}
    ${overlay}
  </svg>`;
}

function escAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

// 3D 模型没完成时套图显示 loading,完成后才展示真实截图
function realAssetOrNull(url) {
  return (state.isUploadedImage && !state.threeRendersReady) ? null : (url || null);
}

function proxyImageUrl(url) {
  // 在真实模式下,把 OSS 图片走代理,避免 canvas 导出时的 CORS 污染
  if (location.protocol === 'file:') return url; // 直接打开 HTML 时没法走代理
  if (url && (url.startsWith('data:') || url.startsWith('blob:'))) return url; // data URL / blob 不走代理
  return '/api/proxy?url=' + encodeURIComponent(url);
}

function parseGradient(s) {
  const m = s.match(/linear-gradient\([^,]+,\s*([^,]+),\s*([^)]+)\)/);
  if (!m) return `<stop offset="0%" stop-color="#fff"/><stop offset="100%" stop-color="#eee"/>`;
  return `<stop offset="0%" stop-color="${m[1].trim()}"/><stop offset="100%" stop-color="${m[2].trim()}"/>`;
}

// ============ Detail Page (long image) ============
function renderDetailImage() {
  const scrollEl = $('detail-scroll');
  if (!scrollEl) return;

  const tpl = TEMPLATES[state.template];
  const e = state.edits;
  const sec = state.detailSections;
  const W = 400;
  const ink = tpl.ink;
  const priceColor = tpl.priceColor;
  const defs = [];

  const bgFill = (bg, id) => {
    if (bg.startsWith('linear-')) {
      defs.push(`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${parseGradient(bg)}</linearGradient>`);
      return `url(#${id})`;
    }
    return bg;
  };

  let y = 0;
  let parts = [];

  // ---- Promo countdown banner ----
  if (sec.promo) {
    const h = 90;
    defs.push(`<linearGradient id="detail-promo-bg" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#c0392b"/><stop offset="100%" stop-color="#e67e22"/></linearGradient>`);
    parts.push(`<rect x="0" y="${y}" width="${W}" height="${h}" fill="url(#detail-promo-bg)"/>`);
    // Sparkle dots decoration
    for (let i = 0; i < 8; i++) {
      const sx = 20 + (i * 47) % (W - 40);
      const sy = y + 10 + ((i * 13) % 70);
      parts.push(`<circle cx="${sx}" cy="${sy}" r="1.5" fill="#fff" opacity="${0.3 + (i%3)*0.2}"/>`);
    }
    parts.push(`<text x="22" y="${y+34}" font-size="11" letter-spacing="2" fill="#fff" opacity="0.85">LIMITED · 限 时 特 惠</text>`);
    parts.push(`<text x="22" y="${y+62}" font-size="16" font-weight="800" fill="#fff">距 结 束 仅 剩</text>`);
    // Countdown boxes
    const cdX = 168;
    const cdW = 36;
    const cdGap = 4;
    ['HH', 'MM', 'SS'].forEach((label, idx) => {
      const x = cdX + (cdW + cdGap) * idx;
      parts.push(`<rect x="${x}" y="${y+42}" width="${cdW}" height="28" fill="#222" rx="3"/>`);
      const isMM = idx === 1;
      const isSS = idx === 2;
      const id = isMM ? 'countdown-mm' : (isSS ? 'countdown-ss' : 'countdown-hh');
      parts.push(`<text id="${id}" x="${x + cdW/2}" y="${y+63}" text-anchor="middle" font-size="16" font-weight="700" fill="#fff" font-family="SF Mono, Menlo, monospace">${idx === 0 ? '23' : '59'}</text>`);
      if (idx < 2) {
        parts.push(`<text x="${x + cdW + cdGap/2}" y="${y+62}" text-anchor="middle" font-size="14" font-weight="700" fill="#fff">:</text>`);
      }
    });
    // Right info chip
    parts.push(`<rect x="${W-100}" y="${y+22}" width="84" height="46" fill="rgba(255,255,255,0.18)" rx="4" stroke="#fff" stroke-width="0.8"/>`);
    parts.push(`<text x="${W-58}" y="${y+40}" text-anchor="middle" font-size="9" fill="#fff" opacity="0.9">满 ¥500 减</text>`);
    parts.push(`<text x="${W-58}" y="${y+60}" text-anchor="middle" font-size="18" font-weight="800" fill="#ffeb3b">¥ 50</text>`);
    y += h;
  }

  // ---- Hero ----
  if (sec.hero) {
    const h = 580;
    const fill = bgFill(tpl.bgMain, 'detail-hero-bg');
    parts.push(`<rect x="0" y="${y}" width="${W}" height="${h}" fill="${fill}"/>`);
    // Brand mark
    parts.push(`<text x="${W/2}" y="${y+56}" text-anchor="middle" font-size="14" font-weight="700" letter-spacing="4" fill="${ink}">${esc(e.brand)}</text>`);
    parts.push(`<line x1="${W/2-32}" y1="${y+68}" x2="${W/2+32}" y2="${y+68}" stroke="${ink}" stroke-width="1.2"/>`);
    parts.push(`<text x="${W/2}" y="${y+88}" text-anchor="middle" font-size="9" letter-spacing="3" fill="${ink}" opacity="0.6">SS26 NEW ARRIVAL</text>`);
    // "NEW" rotating badge top-right
    parts.push(`<g transform="translate(${W-50}, ${y+60})">
      <circle r="32" fill="#c0392b" opacity="0.95"/>
      <circle r="28" fill="none" stroke="#fff" stroke-width="0.8" stroke-dasharray="2 2"/>
      <text y="-3" text-anchor="middle" font-size="9" font-weight="700" fill="#fff" letter-spacing="1">NEW</text>
      <text y="11" text-anchor="middle" font-size="8" fill="#fff" opacity="0.9">新 品</text>
    </g>`);
    // Product
    if (realAssetOrNull(state.realHeroImage)) {
      const heroUrl = escAttr(proxyImageUrl(state.realHeroImage));
      parts.push(`<image href="${heroUrl}" x="${W/2 - 140}" y="${y + 120}" width="280" height="280" preserveAspectRatio="xMidYMid meet" crossorigin="anonymous"/>`);
    } else if (state.mode === 'real') {
      // 真实模式但 hero 图还没生成完 — 显示 loading 占位
      parts.push(`
        <rect x="${W/2 - 130}" y="${y + 140}" width="260" height="260" rx="8" fill="#ececf2">
          <animate attributeName="fill" values="#ececf2;#dcdce4;#ececf2" dur="1.6s" repeatCount="indefinite"/>
        </rect>
        <g transform="translate(${W/2}, ${y + 260})">
          <circle r="22" fill="none" stroke="#b5b5c0" stroke-width="3" stroke-dasharray="36 36" stroke-linecap="round">
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="1.2s" repeatCount="indefinite"/>
          </circle>
        </g>
        <text x="${W/2}" y="${y + 320}" text-anchor="middle" font-size="11" fill="#9999a8" letter-spacing="2">主图生成中</text>
      `);
    } else {
      parts.push(productAsSVG(state.productType, state.color, 25, 2.4, W/2, y + 250));
    }
    // Title
    parts.push(`<text x="${W/2}" y="${y+450}" text-anchor="middle" font-size="26" font-weight="800" fill="${ink}">${esc(e.title)}</text>`);
    parts.push(`<text x="${W/2}" y="${y+476}" text-anchor="middle" font-size="11" letter-spacing="2" fill="${ink}" opacity="0.7">${esc(e.subtitle)}</text>`);
    // Price tag
    parts.push(`<text x="${W/2}" y="${y+540}" text-anchor="middle"><tspan font-size="13" fill="${ink}" opacity="0.55">¥</tspan><tspan font-size="36" font-weight="800" fill="${priceColor}" dx="2">${esc(e.price)}</tspan><tspan font-size="11" fill="${ink}" opacity="0.5" text-decoration="line-through" dx="12" dy="-12">¥${esc(e.origPrice)}</tspan></text>`);
    // Bottom service chips
    const chips = ['正品保证', '顺丰包邮', '7天无理由'];
    chips.forEach((c, i) => {
      const cx = W/2 - 90 + i * 90;
      parts.push(`<rect x="${cx - 38}" y="${y+558}" width="76" height="14" rx="7" fill="${ink}" opacity="0.08"/>`);
      parts.push(`<text x="${cx}" y="${y+568}" text-anchor="middle" font-size="8" fill="${ink}" opacity="0.65">${c}</text>`);
    });
    y += h;
  }

  // ---- Slogans / Feature callouts ----
  if (sec.slogans) {
    const h = 300;
    parts.push(`<rect x="0" y="${y}" width="${W}" height="${h}" fill="#fafafa"/>`);
    parts.push(`<text x="${W/2}" y="${y+40}" text-anchor="middle" font-size="13" font-weight="700" letter-spacing="6" fill="#333">- 核 心 卖 点 -</text>`);
    parts.push(`<text x="${W/2}" y="${y+58}" text-anchor="middle" font-size="9" letter-spacing="3" fill="#999">KEY FEATURES</text>`);
    const cols = 3;
    const colW = W / cols;
    const sloganIcons = [
      // Lightning
      `<path d="M -4 -10 L 3 -2 L -1 -2 L 2 8 L -4 0 L 0 0 Z" fill="$COLOR"/>`,
      // Wave/breath
      `<path d="M -8 0 Q -4 -6 0 0 T 8 0 M -8 4 Q -4 -2 0 4 T 8 4" stroke="$COLOR" stroke-width="1.5" fill="none" stroke-linecap="round"/>`,
      // Shield
      `<path d="M 0 -10 L -7 -6 L -7 2 Q -7 7 0 10 Q 7 7 7 2 L 7 -6 Z" fill="none" stroke="$COLOR" stroke-width="1.5"/>
       <path d="M -3 0 L -1 2 L 3 -2" stroke="$COLOR" stroke-width="1.5" fill="none" stroke-linecap="round"/>`,
    ];
    for (let i = 0; i < 3; i++) {
      const cx = colW * (i + 0.5);
      const title = e.slogans[i] || '';
      const desc = e.sloganDescs[i] || '';
      parts.push(`<circle cx="${cx}" cy="${y+115}" r="26" fill="#fff" stroke="${priceColor}" stroke-width="1.5"/>`);
      parts.push(`<g transform="translate(${cx}, ${y+115})">${(sloganIcons[i] || '').replace(/\$COLOR/g, priceColor)}</g>`);
      parts.push(`<rect x="${cx-1.5}" y="${y+148}" width="3" height="10" fill="${priceColor}" opacity="0.4"/>`);
      parts.push(`<text x="${cx}" y="${y+180}" text-anchor="middle" font-size="14" font-weight="700" fill="#222">${esc(title)}</text>`);
      parts.push(`<text x="${cx}" y="${y+204}" text-anchor="middle" font-size="9.5" fill="#666">${esc(desc)}</text>`);
      // Tiny accent under each
      parts.push(`<text x="${cx}" y="${y+228}" text-anchor="middle" font-size="7" letter-spacing="2" fill="${priceColor}" opacity="0.7">0${i+1}</text>`);
    }
    parts.push(`<line x1="40" y1="${y+260}" x2="${W-40}" y2="${y+260}" stroke="#e5e5e5" stroke-width="1"/>`);
    parts.push(`<text x="${W/2}" y="${y+282}" text-anchor="middle" font-size="9" letter-spacing="3" fill="#888">QUALITY · COMFORT · TRUST</text>`);
    y += h;
  }

  // ---- Lifestyle scene ----
  if (sec.scene) {
    const h = 540;
    const sceneIdx = state.template === 'minimal' ? 2 : 0;
    const fill = bgFill(tpl.bgScenes[sceneIdx], 'detail-scene-bg');
    parts.push(`<rect x="0" y="${y}" width="${W}" height="${h}" fill="${fill}"/>`);
    parts.push(`<text x="${W/2}" y="${y+50}" text-anchor="middle" font-size="11" letter-spacing="4" fill="#fff" opacity="0.85">LIFESTYLE · 场 景 应 用</text>`);
    parts.push(detailImageOrLoading('scene-0', W/2 - 130, y + 80, 260, 360, { angle: 30, zoom: 2.4 }));
    // Quote frame
    parts.push(`<text x="60" y="${y+470}" font-size="32" fill="#fff" opacity="0.45" font-family="Georgia, serif">"</text>`);
    parts.push(`<text x="${W/2}" y="${y+475}" text-anchor="middle" font-size="17" font-weight="700" fill="#fff" letter-spacing="3">随 心 出 行</text>`);
    parts.push(`<text x="${W/2}" y="${y+498}" text-anchor="middle" font-size="9.5" fill="#fff" opacity="0.85">每一步,皆是远方</text>`);
    parts.push(`<text x="${W-60}" y="${y+515}" text-anchor="end" font-size="32" fill="#fff" opacity="0.45" font-family="Georgia, serif">"</text>`);
    y += h;
  }

  // ---- Material detail ----
  if (sec.material) {
    const h = 320;
    parts.push(`<rect x="0" y="${y}" width="${W}" height="${h}" fill="#ffffff"/>`);
    // 在材质段用真实的"细节-材质"图(状态条标的 detail-0)
    const matUrl = realAssetOrNull(state.realAssets['detail-0']);
    if (matUrl) {
      parts.push(`<image href="${escAttr(proxyImageUrl(matUrl))}" x="20" y="${y+30}" width="160" height="260" preserveAspectRatio="xMidYMid slice" crossorigin="anonymous"/>`);
      parts.push(`<rect x="20" y="${y+30}" width="160" height="260" fill="none" stroke="#e8e8e8" stroke-width="1"/>`);
    } else if (state.mode === 'real') {
      parts.push(`<rect x="20" y="${y+30}" width="160" height="260" fill="#ececf2" stroke="#e8e8e8" stroke-width="1">
        <animate attributeName="fill" values="#ececf2;#dcdce4;#ececf2" dur="1.8s" repeatCount="indefinite"/>
      </rect>
      <g transform="translate(100, ${y+150})">
        <circle r="16" fill="none" stroke="#b5b5c0" stroke-width="2.5" stroke-dasharray="26 26" stroke-linecap="round">
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="1.2s" repeatCount="indefinite"/>
        </circle>
      </g>
      <text x="100" y="${y+195}" text-anchor="middle" font-size="9" fill="#9999a8">材质特写生成中</text>`);
    } else {
      parts.push(`<rect x="20" y="${y+30}" width="160" height="260" fill="#fafafa" stroke="#e8e8e8" stroke-width="1"/>`);
      parts.push(productAsSVG(state.productType, state.color, 60, 1.4, 100, y + 160));
    }
    // Side text
    parts.push(`<text x="${W/2+30}" y="${y+80}" font-size="11" letter-spacing="3" fill="${priceColor}">DETAIL · 材 质</text>`);
    parts.push(`<text x="${W/2+30}" y="${y+115}" font-size="20" font-weight="800" fill="#222">极 致 工 艺</text>`);
    parts.push(`<line x1="${W/2+30}" y1="${y+128}" x2="${W/2+90}" y2="${y+128}" stroke="${priceColor}" stroke-width="2"/>`);
    parts.push(`<text x="${W/2+30}" y="${y+160}" font-size="10.5" fill="#555">· ${esc(e.specs[2].value)}</text>`);
    parts.push(`<text x="${W/2+30}" y="${y+182}" font-size="10.5" fill="#555">· ${esc(e.sloganDescs[0])}</text>`);
    parts.push(`<text x="${W/2+30}" y="${y+204}" font-size="10.5" fill="#555">· ${esc(e.sloganDescs[1])}</text>`);
    parts.push(`<text x="${W/2+30}" y="${y+226}" font-size="10.5" fill="#555">· ${esc(e.sloganDescs[2])}</text>`);
    parts.push(`<rect x="${W/2+30}" y="${y+255}" width="84" height="26" fill="${priceColor}" rx="2"/>`);
    parts.push(`<text x="${W/2+72}" y="${y+272}" text-anchor="middle" font-size="10" fill="#fff" font-weight="600" letter-spacing="2">了 解 更 多</text>`);
    y += h;
  }

  // ---- NEW: Annotated detail diagram ----
  if (sec.annotation) {
    const h = 480;
    parts.push(`<rect x="0" y="${y}" width="${W}" height="${h}" fill="#f5f5f0"/>`);
    parts.push(`<text x="${W/2}" y="${y+42}" text-anchor="middle" font-size="13" font-weight="700" letter-spacing="6" fill="#333">- 细 节 解 析 -</text>`);
    parts.push(`<text x="${W/2}" y="${y+60}" text-anchor="middle" font-size="9" letter-spacing="4" fill="#888">DETAIL VIEW</text>`);
    // 主图 45° 真实图(没就绪时 loading;mock 时程序化)
    const annUrl = realAssetOrNull(state.realAssets['main-1']);
    const annCx = W/2, annCy = y + 230;
    if (annUrl) {
      parts.push(`<image href="${escAttr(proxyImageUrl(annUrl))}" x="${annCx - 120}" y="${annCy - 100}" width="240" height="200" preserveAspectRatio="xMidYMid meet" crossorigin="anonymous"/>`);
    } else if (state.mode === 'real') {
      parts.push(`<rect x="${annCx - 120}" y="${annCy - 100}" width="240" height="200" rx="6" fill="#ececf2">
        <animate attributeName="fill" values="#ececf2;#dcdce4;#ececf2" dur="1.8s" repeatCount="indefinite"/>
      </rect>
      <g transform="translate(${annCx},${annCy})">
        <circle r="18" fill="none" stroke="#b5b5c0" stroke-width="2.5" stroke-dasharray="28 28" stroke-linecap="round">
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="1.2s" repeatCount="indefinite"/>
        </circle>
      </g>`);
    } else {
      parts.push(productAsSVG(state.productType, state.color, 20, 1.8, annCx, annCy));
    }
    // 3 callouts pointing at product
    const callouts = [
      { cx: 60,  cy: y + 150, lineTo: { x: 160, y: y + 200 }, label: e.slogans[0], desc: e.sloganDescs[0] },
      { cx: 340, cy: y + 150, lineTo: { x: 240, y: y + 200 }, label: e.slogans[1], desc: e.sloganDescs[1] },
      { cx: 200, cy: y + 360, lineTo: { x: 200, y: y + 290 }, label: e.slogans[2], desc: e.sloganDescs[2] },
    ];
    callouts.forEach((c, i) => {
      parts.push(`<line x1="${c.cx}" y1="${c.cy}" x2="${c.lineTo.x}" y2="${c.lineTo.y}" stroke="${priceColor}" stroke-width="1" stroke-dasharray="3 3" opacity="0.7"/>`);
      parts.push(`<circle cx="${c.lineTo.x}" cy="${c.lineTo.y}" r="3" fill="${priceColor}"/>`);
      parts.push(`<circle cx="${c.lineTo.x}" cy="${c.lineTo.y}" r="6" fill="${priceColor}" opacity="0.3"/>`);
      parts.push(`<circle cx="${c.cx}" cy="${c.cy}" r="16" fill="#fff" stroke="${priceColor}" stroke-width="2"/>`);
      parts.push(`<text x="${c.cx}" y="${c.cy+5}" text-anchor="middle" font-size="13" font-weight="800" fill="${priceColor}">${i+1}</text>`);
      const textX = c.cx < W/2 ? c.cx + 22 : (c.cx > W*0.7 ? c.cx - 22 : c.cx);
      const textAnchor = c.cx < W/2 ? 'start' : (c.cx > W*0.7 ? 'end' : 'middle');
      const labelY = c.cy === y + 360 ? c.cy - 32 : c.cy - 20;
      if (c.cy === y + 360) {
        parts.push(`<text x="${W/2}" y="${c.cy - 32}" text-anchor="middle" font-size="11" font-weight="700" fill="#222">${esc(c.label || '')}</text>`);
        parts.push(`<text x="${W/2}" y="${c.cy - 16}" text-anchor="middle" font-size="9" fill="#666">${esc(c.desc || '')}</text>`);
      } else {
        parts.push(`<text x="${textX}" y="${labelY}" text-anchor="${textAnchor}" font-size="11" font-weight="700" fill="#222">${esc(c.label || '')}</text>`);
        parts.push(`<text x="${textX}" y="${labelY + 16}" text-anchor="${textAnchor}" font-size="9" fill="#666">${esc(c.desc || '')}</text>`);
      }
    });
    parts.push(`<text x="${W/2}" y="${y+440}" text-anchor="middle" font-size="8.5" letter-spacing="4" fill="#999">CRAFTSMANSHIP IN EVERY DETAIL</text>`);
    y += h;
  }

  // ---- Specs ----
  if (sec.specs) {
    const h = 320;
    parts.push(`<rect x="0" y="${y}" width="${W}" height="${h}" fill="#ffffff"/>`);
    parts.push(`<text x="${W/2}" y="${y+45}" text-anchor="middle" font-size="13" font-weight="700" letter-spacing="6" fill="#333">- 规 格 参 数 -</text>`);
    parts.push(`<text x="${W/2}" y="${y+62}" text-anchor="middle" font-size="9" letter-spacing="3" fill="#999">SPECIFICATIONS</text>`);
    const rowH = 42;
    const startY = y + 88;
    e.specs.forEach((s, i) => {
      const rowY = startY + i * rowH;
      const bg = i % 2 === 0 ? '#fafafa' : '#ffffff';
      parts.push(`<rect x="40" y="${rowY}" width="${W-80}" height="${rowH}" fill="${bg}" stroke="#eaeaea" stroke-width="1"/>`);
      parts.push(`<rect x="40" y="${rowY}" width="3" height="${rowH}" fill="${priceColor}"/>`);
      parts.push(`<text x="60" y="${rowY+rowH/2+5}" font-size="11" font-weight="600" fill="#333">${esc(s.label)}</text>`);
      parts.push(`<text x="${W-50}" y="${rowY+rowH/2+5}" text-anchor="end" font-size="11" fill="#555">${esc(s.value)}</text>`);
    });
    y += h;
  }

  // ---- NEW: User reviews ----
  if (sec.reviews) {
    const h = 380;
    parts.push(`<rect x="0" y="${y}" width="${W}" height="${h}" fill="#fafafa"/>`);
    parts.push(`<text x="${W/2}" y="${y+40}" text-anchor="middle" font-size="13" font-weight="700" letter-spacing="6" fill="#333">- 用 户 好 评 -</text>`);
    // Rating summary
    parts.push(`<text x="${W/2 - 50}" y="${y+72}" text-anchor="end" font-size="22" font-weight="800" fill="${priceColor}">4.9</text>`);
    // 5 stars
    for (let i = 0; i < 5; i++) {
      const sx = W/2 - 40 + i * 18;
      parts.push(`<path d="M ${sx} ${y+62} l 3 6.5 7 1 -5 5 1 7 -6 -3.5 -6 3.5 1 -7 -5 -5 7 -1 z" fill="${priceColor}"/>`);
    }
    parts.push(`<text x="${W/2 + 60}" y="${y+72}" font-size="9.5" fill="#888">1,283 条评价</text>`);

    // 2 review cards
    const reviews = [
      { name: '张**', verified: true, stars: 5, quote: '质量超出预期,做工细致,款式也很时尚,送的小礼物很贴心,值得入手!', tag: '已购买 · 30 天前' },
      { name: 'Lily', verified: true, stars: 5, quote: '官方旗舰品质,和图片一样!回购第二次,身边朋友也都种草了。', tag: '已购买 · 7 天前' },
    ];
    reviews.forEach((r, i) => {
      const cardY = y + 100 + i * 130;
      parts.push(`<rect x="20" y="${cardY}" width="${W-40}" height="118" fill="#fff" rx="6" stroke="#eaeaea" stroke-width="1"/>`);
      // Avatar
      parts.push(`<circle cx="42" cy="${cardY+22}" r="14" fill="${priceColor}" opacity="0.85"/>`);
      parts.push(`<text x="42" y="${cardY+27}" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">${r.name[0]}</text>`);
      // Name + verified badge
      parts.push(`<text x="64" y="${cardY+20}" font-size="11.5" font-weight="600" fill="#222">${r.name}</text>`);
      parts.push(`<rect x="${64 + 28}" y="${cardY+12}" width="40" height="11" rx="2" fill="#16a34a" opacity="0.12"/>`);
      parts.push(`<text x="${64 + 48}" y="${cardY+21}" text-anchor="middle" font-size="7.5" fill="#16a34a" font-weight="600">✓ 已验证</text>`);
      // Stars
      for (let s = 0; s < r.stars; s++) {
        const sx = 64 + s * 12;
        parts.push(`<path d="M ${sx} ${cardY+30} l 2 4.5 5 0.7 -3.5 3.5 1 4.7 -4 -2.5 -4 2.5 1 -4.7 -3.5 -3.5 5 -0.7 z" fill="#f39c12" transform="scale(0.85) translate(${sx*0.176}, ${(cardY+30)*0.176})"/>`);
      }
      // Quote text (wrap if needed - simple manual split)
      const quoteLines = wrapText(r.quote, 22);
      quoteLines.forEach((line, li) => {
        parts.push(`<text x="38" y="${cardY+62 + li * 16}" font-size="10.5" fill="#444">${esc(line)}</text>`);
      });
      // Tag
      parts.push(`<text x="38" y="${cardY+104}" font-size="9" fill="#999">${r.tag}</text>`);
    });
    y += h;
  }

  // ---- Variants ----
  if (sec.variants) {
    const h = 280;
    parts.push(`<rect x="0" y="${y}" width="${W}" height="${h}" fill="#ffffff"/>`);
    parts.push(`<text x="${W/2}" y="${y+45}" text-anchor="middle" font-size="13" font-weight="700" letter-spacing="6" fill="#333">- 全 色 可 选 -</text>`);
    parts.push(`<text x="${W/2}" y="${y+62}" text-anchor="middle" font-size="9" letter-spacing="3" fill="#999">COLORWAY</text>`);
    const variantColors = [
      { c: '#c0392b', n: '热力红' },
      { c: '#2c5f8d', n: '深海蓝' },
      { c: '#3a7d44', n: '森林绿' },
      { c: '#d4a017', n: '复古黄' },
      { c: '#2c2c2c', n: '夜雾黑' },
    ];
    const startX = 30;
    const gap = (W - 60) / 5;
    variantColors.forEach((v, i) => {
      const cx = startX + gap * (i + 0.5);
      const cy = y + 140;
      const isActive = state.color.toLowerCase() === v.c.toLowerCase();
      if (isActive) {
        parts.push(`<circle cx="${cx}" cy="${cy}" r="30" fill="none" stroke="${priceColor}" stroke-width="1.5"/>`);
      }
      parts.push(`<circle cx="${cx}" cy="${cy}" r="24" fill="${v.c}" stroke="#fff" stroke-width="2"/>`);
      parts.push(`<circle cx="${cx}" cy="${cy}" r="25" fill="none" stroke="#e5e5e5" stroke-width="1"/>`);
      parts.push(`<text x="${cx}" y="${y+195}" text-anchor="middle" font-size="9.5" fill="${isActive ? priceColor : '#444'}" font-weight="${isActive ? '700' : '400'}">${v.n}</text>`);
      if (isActive) {
        parts.push(`<text x="${cx}" y="${y+212}" text-anchor="middle" font-size="7" fill="${priceColor}" letter-spacing="1">● 已选</text>`);
      }
    });
    parts.push(`<text x="${W/2}" y="${y+250}" text-anchor="middle" font-size="9.5" fill="#888" letter-spacing="2">支持改色定制 · 7 个工作日发货</text>`);
    y += h;
  }

  // ---- NEW: Trust / service badges ----
  if (sec.trust) {
    const h = 200;
    parts.push(`<rect x="0" y="${y}" width="${W}" height="${h}" fill="#fafafa"/>`);
    parts.push(`<text x="${W/2}" y="${y+38}" text-anchor="middle" font-size="13" font-weight="700" letter-spacing="6" fill="#333">- 服 务 保 障 -</text>`);
    parts.push(`<text x="${W/2}" y="${y+55}" text-anchor="middle" font-size="9" letter-spacing="3" fill="#999">PROMISE</text>`);
    const badges = [
      { icon: '✓', title: '正品保证', desc: '官方授权' },
      { icon: '↻', title: '7天无理由', desc: '到货起算' },
      { icon: '✈', title: '顺丰包邮', desc: '全国大部分' },
      { icon: '⚡', title: '24h 发货', desc: '当日下单' },
    ];
    const bgap = W / 4;
    badges.forEach((b, i) => {
      const cx = bgap * (i + 0.5);
      const cy = y + 110;
      parts.push(`<circle cx="${cx}" cy="${cy}" r="20" fill="${priceColor}" opacity="0.1"/>`);
      parts.push(`<circle cx="${cx}" cy="${cy}" r="20" fill="none" stroke="${priceColor}" stroke-width="1"/>`);
      parts.push(`<text x="${cx}" y="${cy+6}" text-anchor="middle" font-size="18" font-weight="700" fill="${priceColor}">${b.icon}</text>`);
      parts.push(`<text x="${cx}" y="${y+158}" text-anchor="middle" font-size="10" font-weight="600" fill="#333">${b.title}</text>`);
      parts.push(`<text x="${cx}" y="${y+174}" text-anchor="middle" font-size="8.5" fill="#888">${b.desc}</text>`);
    });
    y += h;
  }

  // ---- Footer ----
  parts.push(`<rect x="0" y="${y}" width="${W}" height="100" fill="#1a1d20"/>`);
  parts.push(`<text x="${W/2}" y="${y+38}" text-anchor="middle" font-size="13" font-weight="700" letter-spacing="4" fill="#fff">${esc(e.brand)}</text>`);
  parts.push(`<line x1="${W/2-20}" y1="${y+48}" x2="${W/2+20}" y2="${y+48}" stroke="#fff" stroke-width="1" opacity="0.4"/>`);
  parts.push(`<text x="${W/2}" y="${y+68}" text-anchor="middle" font-size="9" fill="#fff" opacity="0.6" letter-spacing="2">© 2026 ${esc(e.brand)} · 全国包邮 · 7天无理由</text>`);
  parts.push(`<text x="${W/2}" y="${y+86}" text-anchor="middle" font-size="8" fill="#fff" opacity="0.4">本页面图文由「云桨 · 一图全店」自动生成</text>`);
  y += 100;

  const totalH = y;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${totalH}" preserveAspectRatio="xMidYMin meet">
    <defs>${defs.join('')}</defs>
    ${parts.join('\n')}
  </svg>`;

  scrollEl.innerHTML = svg;
  $('detail-dim').textContent = `${W*3} × ${totalH*3}`;
}

function wrapText(s, maxLen) {
  if (!s) return [''];
  const lines = [];
  let cur = '';
  for (const ch of s) {
    cur += ch;
    if (cur.length >= maxLen) {
      lines.push(cur);
      cur = '';
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// 详情图小工具:优先用真实图,真实模式没就绪时显示 loading,否则程序化
function detailImageOrLoading(slot, x, y, w, h, productArgs) {
  const url = realAssetOrNull(state.realAssets[slot]);
  if (url) {
    return `<image href="${escAttr(proxyImageUrl(url))}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet" crossorigin="anonymous"/>`;
  }
  if (state.mode === 'real') {
    const cx = x + w / 2;
    const cy = y + h / 2;
    return `
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.35)" stroke-width="1" stroke-dasharray="4 4">
        <animate attributeName="fill" values="rgba(255,255,255,0.12);rgba(255,255,255,0.25);rgba(255,255,255,0.12)" dur="1.8s" repeatCount="indefinite"/>
      </rect>
      <g transform="translate(${cx},${cy - 6})">
        <circle r="${Math.min(18, w/10)}" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="2.5" stroke-dasharray="28 28" stroke-linecap="round">
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="1.2s" repeatCount="indefinite"/>
        </circle>
      </g>
      <text x="${cx}" y="${cy + 26}" text-anchor="middle" font-size="10" fill="rgba(255,255,255,0.75)" letter-spacing="1">生成中</text>
    `;
  }
  return productAsSVG(state.productType, state.color, productArgs.angle, productArgs.zoom, x + w/2, y + h/2);
}

function productAsSVG(type, color, angle, zoom, cx = 100, cy = 110) {
  const scale = zoom;
  const rot = angle;
  let body = '';
  if (type === 'shoe') {
    body = `
      <ellipse cx="0" cy="20" rx="55" ry="14" fill="#ffffff" stroke="#ddd" stroke-width="1"/>
      <path d="M -50,15 Q -45,-5 -25,-12 L 30,-12 Q 50,-10 55,10 L 55,18 L -50,18 Z" fill="${color}" stroke="${darken(color)}" stroke-width="1"/>
      <path d="M -25,-10 Q -10,-18 10,-18 Q 30,-16 35,-8" fill="none" stroke="#fff" stroke-width="2" opacity="0.7"/>
      <circle cx="-15" cy="-5" r="2" fill="#fff"/>
      <circle cx="-5" cy="-7" r="2" fill="#fff"/>
      <circle cx="5" cy="-8" r="2" fill="#fff"/>
      <circle cx="15" cy="-7" r="2" fill="#fff"/>
      <rect x="-30" y="5" width="60" height="3" fill="#fff" opacity="0.85"/>
    `;
  } else if (type === 'bag') {
    body = `
      <path d="M -30,40 Q -25,55 -20,55 L 20,55 Q 25,55 30,40 Z" fill="${darken(color, 0.15)}" opacity="0.3"/>
      <rect x="-35" y="-25" width="70" height="65" rx="3" fill="${color}" stroke="${darken(color)}" stroke-width="1"/>
      <rect x="-36" y="-25" width="72" height="20" rx="3" fill="${color}" stroke="${darken(color)}" stroke-width="1"/>
      <path d="M -20,-25 Q -20,-50 0,-50 Q 20,-50 20,-25" fill="none" stroke="#333" stroke-width="3"/>
      <rect x="-5" y="-10" width="10" height="6" fill="#b89968" stroke="#8a6f4a" stroke-width="0.5"/>
    `;
  } else if (type === 'bottle') {
    body = `
      <ellipse cx="0" cy="55" rx="32" ry="6" fill="#000" opacity="0.12"/>
      <rect x="-22" y="-45" width="44" height="100" rx="6" fill="${color}" stroke="${darken(color)}" stroke-width="1"/>
      <rect x="-22" y="-15" width="44" height="30" fill="#fff" opacity="0.9"/>
      <rect x="-20" y="-10" width="40" height="3" fill="${color}"/>
      <text x="0" y="5" font-size="9" font-weight="bold" text-anchor="middle" fill="${darken(color)}">BRAND</text>
      <rect x="-15" y="-55" width="30" height="12" rx="2" fill="#2c2c2c"/>
      <rect x="-22" y="-43" width="44" height="3" fill="${darken(color)}" opacity="0.5"/>
    `;
  } else if (type === 'chair') {
    body = `
      <ellipse cx="0" cy="65" rx="40" ry="6" fill="#000" opacity="0.18"/>
      <rect x="-35" y="-50" width="70" height="55" rx="6" fill="${color}" stroke="${darken(color)}" stroke-width="1"/>
      <rect x="-40" y="0" width="80" height="14" rx="4" fill="${color}" stroke="${darken(color)}" stroke-width="1"/>
      <rect x="-38" y="-2" width="6" height="20" fill="#333"/>
      <rect x="32" y="-2" width="6" height="20" fill="#333"/>
      <rect x="-3" y="14" width="6" height="35" fill="#444"/>
      <g stroke="#444" stroke-width="3" stroke-linecap="round">
        <line x1="0" y1="48" x2="-30" y2="62"/>
        <line x1="0" y1="48" x2="30" y2="62"/>
        <line x1="0" y1="48" x2="-15" y2="65"/>
        <line x1="0" y1="48" x2="15" y2="65"/>
        <line x1="0" y1="48" x2="0" y2="65"/>
      </g>
    `;
  } else if (type === 'jewelry') {
    body = `
      <ellipse cx="0" cy="35" rx="38" ry="6" fill="#000" opacity="0.18"/>
      <ellipse cx="0" cy="20" rx="40" ry="26" fill="none" stroke="#c8a868" stroke-width="9"/>
      <ellipse cx="0" cy="20" rx="40" ry="26" fill="none" stroke="#8a6f3a" stroke-width="1"/>
      <ellipse cx="0" cy="18" rx="36" ry="22" fill="none" stroke="#e8d4a8" stroke-width="1.2" opacity="0.9"/>
      <polygon points="-26,8 -22,4 -18,8 -22,12" fill="#fff" stroke="#ccc" stroke-width="0.5"/>
      <polygon points="-20,10 -16,6 -12,10 -16,14" fill="#fff" stroke="#ccc" stroke-width="0.5"/>
      <polygon points="26,8 22,4 18,8 22,12" fill="#fff" stroke="#ccc" stroke-width="0.5"/>
      <polygon points="20,10 16,6 12,10 16,14" fill="#fff" stroke="#ccc" stroke-width="0.5"/>
      <path d="M -12,-8 L -14,-2 L 0,-22 L 14,-2 L 12,-8 Z" fill="${color}" stroke="${darken(color)}" stroke-width="0.8"/>
      <path d="M -14,-2 L 0,8 L 14,-2 L 8,-2 L 0,2 L -8,-2 Z" fill="${darken(color, 0.2)}" stroke="${darken(color)}" stroke-width="0.6"/>
      <polygon points="-8,-2 0,-22 -3,-4" fill="${color}" opacity="0.85" stroke="${darken(color)}" stroke-width="0.4"/>
      <polygon points="3,-4 0,-22 8,-2" fill="${darken(color, 0.1)}" stroke="${darken(color)}" stroke-width="0.4"/>
      <line x1="0" y1="-22" x2="0" y2="8" stroke="#fff" stroke-width="0.5" opacity="0.6"/>
      <line x1="-8" y1="-2" x2="-3" y2="-4" stroke="#fff" stroke-width="0.4" opacity="0.5"/>
      <line x1="8" y1="-2" x2="3" y2="-4" stroke="#fff" stroke-width="0.4" opacity="0.5"/>
      <circle cx="-3" cy="-12" r="1.5" fill="#fff" opacity="0.7"/>
    `;
  }
  return `<g transform="translate(${cx},${cy}) rotate(${rot * 0.15}) scale(${scale})">${body}</g>`;
}

function darken(hex, amt = 0.25) {
  const c = hex.replace('#','');
  const r = Math.max(0, parseInt(c.slice(0,2),16) * (1 - amt));
  const g = Math.max(0, parseInt(c.slice(2,4),16) * (1 - amt));
  const b = Math.max(0, parseInt(c.slice(4,6),16) * (1 - amt));
  return '#' + [r,g,b].map(v => Math.round(v).toString(16).padStart(2,'0')).join('');
}

// ============ Toast ============
function toast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('show'), 2200);
}

// ============ Download helpers ============
function svgToBlob(svgString, width, height) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const img = new Image();
    const url = URL.createObjectURL(new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' }));
    img.onload = () => {
      try {
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(blob => {
          URL.revokeObjectURL(url);
          if (blob) resolve(blob);
          else reject(new Error('toBlob returned null'));
        }, 'image/jpeg', 0.92);
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
    img.src = url;
  });
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 800);
}

async function downloadAssetCard(item, type, tab, idx) {
  try {
    const svg = makeAssetSVG(item, type, tab, idx);
    const blob = await svgToBlob(svg, 1200, 1200);
    triggerDownload(blob, `${item.label}.jpg`);
    toast('已下载:' + item.label + '.jpg');
  } catch (err) {
    console.error(err);
    toast('下载失败,请稍后再试');
  }
}

async function downloadDetailImage() {
  try {
    const svgEl = $('detail-scroll').querySelector('svg');
    if (!svgEl) return toast('详情图还未生成');
    const vb = svgEl.getAttribute('viewBox').split(/\s+/).map(Number);
    const svgString = new XMLSerializer().serializeToString(svgEl);
    const scale = 3;
    const w = vb[2] * scale;
    const h = vb[3] * scale;
    toast('正在导出详情图...');
    const blob = await svgToBlob(svgString, w, h);
    triggerDownload(blob, `${state.edits.title || '商品'}_详情页.jpg`);
    toast(`已下载:详情页长图 (${w} × ${h})`);
  } catch (err) {
    console.error(err);
    toast('详情图导出失败');
  }
}

const TAB_FOLDER = {
  main: '01_主图',
  scene: '02_场景图',
  detail: '03_细节图',
  variant: '04_变体图',
};

async function downloadAllZip() {
  if (typeof JSZip === 'undefined') {
    toast('打包库未加载,请检查网络');
    return;
  }
  const btn = $('download-all-btn');
  const originalText = btn ? btn.textContent : '';
  if (btn) { btn.disabled = true; btn.textContent = '打包中...'; }
  try {
    const zip = new JSZip();

    // Add all 12 asset cards
    let total = 0;
    for (const tab of Object.keys(ASSETS)) {
      const folder = zip.folder(TAB_FOLDER[tab] || tab);
      const items = ASSETS[tab];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const svg = makeAssetSVG(item, state.productType, tab, i);
        const blob = await svgToBlob(svg, 1200, 1200);
        folder.file(`${item.label}.jpg`, blob);
        total++;
        if (btn) btn.textContent = `打包中 ${total}/13`;
      }
    }

    // Add detail page long image
    const detailEl = $('detail-scroll').querySelector('svg');
    if (detailEl) {
      const vb = detailEl.getAttribute('viewBox').split(/\s+/).map(Number);
      const svgString = new XMLSerializer().serializeToString(detailEl);
      const scale = 2.5;
      const blob = await svgToBlob(svgString, vb[2] * scale, vb[3] * scale);
      zip.file(`05_详情页/${state.edits.title || '商品'}_详情页.jpg`, blob);
      total++;
      if (btn) btn.textContent = `打包中 ${total}/13`;
    }

    // Add a manifest
    const manifest = [
      '云桨 · 一图全店  素材清单',
      '─────────────────────────',
      `商品: ${state.edits.title}`,
      `品牌: ${state.edits.brand}`,
      `售价: ¥${state.edits.price}  (划线价 ¥${state.edits.origPrice})`,
      `模版: ${TEMPLATES[state.template].name}`,
      `导出时间: ${new Date().toLocaleString('zh-CN')}`,
      '',
      '目录结构:',
      ' 01_主图/      × 5 张  (正面 / 45° / 侧面 / 俯视 / 背面)',
      ' 02_场景图/    × 3 张  (户外 / 室内 / 工作室)',
      ' 03_细节图/    × 2 张  (材质特写 / Logo 特写)',
      ' 04_变体图/    × 2 张  (红色 / 蓝色)',
      ' 05_详情页/    × 1 张  (长图)',
      '',
      '总计: 13 张  ·  可直接上架淘宝 / 京东 / 抖音',
    ].join('\n');
    zip.file('清单.txt', manifest);

    if (btn) btn.textContent = '压缩中...';
    const content = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 4 } });
    const sizeKB = Math.round(content.size / 1024);
    triggerDownload(content, `${state.edits.title || '商品'}_全店素材.zip`);
    toast(`已下载素材包 · 共 13 张 · ${sizeKB} KB`);
  } catch (err) {
    console.error(err);
    toast('打包失败,请稍后再试');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = originalText; }
  }
}

const downloadAllBtn = document.getElementById('download-all-btn');
if (downloadAllBtn) downloadAllBtn.addEventListener('click', downloadAllZip);

// ============ Countdown ticker ============
const countdownEnd = Date.now() + (23 * 3600 + 59 * 60 + 42) * 1000;
setInterval(() => {
  const hh = document.getElementById('countdown-hh');
  const mm = document.getElementById('countdown-mm');
  const ss = document.getElementById('countdown-ss');
  if (!hh && !mm && !ss) return;
  const remaining = Math.max(0, countdownEnd - Date.now());
  const totalSec = Math.floor(remaining / 1000);
  const h = String(Math.floor(totalSec / 3600)).padStart(2, '0');
  const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
  const s = String(totalSec % 60).padStart(2, '0');
  if (hh) hh.textContent = h;
  if (mm) mm.textContent = m;
  if (ss) ss.textContent = s;
}, 1000);

// ============ Init ============
selectSample('shoe');
