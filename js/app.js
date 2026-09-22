/* ============================================================
 * 智慧考试评价系统 SmartExam OS - 应用核心
 * 状态 · 路由 · 登录 · 布局 · 交互 · AI 助手
 * ============================================================ */

const state = {
  role: null,          // null | 'admin' | 'teacher' | 'student'
  userName: '',
  route: 'dashboard',
};

const ROLE_NAMES = { admin: '王立群', teacher: '陈思远', student: '张明远' };

/* ---------- 导航（按角色过滤） ---------- */
const NAV = [
  {
    group: '总览', items: [
      { id: 'dashboard', label: '工作台', icon: 'grid' },
    ],
  },
  {
    group: '考前准备', roles: ['admin', 'teacher'], items: [
      { id: 'exams', label: '考试管理', icon: 'file' },
      { id: 'bank', label: '题库管理', icon: 'database' },
      { id: 'compose', label: '智能组卷', icon: 'layers' },
      { id: 'arrange', label: '排考管理', icon: 'calendar' },
      { id: 'enroll', label: '报名与准入', icon: 'userplus' },
    ],
  },
  {
    group: '考中监控', roles: ['admin', 'teacher'], items: [
      { id: 'proctor', label: '监考大屏', icon: 'video' },
      { id: 'multimodal', label: '多模态引擎', icon: 'scan' },
      { id: 'evidence', label: '证据链中心', icon: 'shield' },
    ],
  },
  {
    group: '考后评价', items: [
      { id: 'grading', label: '智能评阅', icon: 'clipboard', roles: ['admin', 'teacher'] },
      { id: 'scores', label: '成绩管理', icon: 'chart' },
      { id: 'portrait', label: '能力画像', icon: 'user' },
    ],
  },
  {
    group: '系统中台', roles: ['admin', 'teacher'], items: [
      { id: 'arch', label: '架构总览', icon: 'cpu' },
      { id: 'users', label: '用户与权限', icon: 'users' },
      { id: 'data', label: '数据治理', icon: 'harddrive' },
      { id: 'api', label: '开放接口', icon: 'code' },
      { id: 'monitor', label: '监控大屏', icon: 'activity' },
    ],
  },
  {
    group: '关于', items: [
      { id: 'about', label: '项目说明', icon: 'info' },
    ],
  },
];

const NAV_STUDENT = [
  { group: '总览', items: [{ id: 'dashboard', label: '工作台', icon: 'grid' }] },
  { group: '我的考试', items: [
    { id: 'myexams', label: '我的考试', icon: 'calendar' },
    { id: 'scores', label: '我的成绩', icon: 'chart' },
  ] },
  { group: '我的成长', items: [{ id: 'portrait', label: '我的能力画像', icon: 'user' }] },
  { group: '关于', items: [{ id: 'about', label: '项目说明', icon: 'info' }] },
];

const PAGES = {
  dashboard: pageDashboard, exams: pageExams, bank: pageBank, compose: pageCompose,
  arrange: pageArrange, enroll: pageEnroll, proctor: pageProctor, multimodal: pageMultimodal,
  evidence: pageEvidence, grading: pageGrading, scores: pageScores, portrait: pagePortrait,
  arch: pageArch, users: pageUsers, data: pageData, api: pageAPI, monitor: pageMonitor,
  about: pageAbout, myexams: pageMyExams,
};
const PAGE_TITLES = {
  dashboard: '工作台', exams: '考试管理', bank: '题库管理', compose: '智能组卷',
  arrange: '排考管理', enroll: '报名与准入', proctor: '监考大屏', multimodal: '多模态引擎',
  evidence: '证据链中心', grading: '智能评阅', scores: '成绩管理', portrait: '能力画像',
  arch: '架构总览', users: '用户与权限', data: '数据治理', api: '开放接口',
  monitor: '监控大屏', about: '项目说明', myexams: '我的考试',
};

/* ============================================================
 * 登录页
 * ============================================================ */
function renderLogin() {
  const app = document.getElementById('app');
  const roleCards = Object.entries(ROLES).map(([k, r]) => `
    <div class="login-role ${state._pickRole === k ? 'pick' : ''}" data-role="${k}" onclick="pickRole('${k}')">
      <div class="lr-ic">${icon(r.icon, 22)}</div><div><b>${r.label}</b><span>${r.desc}</span></div>
      <span class="lr-check">${icon('check', 13)}</span></div>`).join('');

  app.innerHTML = `
  <div class="login-page">
    <div class="login-brand">
      <div class="lb-glow one"></div><div class="lb-glow two"></div>
      <div class="lb-content">
        <div class="lb-logo"><span class="lb-logo-ic">${icon('sparkles', 24)}</span>
          <div><b>智慧考试评价系统</b><span>SmartExam OS · 考试评价操作系统</span></div></div>
        <h1>用 AI 把一次考试<br>变成一份<span class="grad-text">能力画像</span></h1>
        <p class="lb-sub">考前智能组卷 · 考中多模态监考 · 考后能力诊断，让考试从「给人打分」真正转向「帮人成长」。</p >
        <div class="lb-modules">
          <div class="lbm"><b>01</b><span>智能监考与身份核验</span><p>人脸+姿态+语音多模态，误报率≤3%</p ></div>
          <div class="lbm"><b>02</b><span>智能评阅与能力诊断</span><p>50维以上可解释能力画像</p ></div>
          <div class="lbm"><b>03</b><span>高弹性考试管控中台</span><p>万人并发 · 3天上新场景</p ></div>
        </div>
        <div class="lb-metrics">${['识别准确率 ≥95%', '评分一致性 ≥90%', '并发 10,000+', '可用率 99.9%'].map(m => `<span>${icon('zap', 12)} ${m}</span>`).join('')}</div>
      </div>
    </div>
    <div class="login-panel">
      <div class="lp-card">
        <h2>登录系统</h2><p class="lp-tip">框架演示版：选择角色后点击登录即可进入</p >
        <label class="lp-label">选择角色</label>
        <div class="login-roles">${roleCards}</div>
        <label class="lp-label">账号</label>
        <div class="lp-input">${icon('user', 16)}<input id="login-acc" placeholder="演示阶段可任意输入"></div>
        <label class="lp-label">密码</label>
        <div class="lp-input">${icon('lock', 16)}<input id="login-pwd" type="password" placeholder="••••••••"></div>
        <button class="btn btn-primary btn-full btn-lg" onclick="doLogin()">${icon('logout', 16)} 登 录</button>
        <div class="lp-foot">${icon('graduation', 13)} 河南工业大学 · 智慧教育创新团队 · 项目框架演示版 v0.1</div>
      </div>
    </div>
  </div>`;
}

function pickRole(r) {
  state._pickRole = r;
  renderLogin();
}
function doLogin() {
  if (!state._pickRole) { showToast('请先选择角色', 'warn'); return; }
  state.role = state._pickRole;
  state.userName = ROLE_NAMES[state.role] || '演示用户';
  const acc = document.getElementById('login-acc');
  if (acc && acc.value.trim()) state.userName = acc.value.trim();
  showToast(`欢迎，${ROLES[state.role].label} ${state.userName}`, 'ok');
  go('dashboard');
}

/* ============================================================
 * 主布局
 * ============================================================ */
function navForRole() {
  const nav = state.role === 'student' ? NAV_STUDENT : NAV;
  return nav.filter(g => !g.roles || g.roles.includes(state.role))
    .map(g => ({ ...g, items: g.items.filter(it => !it.roles || it.roles.includes(state.role)) }))
    .filter(g => g.items.length);
}

function renderLayout() {
  const app = document.getElementById('app');
  const nav = navForRole();
  const groups = nav.map(g => `
    <div class="nav-group"><div class="nav-group-title">${g.group}</div>
      ${g.items.map(it => `
        <a class="nav-item ${state.route === it.id ? 'active' : ''}" onclick="go('${it.id}')" title="${it.label}">
          ${icon(it.icon, 18)}<span class="ni-label">${it.label}</span>
          ${it.id === 'proctor' ? '<span class="ni-badge">7</span>' : ''}
        </a >`).join('')}
    </div>`).join('');

  app.innerHTML = `
  <div class="layout ${state._collapsed ? 'collapsed' : ''}" id="layout">
    <aside class="sidebar" id="sidebar">
      <div class="sb-logo" onclick="go('dashboard')">
        <span class="sb-logo-ic">${icon('sparkles', 20)}</span>
        <div class="sb-logo-text"><b>SmartExam OS</b><span>智慧考试评价系统</span></div>
      </div>
      <nav class="sb-nav">${groups}</nav>
      <div class="sb-user">
        <div class="sb-avatar">${state.userName[0]}</div>
        <div class="sb-user-info"><b>${state.userName}</b><span>${ROLES[state.role].label}</span></div>
        <button class="sb-logout" title="退出登录" onclick="doLogout()">${icon('logout', 16)}</button>
      </div>
    </aside>
    <div class="main-wrap">
      <header class="topbar">
        <button class="tb-burger" onclick="toggleSidebar()">${icon('menu', 20)}</button>
        <div class="tb-crumb"><span>SmartExam OS</span><i>/</i><b>${PAGE_TITLES[state.route] || ''}</b></div>
        <div class="tb-right">
          <div class="tb-search">${icon('search', 15)}<input placeholder="全局搜索…（建设中）" onfocus="notify('全局搜索功能建设中')"></div>
          <span class="tb-clock" id="top-clock"></span>
          <button class="tb-bell" onclick="${state.role === 'student' ? "notify('通知中心建设中')" : "go('evidence')"}">${icon('bell', 18)}<span class="tb-badge">7</span></button>
          <div class="tb-role">${icon(ROLES[state.role].icon, 14)} ${ROLES[state.role].label}</div>
        </div>
      </header>
      <main class="main" id="main"></main>
    </div>
  </div>
  ${aiPanelHTML()}`;
  renderContent();
}

function renderContent() {
  const main = document.getElementById('main');
  if (!main) return;
  stopProctorSim();
  main.innerHTML = `<div class="page-enter">${(PAGES[state.route] || PAGES.dashboard)()}</div>`;
  // 侧边栏高亮
  document.querySelectorAll('.nav-item').forEach(el =>
    el.classList.toggle('active', el.getAttribute('onclick').includes(`'${state.route}'`)));
  // 顶栏面包屑
  const crumb = document.querySelector('.tb-crumb b');
  if (crumb) crumb.textContent = PAGE_TITLES[state.route] || '';
  main.scrollTop = 0;
  initCountUp();
  if (state.route === 'proctor') startProctorSim();
}

function doLogout() {
  state.role = null; state.route = 'dashboard'; state._collapsed = false;
  history.replaceState(null, '', location.pathname);
  renderLogin();
}
function toggleSidebar() { state._collapsed = !state._collapsed; document.getElementById('layout').classList.toggle('collapsed'); }

/* ============================================================
 * 路由
 * ============================================================ */
function go(page) {
  if (!PAGES[page]) return;
  state.route = page;
  const target = '#/' + page;
  if (location.hash === target) renderAll();
  else location.hash = target;
}
function renderAll() { state.role ? renderLayout() : renderLogin(); }

window.addEventListener('hashchange', () => {
  const r = (location.hash || '').replace('#/', '');
  if (!state.role || !PAGES[r]) return;
  state.route = r;
  if (document.getElementById('main')) renderContent();
  else renderLayout();
});
/* ============================================================
 * Toast
 * ============================================================ */
function showToast(msg, type = 'info') {
  let box = document.getElementById('toast-box');
  if (!box) { box = document.createElement('div'); box.id = 'toast-box'; document.body.appendChild(box); }
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.innerHTML = `${icon(type === 'ok' ? 'check' : type === 'warn' ? 'alert' : 'info', 15)}<span>${msg}</span>`;
  box.appendChild(t);
  setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 2400);
}
function notify(msg) { showToast('功能建设中：' + msg, 'info'); }

/* ============================================================
 * 数字滚动
 * ============================================================ */
function initCountUp() {
  document.querySelectorAll('.count-up').forEach(el => {
    const target = parseInt(el.dataset.target || '0', 10);
    const dur = 800, t0 = performance.now();
    const step = t => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

/* ============================================================
 * 监考大屏 · 模拟实时告警流
 * ============================================================ */
let _proctorTimer = null, _alertIdx = 0;
function startProctorSim() {
  stopProctorSim();
  _proctorTimer = setInterval(() => {
    const list = document.getElementById('alert-feed-list');
    if (!list) { stopProctorSim(); return; }
    const src = MOCK.alerts[_alertIdx % MOCK.alerts.length];
    _alertIdx++;
    const now = new Date();
    const a = { ...src, time: now.toTimeString().slice(0, 8) };
    const div = document.createElement('div');
    div.className = `alert-item lv-${a.level} slide-in`;
    div.innerHTML = `
      <div class="ai-top"><span class="ai-time">${a.time}</span>${tag(a.level, a.level === 'high' ? '高风险' : a.level === 'mid' ? '中风险' : '低风险')}</div>
      <div class="ai-body"><b>${a.student.split('（')[0]}</b><span class="ai-type">${a.type}</span><span class="ai-mod">${a.modality}</span></div>
      <button class="btn btn-sm btn-ghost" onclick="notify('证据链复核功能建设中')">${icon('shield', 13)} 查看证据</button>`;
    list.prepend(div);
    while (list.children.length > 14) list.lastElementChild.remove();
  }, 6000);
}
function stopProctorSim() { if (_proctorTimer) { clearInterval(_proctorTimer); _proctorTimer = null; } }

/* ============================================================
 * AI 考务助手（占位演示）
 * ============================================================ */
function aiPanelHTML() {
  return `
  <button class="ai-fab" id="ai-fab" onclick="toggleAI()" title="AI 考务助手">${icon('sparkles', 22)}</button>
  <div class="ai-panel" id="ai-panel">
    <div class="aip-head">
      <div class="aip-title"><span class="aip-ava">${icon('sparkles', 16)}</span>
        <div><b>AI 考务助手</b><span><i class="aip-dot"></i>在线 · 演示规则库</span></div></div>
      <button class="aip-close" onclick="toggleAI()">${icon('x', 16)}</button>
    </div>
    <div class="aip-body" id="aip-body">
      <div class="ai-msg bot">你好，我是考试评价操作系统的 AI 助手 🎓<br>可问我监考、评阅、画像、组卷等问题。</div>
      <div class="ai-quick">
        ${['监考误报率怎么控制？', '主观题如何评分？', '能力画像怎么生成？', '系统支持多少人并发？'].map(q =>
          `<span class="chip" onclick="aiAsk('${q}')">${q}</span>`).join('')}
      </div>
    </div>
    <div class="aip-input">
      <input id="aip-text" placeholder="输入问题，回车发送…" onkeydown="if(event.key==='Enter')aiSend()">
      <button onclick="aiSend()">${icon('send', 16)}</button>
    </div>
  </div>`;
}
function toggleAI() {
  document.getElementById('ai-panel').classList.toggle('open');
  document.getElementById('ai-fab').classList.toggle('hide');
  const inp = document.getElementById('aip-text');
  if (inp) setTimeout(() => inp.focus(), 200);
}
function aiMsg(html, who = 'bot') {
  const body = document.getElementById('aip-body');
  const d = document.createElement('div');
  d.className = `ai-msg ${who}`;
  d.innerHTML = html;
  body.appendChild(d);
  body.scrollTop = body.scrollHeight;
}
function aiAsk(q) { aiMsg(q, 'me'); aiReply(q); }
function aiSend() {
  const inp = document.getElementById('aip-text');
  const v = inp.value.trim();
  if (!v) return;
  inp.value = '';
  aiMsg(v, 'me');
  aiReply(v);
}
function aiReply(q) {
  const s = q.toLowerCase();
  const match = (...keys) => keys.some(k => s.includes(k));
  let r;
  if (match('作弊', '监考', '误报', '识别', '核验'))
    r = '我们采用<b>人脸+姿态+语音多模态协同推理</b>：开考前 30 秒建立个体行为基线，区分个人习惯与真实作弊；动态权重融合后输出高/中/低三级风险，8 类行为综合识别准确率 ≥95%，正常场景误报率 ≤3%。';
  else if (match('评阅', '打分', '主观', '判分', '口语', '阅卷'))
    r = '主观题采用 <b>Rubric 评分标准 + 大语言模型 + 语义向量匹配 + 规则校验</b> 组合机制，输出「分数+得分依据+扣分原因+置信度」；置信度低于 0.70 自动转教师终审。与资深教师评分一致性目标 ≥90%，口语类综合评测 ≥92%。';
  else if (match('画像', '能力', '诊断', '薄弱', '建议'))
    r = '能力画像基于「试题—评分点—知识点—技能点—能力维度」知识图谱（Neo4j + Q-Matrix），将作答结果映射到 <b>50+ 细分知识节点</b>，聚合出能力雷达、薄弱点诊断与个性化学习路径，画像匹配度 ≥88%。';
  else if (match('组卷', '出题', '题库', '试卷'))
    r = '智能组卷基于知识图谱与能力目标：圈定考核知识点、设置难度分布与题型分值，自动生成 A/B 平行卷并支持乱序，确保「考什么、怎么考」有据可依。';
  else if (match('并发', '性能', '延迟', '稳定', '人数', '崩'))
    r = '中台采用云原生微服务：试卷预铺边缘节点、K8s 弹性伸缩、答案异步入库，<b>单场次支持 ≥10,000 人并发</b>，平均响应 ≤500ms，全年可用率 ≥99.9%。';
  else if (match('对接', '教务', '接口', 'api', 'sdk'))
    r = '平台提供标准 API/SDK 与正方、强智等教务系统预置适配器，单点登录、名单同步、成绩回写一次打通，<b>对接周期 ≤7 天</b>；新考试场景配置 ≤3 个工作日。';
  else if (match('你好', 'hi', 'hello', '在吗'))
    r = '你好！我是框架演示阶段的规则问答助手，可以聊聊监考、评阅、画像、组卷、性能与教务对接～';
  else if (match('退出', '登出', 'logout'))
    r = '退出请点击左下角用户卡旁的退出按钮，或顶栏角色徽章确认身份。';
  else
    r = '当前为<b>系统框架演示阶段</b>，该问题对应的能力（后端服务 / 算法引擎）规划在后续版本实现。你可以问我：监考如何降误报、主观题怎么评分、能力画像怎么生成、系统支持多少并发。';
  setTimeout(() => aiMsg(r), 500);
}
/* ============================================================
 * 时钟
 * ============================================================ */
function tickClock() {
  const el = document.getElementById('top-clock');
  if (el) {
    const d = new Date();
    const w = ['日', '一', '二', '三', '四', '五', '六'][d.getDay()];
    el.textContent = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} 周${w} ${d.toTimeString().slice(0, 5)}`;
  }
}
setInterval(tickClock, 1000);

/* ============================================================
 * 启动
 * ============================================================ */
window.addEventListener('DOMContentLoaded', () => {
  renderLogin();
});
renderLogin();