const STATUS_TONE = {
  ongoing: 'blue', scheduled: 'purple', draft: 'gray', finished: 'green',
  pending: 'orange', approved: 'green', rejected: 'red',
  high: 'red', mid: 'orange', low: 'blue', normal: 'green',
  ok: 'green', published: 'green',
};
const STATUS_TEXT = {
  ongoing: '进行中', scheduled: '待开考', draft: '草稿', finished: '已结束',
  pending: '待审核', approved: '已通过', rejected: '已驳回',
};

function tag(t, text) {
  return `<span class="tag tag-${STATUS_TONE[t] || 'gray'}">${text}</span>`;
}
function pageHead(title, desc, actions = '') {
  return `<div class="page-head"><div class="ph-text"><h2>${title}</h2><p>${desc}</p ></div><div class="ph-actions">${actions}</div></div>`;
}
function kpi(ic, label, value, sub = '', tone = 'blue') {
  return `<div class="kpi-card"><div class="kpi-ic ic-${tone}">${icon(ic, 22)}</div>
    <div class="kpi-body"><div class="kpi-value">${value}</div><div class="kpi-label">${label}${sub ? `<span>${sub}</span>` : ''}</div></div></div>`;
}
function toolbar(inner) { return `<div class="toolbar">${inner}</div>`; }
function tableWrap(headers, rowsHtml) {
  return `<div class="table-wrap"><table><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rowsHtml}</tbody></table></div>`;
}
const ACT = (label, fn = '此功能建设中') =>
  `<button class="btn btn-sm btn-ghost" onclick="notify('${label}${fn === '此功能建设中' ? ' · ' + fn : ''}')">${label}</button>`;
/* ---------- 雷达图 ---------- */
function radarSVG(data, size = 360) {
  const cx = size / 2, cy = size / 2, R = size / 2 - 52;
  const n = data.length;
  const pt = (i, r) => {
    const ang = -Math.PI / 2 + i * 2 * Math.PI / n;
    return [cx + r * Math.cos(ang), cy + r * Math.sin(ang)];
  };
  let grid = '';
  for (let ring = 4; ring >= 1; ring--) {
    const r = R * ring / 4;
    const pts = data.map((_, i) => pt(i, r).map(v => v.toFixed(1)).join(',')).join(' ');
    grid += `<polygon points="${pts}" class="radar-ring"/>`;
  }
  let axes = '';
  data.forEach((d, i) => {
    const [x, y] = pt(i, R);
    const [lx, ly] = pt(i, R + 32);
    axes += `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" class="radar-axis"/>
      <text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" class="radar-label" text-anchor="middle" dominant-baseline="middle">${d.axis}<tspan x="${lx.toFixed(1)}" dy="16" class="radar-val">${d.v}</tspan></text>`;
  });
  const dataPts = data.map((d, i) => pt(i, R * d.v / 100).map(v => v.toFixed(1)).join(',')).join(' ');
  const dots = data.map((d, i) => { const [x, y] = pt(i, R * d.v / 100); return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.5" class="radar-dot"/>`; }).join('');
  return `<svg viewBox="0 0 ${size} ${size}" class="radar-svg">${grid}${axes}<polygon points="${dataPts}" class="radar-poly"/>${dots}</svg>`;
}
/* ---------- 掌握度条形 ---------- */
function masteryRow(kp, v) {
  const tone = v < 50 ? 'bad' : v < 70 ? 'mid' : 'good';
  return `<div class="mastery-row"><span class="m-kp">${kp}</span>
    <div class="m-bar"><i class="mb-${tone}" style="width:${v}%"></i></div><span class="m-v mv-${tone}">${v}%</span></div>`;
}

/* ============================================================
 * 工作台
 * ============================================================ */
function pageDashboard() {
  if (state.role === 'student') return studentDashboard();
  const head = pageHead(`你好，${state.userName}`, '考试运行全局视图：监考、评阅、能力画像一站式掌握',
    `<button class="btn" onclick="go('exams')">${icon('plus', 15)} 创建考试</button>
     <button class="btn btn-primary" onclick="go('proctor')">${icon('video', 15)} 进入监考大屏</button>`);

  const kpis = `<div class="grid grid-4">
    ${kpi('file', '进行中考试', '2 <em>场</em>', '今日实操考核 1 场', 'blue')}
    ${kpi('users', '在线考生', '3,468 <em>人</em>', '大学物理实验实操考核', 'purple')}
    ${kpi('alert', '监考告警', '7 <em>条</em>', '高危 2 · 中危 3 · 低危 2', 'orange')}
    ${kpi('clipboard', '待评阅答卷', '1,286 <em>份</em>', 'AI 已初评 83%', 'green')}
  </div>`;

  const modules = `<div class="card"><div class="card-head"><h3>三大核心模块</h3><span class="card-sub">一个中台 · 三个闭环</span></div>
    <div class="module-list">
      <div class="module-item">
        <div class="mi-ic" style="background:linear-gradient(135deg,#4f6bff,#7c5cff)">${icon('shield', 20)}</div>
        <div class="mi-body"><b>智能监考与身份核验</b><p>人脸 + 姿态 + 语音多模态协同，持续身份交叉核验，误报率 ≤3%</p >
        <div class="mi-metrics"><span>核验准确率 99.2%</span><span>8 类行为识别</span><span>预警延迟 1.2s</span></div></div>
        <button class="btn btn-sm" onclick="go('proctor')">进入</button>
      </div>
      <div class="module-item">
        <div class="mi-ic" style="background:linear-gradient(135deg,#00b09b,#96c93d)">${icon('clipboard', 20)}</div>
        <div class="mi-body"><b>智能评阅与能力诊断</b><p>Rubric + 大模型 + 知识图谱，输出 50 维以上可解释能力画像</p >
        <div class="mi-metrics"><span>主观题一致性 91%</span><span>口语评测 92%</span><span>52 维已建模</span></div></div>
        <button class="btn btn-sm" onclick="go('grading')">进入</button>
      </div>
      <div class="module-item">
        <div class="mi-ic" style="background:linear-gradient(135deg,#ff7a59,#ffb347)">${icon('cpu', 20)}</div>
        <div class="mi-body"><b>高弹性考试管控中台</b><p>题型即插件、流程即配置，3 天上新考试场景，万人并发不崩</p >
        <div class="mi-metrics"><span>并发 10,000+</span><span>可用率 99.9%</span><span>教务对接 7 天</span></div></div>
        <button class="btn btn-sm" onclick="go('arch')">进入</button>
      </div>
    </div></div>`;

  const alertCard = `<div class="card"><div class="card-head"><h3>${icon('alert', 16)} 实时告警</h3>
      <a class="link" onclick="go('evidence')">查看全部 ${icon('arrowright', 13)}</a ></div>
    <div class="mini-alerts">${MOCK.alerts.slice(0, 5).map(a => `
      <div class="mini-alert lv-${a.level}">
        <div class="ma-l"><span class="ma-time">${a.time}</span><b>${a.student.split('（')[0]}</b><span class="ma-type">${a.type}</span></div>
        ${tag(a.level, a.level === 'high' ? '高' : a.level === 'mid' ? '中' : '低')}
      </div>`).join('')}</div></div>`;

  const examRows = MOCK.exams.map(e => `<tr>
      <td class="mono">${e.id}</td><td class="td-strong">${e.name}</td><td>${e.type}</td><td>${e.scene}</td>
      <td class="td-sub">${e.time}</td><td>${e.students}</td><td>${tag(e.status, e.statusText)}</td>
      <td class="td-actions"><a class="link" onclick="go('proctor')">监考</a ><a class="link" onclick="go('arrange')">排考</a >${ACT('管理')}</td></tr>`).join('');

  const healthBars = [
    { label: '当前并发人数', v: 8642, max: 10000, fmt: '8,642 / 10,000', tone: 'blue' },
    { label: '平均响应延迟', v: 328, max: 500, fmt: '328ms / 500ms', tone: 'green' },
    { label: '近 30 天可用率', v: 99.97, max: 100, fmt: '99.97% / 99.9%', tone: 'purple' },
    { label: '预警响应延迟', v: 1.2, max: 2, fmt: '1.2s / 2s', tone: 'orange' },
  ].map(h => `<div class="health-row"><div class="hr-top"><span>${h.label}</span><b>${h.fmt}</b></div>
      <div class="hr-bar"><i class="hb-${h.tone}" style="width:${Math.min(100, h.v / h.max * 100)}%"></i></div></div>`).join('');

  return `<div class="page">${head}
    ${kpis}
    <div class="grid grid-2">${modules}${alertCard}</div>
    <div class="card"><div class="card-head"><h3>最近考试</h3><a class="link" onclick="go('exams')">全部考试 ${icon('arrowright', 13)}</a ></div>
      ${tableWrap(['考试编号', '名称', '类型', '场景', '时间', '考生数', '状态', '操作'], examRows)}</div>
    <div class="card"><div class="card-head"><h3>${icon('activity', 16)} 系统健康度</h3><span class="card-sub">对照验收核心指标</span></div>
      <div class="grid grid-2 health-grid"><div>${healthBars}</div>
      <div class="health-note"><b>指标口径</b><p>并发、延迟、可用率均来自附录「核心技术指标对照表」；告警样本由多模态融合引擎产出，人工复核后归档至证据链中心。</p >
      <button class="btn btn-sm" onclick="go('monitor')">查看监控大屏</button></div></div></div>
  </div>`;
}
/* ---------- 学生工作台 ---------- */
function studentDashboard() {
  const me = MOCK.portrait;
  const e = MOCK.myExams;
  const head = pageHead(`你好，${me.name}`, '今日有待完成的考试，加油！',
    `<button class="btn" onclick="go('portrait')">${icon('user', 15)} 我的能力画像</button>
     <button class="btn btn-primary" onclick="notify('进入考试 · 在线答题功能建设中')">${icon('play', 15)} 进入考试</button>`);

  const ongoing = `<div class="card ongoing-exam">
    <div class="oe-left"><span class="oe-badge">${icon('clock', 13)} 考试进行中</span>
      <h3>${e.ongoing.name}</h3>
      <div class="oe-meta"><span>剩余时间 <b class="oe-timer">${e.ongoing.time}</b></span><span>已作答 <b>${e.ongoing.progress}%</b></span></div>
      <div class="hr-bar"><i class="hb-blue" style="width:${e.ongoing.progress}%"></i></div>
      <p class="oe-tip">${icon('shield', 13)} 多模态监考已开启：人脸核验 · 行为分析 · 语音检测</p ></div>
    <button class="btn btn-primary btn-lg" onclick="notify('进入考试 · 在线答题功能建设中')">${icon('play', 16)} 继续作答</button></div>`;

  const kpis = `<div class="grid grid-4">
    ${kpi('chart', '最近一次总分', '80 <em>分</em>', 'Java 阶段测验', 'blue')}
    ${kpi('users', '班级排名', '12 <em>/ 287</em>', '超过 95.8% 同学', 'purple')}
    ${kpi('target', '薄弱知识点', '3 <em>个</em>', '网络编程最薄弱', 'orange')}
    ${kpi('sparkles', '能力徽章', '12 <em>枚</em>', '本月 +2', 'green')}
  </div>`;

  const sched = `<div class="card"><div class="card-head"><h3>待开考</h3><span class="card-sub">${e.scheduled.length} 场</span></div>
    <div class="sched-list">${e.scheduled.map(s => `
      <div class="sched-item"><div class="si-ic">${icon('calendar', 18)}</div>
        <div class="si-body"><b>${s.name}</b><span>${s.time} · ${s.scene}</span></div>${ACT('设置提醒')}</div>`).join('')}
    </div></div>`;

  const scores = `<div class="card"><div class="card-head"><h3>最近成绩</h3><a class="link" onclick="go('scores')">全部成绩 ${icon('arrowright', 13)}</a ></div>
    <div class="sched-list">${e.finished.map(s => `
      <div class="sched-item"><div class="si-ic si-score">${icon('chart', 18)}</div>
        <div class="si-body"><b>${s.name}</b><span>${s.time}</span></div>
        <div class="si-score-v"><b>${s.total}</b><span>排名 ${s.rank}</span></div></div>`).join('')}
    </div></div>`;

  const advice = `<div class="card"><div class="card-head"><h3>${icon('sparkles', 16)} AI 学习建议</h3><span class="card-sub">由能力诊断引擎生成</span></div>
    <div class="advice-list">${MOCK.portrait.suggestions.map((s, i) => `
      <div class="advice-item"><span class="ad-idx">${i + 1}</span><p>${s}</p ></div>`).join('')}</div>
    <div class="card-foot"><button class="btn btn-sm btn-primary" onclick="go('portrait')">查看完整能力画像</button>${ACT('生成学习计划')}</div></div>`;

  return `<div class="page">${head}${ongoing}${kpis}<div class="grid grid-2">${sched}${scores}</div>${advice}</div>`;
}
/* ============================================================
 * 考前准备 —— 考试管理
 * ============================================================ */
function pageExams() {
  const head = pageHead('考试管理', '考前 —— 把考试办起来：创建、发布、状态跟踪',
    `<button class="btn" onclick="notify('导入考生名单功能建设中')">${icon('download', 15)} 导入名单</button>
     <button class="btn btn-primary" onclick="notify('创建考试 · 向导式配置建设中')">${icon('plus', 15)} 创建考试</button>`);

  const chips = `<div class="chips-row">
    ${['全部 5', '进行中 1', '待开考 2', '草稿 1', '已结束 1'].map((c, i) =>
      `<span class="chip ${i === 0 ? 'active' : ''}" onclick="notify('筛选功能建设中')">${c}</span>`).join('')}</div>`;

  const rows = MOCK.exams.map(e => `<tr>
    <td class="mono">${e.id}</td><td class="td-strong">${e.name}</td><td>${e.type}</td><td>${e.scene}</td>
    <td class="td-sub">${e.time}</td><td>${e.students}</td><td>${tag(e.status, e.statusText)}</td>
    <td class="td-actions">
      <a class="link" onclick="go('arrange')">${icon('calendar', 13)} 排考</a >
      <a class="link" onclick="go('proctor')">${icon('video', 13)} 监考</a >
      <a class="link" onclick="go('grading')">${icon('clipboard', 13)} 评阅</a >
      <a class="link danger" onclick="notify('删除操作需二次确认（建设中）')">${icon('trash', 13)}</a >
    </td></tr>`).join('');

  const bar = toolbar(`<div class="search-box">${icon('search', 15)}<input placeholder="搜索考试名称 / 编号…" oninput="notify('搜索功能建设中')"></div>
    <select class="select" onchange="notify('筛选功能建设中')"><option>全部类型</option><option>公共课统考</option><option>专业测评</option><option>技能实操</option></select>
    <select class="select" onchange="notify('筛选功能建设中')"><option>全部场景</option><option>在线考试</option><option>线下机房</option><option>混合式</option></select>`);

  return `<div class="page">${head}${bar}${chips}
    ${tableWrap(['考试编号', '考试名称', '类型', '场景', '时间', '考生数', '状态', '操作'], rows)}
    <div class="page-note">${icon('info', 14)} 框架演示阶段：列表为静态示例数据，考试创建向导、报名准入联动等交互能力在后续版本实现。</div>
  </div>`;
}

/* ============================================================
 * 考前准备 —— 题库管理
 * ============================================================ */
function pageBank() {
  const head = pageHead('题库管理', '题目入库、知识点标注与评分点维护',
    `<button class="btn" onclick="notify('批量导入功能建设中')">${icon('download', 15)} 批量导入</button>
     <button class="btn" onclick="notify('AI 知识点标注功能建设中')">${icon('sparkles', 15)} AI 标注知识点</button>
     <button class="btn btn-primary" onclick="notify('题目入库 · 编辑器建设中')">${icon('plus', 15)} 题目入库</button>`);

  const statCards = MOCK.bank.stats.map((s, i) => {
    const tones = ['blue', 'purple', 'green', 'orange', 'blue', 'purple', 'green'];
    return `<div class="bank-stat"><div class="bs-ic ic-${tones[i]}">${icon(['file', 'layers', 'check', 'edit', 'book', 'mic', 'video'][i], 18)}</div>
      <b class="count-up" data-target="${s.count}">0</b><span>${s.type}</span></div>`;
  }).join('');

  const rows = MOCK.bank.questions.map(q => `<tr>
    <td class="mono">${q.id}</td><td class="td-strong">${q.stem}</td><td>${tag('draft', q.type)}</td>
    <td>${q.kp}</td><td>${q.diff}</td><td>${q.used} 次</td>
    <td class="td-actions"><a class="link" onclick="notify('题目预览建设中')">${icon('eye', 13)} 预览</a ><a class="link" onclick="notify('题目编辑建设中')">${icon('edit', 13)} 编辑</a ></td></tr>`).join('');

  return `<div class="page">${head}
    <div class="bank-stats">${statCards}</div>
    ${toolbar(`<div class="search-box">${icon('search', 15)}<input placeholder="搜索题干 / 知识点…" oninput="notify('搜索功能建设中')"></div>
      <select class="select" onchange="notify('筛选功能建设中')"><option>全部题型</option><option>客观题</option><option>主观题</option><option>口语题</option><option>实操视频题</option></select>`)}
    ${tableWrap(['题目编号', '题干摘要', '题型', '关联知识点', '难度', '被引用', '操作'], rows)}
    <div class="page-note">${icon('info', 14)} 题型即插件：口语题、实操视频题等新题型即插即用，不改主干代码。</div>
  </div>`;
}
/* ============================================================
 * 考前准备 —— 智能组卷
 * ============================================================ */
function pageCompose() {
  const head = pageHead('智能组卷', '基于知识图谱和能力目标智能组卷，考什么、怎么考有据可依',
    `<button class="btn" onclick="notify('组卷模板保存建设中')">${icon('book', 15)} 存为模板</button>
     <button class="btn btn-primary" onclick="composeGenerate()">${icon('sparkles', 15)} AI 智能组卷</button>`);

  const kps = ['线性表', '栈与队列', '树与二叉树', '图论', '排序算法', '查找算法', '字符串匹配', '递归与分治'];
  const kpChips = kps.map(k => `<span class="chip" onclick="this.classList.toggle('active')">${k}</span>`).join('');

  const diffRows = [['简单', 30], ['中等', 50], ['困难', 20]].map(([l, v]) => `
    <div class="diff-row"><span>${l}</span><input type="range" min="0" max="100" value="${v}" onchange="notify('难度分布将实时联动知识点权重（建设中）')"><b>${v}%</b></div>`).join('');

  const typeRows = [['单选题', 20, 2], ['多选题', 5, 4], ['判断题', 10, 1], ['填空题', 5, 2], ['简答/论述', 3, 10]].map(([t, n, s]) => `
    <tr><td>${t}</td><td><input class="input num" type="number" value="${n}"></td><td><input class="input num" type="number" value="${s}"></td><td class="mono td-sub">${n * s} 分</td></tr>`).join('');

  const form = `<div class="card"><div class="card-head"><h3>组卷参数</h3><span class="card-sub">按能力目标出题</span></div>
    <div class="form-block">
      <label>目标考试</label>
      <select class="select full"><option>数据结构与算法期末考试（草稿）</option><option>高等数学（下）期中统考</option><option>+ 新建考试</option></select>
    </div>
    <div class="form-block"><label>考核知识点 <span class="lab-sub">点击选择，节点颜色见右侧知识图谱</span></label>
      <div class="chips-wrap">${kpChips}</div></div>
    <div class="form-block"><label>难度分布</label>${diffRows}</div>
    <div class="form-block"><label>题型与分值</label>
      <div class="table-wrap no-margin"><table class="mini"><thead><tr><th>题型</th><th>数量</th><th>每题分</th><th>小计</th></tr></thead><tbody>${typeRows}</tbody></table></div></div>
    <div class="form-block"><label>试卷选项</label>
      <div class="check-row">
        <label class="check"><input type="checkbox" checked><span>A / B 卷</span></label>
        <label class="check"><input type="checkbox" checked><span>题目乱序</span></label>
        <label class="check"><input type="checkbox"><span>选项乱序</span></label>
      </div></div>
    <button class="btn btn-primary btn-full" onclick="composeGenerate()">${icon('sparkles', 15)} 生成试卷（含双卷平行校验）</button></div>`;

  const legend = `<div class="kg-legend">
      <span><i class="lg lg-blue"></i>理论知识</span><span><i class="lg lg-orange"></i>实践操作</span>
      <span><i class="lg lg-purple"></i>逻辑推理</span><span><i class="lg lg-green"></i>问题解决</span></div>`;

  const graph = `<div class="card"><div class="card-head"><h3>知识图谱 <span class="card-sub">试题 · 评分点 · 知识点 · 能力维度</span></h3></div>
    <div class="kg-wrap">${knowledgeGraphSVG()}${legend}</div>
    <div class="kg-note">${icon('info', 14)} 组卷时点击图谱节点可精准圈定考核范围，系统自动平衡各能力维度覆盖度。</div></div>`;

  return `<div class="page">${head}<div class="grid grid-2">${form}${graph}</div>
    <div class="card" id="compose-result" style="display:none"></div>
    <div class="page-note">${icon('info', 14)} Neo4j 存储「试题—评分点—知识点—技能点—能力维度」关系，Q-Matrix 建立「题目—知识点」关联矩阵。</div>
  </div>`;
}

function composeGenerate() {
  const box = document.getElementById('compose-result');
  box.style.display = 'block';
  box.innerHTML = `<div class="card-head"><h3>${icon('check', 16)} 试卷生成完成 <span class="tag tag-green">演示数据</span></h3>
      <div><button class="btn btn-sm" onclick="notify('试卷预览建设中')">${icon('eye', 13)} 预览 A 卷</button>
      <button class="btn btn-sm" onclick="notify('试卷预览建设中')">${icon('eye', 13)} 预览 B 卷</button></div></div>
    <div class="paper-preview">
      <div class="paper-col"><div class="pp-title">A 卷</div>
        ${['一、单选题（20 题 × 2 分）', '二、多选题（5 题 × 4 分）', '三、判断题（10 题 × 1 分）', '四、填空题（5 题 × 2 分）', '五、简答/论述（3 题 × 10 分）'].map(t => `<div class="pp-sec">${t}</div>`).join('')}
        <div class="pp-skel">${'<i></i>'.repeat(6)}</div></div>
      <div class="paper-col"><div class="pp-title">B 卷（平行卷）</div>
        <div class="pp-parity"><div class="hr-bar"><i class="hb-green" style="width:92%"></i></div><span>与 A 卷知识覆盖重合度 92%</span></div>
        <div class="pp-skel">${'<i></i>'.repeat(6)}</div></div>
    </div>`;
  box.scrollIntoView({ behavior: 'smooth' });
  notify('已按当前参数生成演示试卷结构');
}

/* ---------- 知识图谱 SVG ---------- */
function knowledgeGraphSVG() {
  const nodes = [
    { id: 'c', x: 330, y: 225, r: 46, label: '数据结构与算法', type: 'center' },
    { id: 'n1', x: 120, y: 100, label: '线性表', type: 'blue' }, { id: 'n2', x: 95, y: 250, label: '栈与队列', type: 'orange' },
    { id: 'n3', x: 250, y: 75, label: '树与二叉树', type: 'purple' }, { id: 'n4', x: 490, y: 85, label: '图论', type: 'green' },
    { id: 'n5', x: 555, y: 245, label: '排序算法', type: 'orange' }, { id: 'n6', x: 505, y: 385, label: '查找算法', type: 'blue' },
    { id: 'n7', x: 205, y: 390, label: '字符串匹配', type: 'purple' },
    { id: 'l1', x: 55, y: 45, label: '链表', type: 'blue' }, { id: 'l2', x: 175, y: 30, label: '数组', type: 'blue' },
    { id: 'l3', x: 30, y: 330, label: '出入栈', type: 'orange' }, { id: 'l4', x: 340, y: 30, label: '遍历', type: 'purple' },
    { id: 'l5', x: 575, y: 45, label: 'DFS/BFS', type: 'green' }, { id: 'l6', x: 600, y: 160, label: '最短路', type: 'green' },
    { id: 'l7', x: 615, y: 330, label: '快排/堆排', type: 'orange' }, { id: 'l8', x: 430, y: 440, label: '二分查找', type: 'blue' },
    { id: 'l9', x: 155, y: 465, label: 'KMP', type: 'purple' },
  ];
  const links = [
    ['c', 'n1'], ['c', 'n2'], ['c', 'n3'], ['c', 'n4'], ['c', 'n5'], ['c', 'n6'], ['c', 'n7'],
    ['n1', 'l1'], ['n1', 'l2'], ['n2', 'l3'], ['n3', 'l4'], ['n4', 'l5'], ['n4', 'l6'],
    ['n5', 'l7'], ['n6', 'l8'], ['n7', 'l9'],
  ];
  const find = id => nodes.find(n => n.id === id);
  let svg = `<svg viewBox="0 0 680 510" class="kg-svg">`;
  svg += links.map(([a, b]) => { const A = find(a), B = find(b);
    return `<line x1="${A.x}" y1="${A.y}" x2="${B.x}" y2="${B.y}" class="kg-link ${a === 'c' ? 'main' : ''}"/>`; }).join('');
  svg += nodes.map(n => {
    if (n.type === 'center') return `<g class="kg-node center" transform="translate(${n.x},${n.y})">
      <rect x="${-n.r}" y="${-n.r / 1.7}" width="${n.r * 2}" height="${n.r / 0.85}" rx="18"/>
      <text text-anchor="middle" dominant-baseline="middle">${n.label}</text></g>`;
    return `<g class="kg-node ${n.type}" transform="translate(${n.x},${n.y})">
      <circle r="${n.id[0] === 'n' ? 26 : 19}"/><text text-anchor="middle" dominant-baseline="middle">${n.label}</text></g>`;
  }).join('');
  return svg + '</svg>';
}

/* ============================================================
 * 考前准备 —— 排考管理
 * ============================================================ */
function pageArrange() {
  const head = pageHead('排考管理', '考场编排、考生名单导入、监考老师分配',
    `<button class="btn" onclick="notify('考生名单导入建设中')">${icon('download', 15)} 导入考生名单</button>
     <button class="btn btn-primary" onclick="notify('一键自动编排 · 算法排考建设中')">${icon('zap', 15)} 一键自动编排</button>`);

  const kpis = `<div class="grid grid-4">
    ${kpi('building', '考场数', '5 <em>个</em>', '线下 3 · 线上 2', 'blue')}
    ${kpi('users', '覆盖考生', '2,688 <em>人</em>', '近一周场次', 'purple')}
    ${kpi('calendar', '已编排座位', '300 <em>席</em>', '完成率 82%', 'green')}
    ${kpi('userplus', '待分配监考', '1 <em>人</em>', '机房 B203', 'orange')}
  </div>`;

  const rows = MOCK.arrange.map(a => `<tr>
    <td class="td-strong">${a.room}</td><td>${a.exam}</td><td class="td-sub">${a.time}</td>
    <td>${a.teachers}</td><td>${a.students}</td><td>${tag(a.seats === '已编排' ? 'approved' : a.seats === '—' ? 'normal' : 'pending', a.seats)}</td>
    <td class="td-actions"><a class="link" onclick="notify('座位编排图建设中')">${icon('grid', 13)} 座位图</a ><a class="link" onclick="notify('监考分配建设中')">${icon('userplus', 13)} 分配</a ></td></tr>`).join('');

  return `<div class="page">${head}${kpis}
    ${tableWrap(['考场', '考试', '时间', '监考老师', '考生数', '座位编排', '操作'], rows)}
    <div class="page-note">${icon('info', 14)} 线上考场由系统自动巡考 + 值班教师复核；万人级统考支持边缘节点就近拉卷。</div>
  </div>`;
}

/* ============================================================
 * 考前准备 —— 报名与准入
 * ============================================================ */
function pageEnroll() {
  const head = pageHead('报名与准入', '考生报名审核与准考证生成',
    `<button class="btn" onclick="notify('准考证批量生成建设中')">${icon('file', 15)} 生成准考证</button>
     <button class="btn btn-primary" onclick="notify('批量审核建设中')">${icon('check', 15)} 批量通过</button>`);

  const rows = MOCK.enroll.map(e => `<tr>
    <td class="td-strong">${e.name}</td><td class="mono">${e.sid}</td><td>${e.cls}</td>
    <td>${e.exam}</td><td class="td-sub">${e.applyTime}</td><td>${tag(e.status, STATUS_TEXT[e.status])}</td>
    <td class="td-actions">
      ${e.status === 'pending' ? `<a class="link ok" onclick="notify('通过报名 · 功能建设中')">${icon('check', 13)} 通过</a >
      <a class="link danger" onclick="notify('驳回报名 · 功能建设中')">${icon('x', 13)} 驳回</a >` : '<span class="td-sub">—</span>'}
    </td></tr>`).join('');

  const kpis = `<div class="grid grid-4">
    ${kpi('userplus', '今日新增报名', '18 <em>人</em>', '自动冲突校验通过', 'blue')}
    ${kpi('clock', '待审核', '3 <em>人</em>', '平均处理 0.5 天', 'orange')}
    ${kpi('check', '本月已通过', '126 <em>人</em>', '驳回 5 人', 'green')}
    ${kpi('lock', '准入校验', '运行中', '学籍 / 缓考 / 冲突', 'purple')}
  </div>`;

  return `<div class="page">${head}${kpis}
    ${tableWrap(['姓名', '学号', '班级', '报考考试', '报名时间', '状态', '操作'], rows)}
    <div class="page-note">${icon('info', 14)} 报名通过后自动联动排考系统分配座位，并在考前 24h 触发设备检测与身份预核验。</div>
  </div>`;
}

/* ============================================================
 * 考中监控 —— 监考大屏
 * ============================================================ */
function pageProctor() {
  const head = pageHead('监考大屏', '人脸 + 行为 + 语音多模态实时监考，异常自动预警并留痕',
    `<select class="select" onchange="notify('考场切换建设中')"><option>实验楼 C301 · 物理实操考核</option><option>线上考场-001 · 四级模拟</option></select>
     <button class="btn" onclick="notify('语音引擎控制建设中')">${icon('mic', 15)} 语音引擎</button>
     <button class="btn btn-primary" onclick="notify('大屏投放模式建设中')">${icon('play', 15)} 大屏模式</button>`);

  const kpis = `<div class="grid grid-4">
    ${kpi('users', '在线监考', '356 <em>人</em>', '本考场 64 / 64', 'blue')}
    ${kpi('cpu', 'AI 引擎', '3 / 3', '人脸 · 姿态 · 语音', 'green')}
    ${kpi('alert', '实时告警', '7 <em>条</em>', '高危 2 · 中危 3', 'red')}
    ${kpi('zap', '预警延迟', '1.2 <em>s</em>', '目标 ≤ 2s', 'purple')}
  </div>`;

  const cams = MOCK.proctorCams.map(c => {
    const cls = `cam-${c.risk}`;
    const riskTag = c.risk === 'normal' ? tag('normal', '正常') : tag(c.risk, c.note);
    return `<div class="cam ${cls}">
      <div class="cam-view">
        ${icon('user', 46, 'cam-avatar')}
        <span class="cam-rec">● REC</span>
        <div class="cam-modals">
          <span class="mm on" title="人脸核验">${icon('face', 13)}</span>
          <span class="mm on" title="姿态分析">${icon('camera', 13)}</span>
          <span class="mm on" title="语音检测">${icon('mic', 13)}</span>
        </div>
      </div>
      <div class="cam-meta"><b>${c.seat} · ${c.name}</b>${riskTag}</div></div>`;
  }).join('');

  const alerts = MOCK.alerts.map(a => `
    <div class="alert-item lv-${a.level}">
      <div class="ai-top"><span class="ai-time">${a.time}</span>${tag(a.level, a.level === 'high' ? '高风险' : a.level === 'mid' ? '中风险' : '低风险')}</div>
      <div class="ai-body"><b>${a.student.split('（')[0]}</b><span class="ai-type">${a.type}</span><span class="ai-mod">${a.modality}</span></div>
      <button class="btn btn-sm btn-ghost" onclick="notify('证据链复核功能建设中')">${icon('shield', 13)} 查看证据</button>
    </div>`).join('');

  const weights = `<div class="card weight-card"><div class="card-head"><h3>${icon('cpu', 16)} 多模态动态权重</h3>
      <span class="card-sub">根据考场光照 / 噪声自动调整</span></div>
    <div class="weight-rows">
      <div class="w-row"><span>${icon('face', 15)} 人脸核验</span><div class="w-bar"><i style="width:40%"></i></div><b>0.40</b></div>
      <div class="w-row"><span>${icon('camera', 15)} 视觉姿态</span><div class="w-bar"><i style="width:35%"></i></div><b>0.35</b></div>
      <div class="w-row"><span>${icon('mic', 15)} 语音声学</span><div class="w-bar"><i style="width:25%"></i></div><b>0.25</b></div>
    </div>
    <div class="kg-note">${icon('info', 14)} 开考前 30 秒自动学习考生答题习惯，建立个体行为基线，区分「个人习惯」与「真实作弊」。</div></div>`;

  return `<div class="page proctor-page">${head}${kpis}
    <div class="proctor-layout">
      <div class="cam-grid">${cams}
        <button class="cam cam-add" onclick="notify('加载更多路画面建设中')">${icon('plus', 22)}<span>加载更多画面</span></button>
      </div>
      <aside class="alert-feed"><div class="af-head">${icon('alert', 15)} 实时告警流<span class="af-live">LIVE</span></div>
        <div class="af-list" id="alert-feed-list">${alerts}</div></aside>
    </div>${weights}
    <div class="page-note">${icon('info', 14)} 画面网格为静态占位示意；告警流由多模态融合引擎产出，人工复核后自动归档至证据链中心。</div>
  </div>`;
}

/* ============================================================
 * 考中监控 —— 多模态引擎
 * ============================================================ */
function pageMultimodal() {
  const head = pageHead('多模态引擎', '身份核验 / 行为分析 / 语音分析 三引擎协同推理');

  const engines = [
    { ic: 'face', name: '身份核验引擎', tone: 'blue', tools: ['InsightFace', 'dlib'], points: ['全周期人脸一致性核验', '抵御照片 / 视频回放 / 面具伪装', '人脸 + 声纹持续交叉校验'] },
    { ic: 'camera', name: '行为分析引擎', tone: 'orange', tools: ['YOLOv8', 'MediaPipe', 'OpenCV'], points: ['人体骨架 / 头部姿态 / 视线状态提取', '8 类异常行为实时识别', '光照自适应推理'] },
    { ic: 'mic', name: '语音分析引擎', tone: 'purple', tools: ['Librosa', 'Webrtcvad', 'PyAudio'], points: ['实时收音 / 降噪 / 人声活动检测', '低声交谈 · 耳语传答案检测', '耳机提示音频谱捕捉'] },
  ].map(e => `<div class="card engine-card">
    <div class="ec-head"><div class="mi-ic ic-${e.tone}">${icon(e.ic, 20)}</div><div><b>${e.name}</b><span class="ec-status">${tag('normal', '运行中')}</span></div></div>
    <div class="ec-tools">${e.tools.map(t => `<span class="tool-chip">${t}</span>`).join('')}</div>
    <ul class="ec-points">${e.points.map(p => `<li>${icon('check', 13)} ${p}</li>`).join('')}</ul></div>`).join('');

  const steps = ['数据实时采集', '多维度并行推理', '个体基线校准', '动态加权融合', '风险分级告警', '证据链归档'];
  const pipeline = `<div class="pipeline">${steps.map((s, i) => `
    <div class="pipe-step"><span class="ps-idx">${i + 1}</span><span class="ps-label">${s}</span></div>
    ${i < steps.length - 1 ? `<div class="pipe-arrow">${icon('arrowright', 15)}</div>` : ''}`).join('')}</div>`;

  const behaviors = ['替考 / 非本人', '低头演算', '频繁转头', '离座', '多人入镜', '手持违禁物品', '低声交谈', '耳机提示音'];
  const bChips = behaviors.map(b => `<span class="chip big">${icon('alert', 13)} ${b}</span>`).join('');

  const riskCards = [
    { lv: 'high', name: '高风险', desc: '自动截屏留证 + 弹窗提醒监考教师，强制人工复核', act: '立即处理' },
    { lv: 'mid', name: '中风险', desc: '持续观察 + 加密记录，累计到阈值升级为高风险', act: '重点关注' },
    { lv: 'low', name: '低风险', desc: '静默记录入档，供考后回溯分析，不打扰考生', act: '静默记录' },
  ].map(r => `<div class="risk-card rc-${r.lv}"><div class="rc-head">${tag(r.lv, r.name)}<span class="rc-act">${r.act}</span></div><p>${r.desc}</p ></div>`).join('');

  return `<div class="page">${head}
    <div class="grid grid-3">${engines}</div>
    <div class="card"><div class="card-head"><h3>融合决策流程</h3><span class="card-sub">时序滑动窗口 · 动态权重融合</span></div>${pipeline}</div>
    <div class="card"><div class="card-head"><h3>覆盖 8 类作弊行为</h3><span class="card-sub">综合识别准确率 ≥95% · 误报率 ≤3%</span></div>
      <div class="chips-wrap">${bChips}</div></div>
    <div class="grid grid-3">${riskCards}
      <div class="page-note" style="grid-column:1/-1">${icon('info', 14)} 三层分层融合架构：单模态抽取 → 时序对齐协同推理 → 决策级动态加权，解决传统系统「简单拼接、互相无法佐证」的问题。</div>
    </div>
  </div>`;
}

/* ============================================================
 * 考中监控 —— 证据链中心
 * ============================================================ */
function pageEvidence() {
  const head = pageHead('证据链中心', '触发风险自动留存截图、音频片段与行为数据，全程可追溯',
    `<button class="btn" onclick="notify('批量导出功能建设中')">${icon('download', 15)} 批量导出</button>
     <button class="btn btn-primary" onclick="notify('一键复核功能建设中')">${icon('check', 15)} 一键复核</button>`);

  const kpis = `<div class="grid grid-4">
    ${kpi('shield', '今日证据包', '6 <em>份</em>', '时空关联归档', 'blue')}
    ${kpi('clock', '待复核', '4 <em>份</em>', '含高危 2 份', 'orange')}
    ${kpi('check', '已确认', '1 <em>份</em>', '确认作弊成立', 'red')}
    ${kpi('eye', '已排除', '1 <em>份</em>', '个人习惯误报', 'green')}
  </div>`;

  const rows = MOCK.evidence.map(e => `<tr>
    <td class="mono">${e.id}</td><td class="td-sub">${e.time}</td><td class="td-strong">${e.student}</td>
    <td>${e.type}</td><td>${tag(e.level, e.level === 'high' ? '高' : e.level === 'mid' ? '中' : '低')}</td>
    <td class="td-sub">${e.pack}</td><td>${tag(e.status === '已排除' ? 'rejected' : e.status === '已确认' ? 'approved' : 'pending', e.status)}</td>
    <td class="td-actions"><a class="link" onclick="notify('证据包详情预览建设中')">${icon('eye', 13)} 复核</a ><a class="link" onclick="notify('证据包下载建设中')">${icon('download', 13)} 下载</a ></td></tr>`).join('');

  return `<div class="page">${head}${kpis}
    ${toolbar(`<div class="search-box">${icon('search', 15)}<input placeholder="搜索证据编号 / 考生…" oninput="notify('搜索功能建设中')"></div>
      <select class="select" onchange="notify('筛选功能建设中')"><option>全部等级</option><option>高风险</option><option>中风险</option><option>低风险</option></select>`)}
    ${tableWrap(['证据编号', '时间', '考生', '行为类型', '风险', '证据内容', '状态', '操作'], rows)}
    <div class="page-note">${icon('info', 14)} 考务事件可追溯率目标 100%：截图 / 音频 / 行为序列 / 异常参数自动打包，教师后台一键复核溯源。</div>
  </div>`;
}