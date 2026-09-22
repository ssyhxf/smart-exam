/* ============================================================
 * 智慧考试评价系统 SmartExam OS - 页面渲染（二）
 * 考后评价 + 系统中台 + 项目说明 + 学生页面
 * ============================================================ */

/* ============================================================
 * 考后评价 —— 智能评阅
 * ============================================================ */
function pageGrading() {
  const head = pageHead('智能评阅', 'AI 初评 — 模型复核 — 教师终审：每一个分数都有依据',
    `<button class="btn" onclick="notify('评阅报告导出建设中')">${icon('download', 15)} 导出报告</button>
     <button class="btn btn-primary" onclick="notify('批量重评任务建设中')">${icon('refresh', 15)} 批量重评</button>`);

  const steps = [
    ['file', '交卷', '答案异步入库'], ['check', '客观题判分', '规则引擎 · 100%'],
    ['sparkles', '主观题 AI 初评', 'Rubric + LLM'], ['scan', '置信度分流', '三档流转'],
    ['user', '教师终审', '低置信 / 争议卷'], ['chart', '回写与画像', '成绩 + 能力诊断'],
  ];
  const pipeline = `<div class="pipeline">${steps.map((s, i) => `
    <div class="pipe-step"><span class="ps-ic">${icon(s[0], 16)}</span><span class="ps-label">${s[1]}</span><span class="ps-sub">${s[2]}</span></div>
    ${i < steps.length - 1 ? `<div class="pipe-arrow">${icon('arrowright', 15)}</div>` : ''}`).join('')}</div>`;

  const confCards = [
    { r: '≥ 0.90', t: 'green', name: '高置信', desc: 'AI 自动评分并直接回写，抽检 5% 复核' },
    { r: '0.70 ~ 0.89', t: 'orange', name: '中置信', desc: '触发模型二次复核，通过后回写' },
    { r: '< 0.70', t: 'red', name: '低置信', desc: '自动转入教师复核队列，人工终审' },
  ].map(c => `<div class="conf-card cc-${c.t}"><span class="cc-badge">${c.r}</span><b>${c.name}</b><p>${c.desc}</p ></div>`).join('');

  const engines = [
    { ic: 'book', tone: 'blue', name: '文本主观题评阅', kpi: '与资深教师评分一致性 ≥90%', stack: 'Rubric 评分标准 · 大语言模型 · BGE/E5 向量 · FAISS/Milvus 检索 · 规则校验' },
    { ic: 'mic', tone: 'purple', name: '口语题评阅', kpi: '综合评测准确率 ≥92%', stack: 'FunASR / Whisper 语音识别 · 内容逻辑分析 · 语速/停顿/音高声学特征' },
    { ic: 'video', tone: 'orange', name: '实操视频评阅', kpi: '过程性评价 · 规范度判定', stack: 'FFmpeg + OpenCV 抽帧 · YOLO 目标检测 · PaddleOCR 读数识别 · 视觉语言模型' },
  ].map(e => `<div class="card engine-card"><div class="ec-head"><div class="mi-ic ic-${e.tone}">${icon(e.ic, 20)}</div>
      <div><b>${e.name}</b><div class="ec-kpi">${e.kpi}</div></div></div>
    <div class="ec-stack">${e.stack}</div></div>`).join('');

  const rows = MOCK.grading.queue.map(g => `<tr>
    <td class="mono">${g.paper}</td><td class="td-strong">${g.question}</td><td>${tag('draft', g.type)}</td>
    <td class="td-strong">${g.ai}</td>
    <td><div class="conf-bar"><i style="width:${g.conf * 100}%"></i></div><span class="conf-v">${g.conf.toFixed(2)}</span></td>
    <td class="td-sub">${g.flow}</td><td>${tag(g.status === '已回写' ? 'approved' : g.status === '待教师复核' ? 'pending' : 'normal', g.status)}</td>
    <td class="td-actions"><a class="link" onclick="notify('评阅详情复核建设中')">${icon('eye', 13)} 复核</a ></td></tr>`).join('');

  const s = MOCK.grading.evidenceSample;
  const evidenceCard = `<div class="card"><div class="card-head"><h3>${icon('shield', 16)} 评分证据链示例</h3><span class="card-sub">分数 + 得分依据 + 扣分原因 + 置信度</span></div>
    <div class="ev-grid">
      <div class="ev-q"><span class="ev-label">题目</span><p>${s.question}</p >
        <div class="ev-score"><b>${s.score}</b><span>AI 初评 · 置信度 ${s.conf}</span></div></div>
      <div class="ev-detail">
        <div class="ev-block"><span class="ev-label ok">命中评分点</span><ul>${s.hits.map(h => `<li>${icon('check', 13)} ${h}</li>`).join('')}</ul></div>
        <div class="ev-block"><span class="ev-label bad">扣分原因</span><p>${s.deduct}</p ></div>
        <div class="ev-block"><span class="ev-label">关键证据</span><p class="ev-quote">${s.evidence}</p ></div>
      </div>
    </div></div>`;

  return `<div class="page">${head}
    <div class="card"><div class="card-head"><h3>评阅流水线</h3><span class="card-sub">交卷后自动触发</span></div>${pipeline}</div>
    <div class="grid grid-3">${confCards}</div>
    <div class="grid grid-3">${engines}</div>
    <div class="card"><div class="card-head"><h3>评阅队列 <span class="card-sub">Java 程序设计阶段测验</span></h3>
      <button class="btn btn-sm" onclick="notify('复核队列建设中')">进入复核队列</button></div>
      ${tableWrap(['试卷号', '题目', '类型', 'AI 得分', '置信度', '流转', '状态', '操作'], rows)}</div>
    ${evidenceCard}
    <div class="page-note">${icon('info', 14)} 每次评分同步保存评分依据：关键作答片段、语音转写、视频关键帧、OCR 结果与模型置信度，支持教师一键回溯。</div>
  </div>`;
}
/* ============================================================
 * 考后评价 —— 成绩管理
 * ============================================================ */
function pageScores() {
  const isStudent = state.role === 'student';
  const S = MOCK.scores;
  const head = pageHead(isStudent ? '我的成绩' : '成绩管理', isStudent ? '历史成绩与趋势查询' : '分数统计、排名与成绩发布',
    `<button class="btn" onclick="notify('成绩单打印建设中')">${icon('file', 15)} 成绩单</button>
     <button class="btn" onclick="notify('Excel 导出建设中')">${icon('download', 15)} 导出 Excel</button>
     ${isStudent ? '' : `<button class="btn btn-primary" onclick="notify('成绩发布将推送至学生端（建设中）')">${icon('send', 15)} 发布成绩</button>`}`);

  const kpis = `<div class="grid grid-4">
    ${kpi('chart', '平均分', S.stats.avg, '较上学期 +2.1', 'blue')}
    ${kpi('target', '最高分', S.stats.max, '最低 23', 'green')}
    ${kpi('check', '及格率', S.stats.passRate + '%', '优秀率 31%', 'purple')}
    ${kpi('activity', '标准差', '9.6', '区分度 0.41 · 良好', 'orange')}
  </div>`;

  const rows = S.rows.map(r => `<tr>
    <td class="mono">${r.sid}</td><td class="td-strong">${r.name}</td><td>${r.cls}</td>
    <td>${r.obj} / 45</td><td>${r.subj} / 45</td><td class="td-strong score-hl">${r.total} / 90</td>
    <td><span class="rank-pill">${r.rank}</span></td><td>${tag('approved', '已发布')}</td>
    <td class="td-actions"><a class="link" onclick="go('portrait')">${icon('user', 13)} 画像</a ><a class="link" onclick="notify('成绩详情建设中')">${icon('eye', 13)} 详情</a ></td></tr>`).join('');

  return `<div class="page">${head}${kpis}
    <div class="card"><div class="card-head"><h3>${S.examName} <span class="card-sub">共 287 人 · 已发布</span></h3>
      ${isStudent ? '' : `<button class="btn btn-sm" onclick="notify('学情分析报告生成建设中')">${icon('sparkles', 13)} 生成学情分析</button>`}</div>
      ${tableWrap(['学号', '姓名', '班级', '客观题', '主观题', '总分', '排名', '状态', '操作'], rows)}
      <div class="card-foot center"><span class="td-sub">仅展示前 5 条示例数据 · 分页控件占位</span>
        <div class="pager">${['‹', '1', '2', '3', '…', '58', '›'].map(p => `<span class="pg ${p === '1' ? 'cur' : ''}" onclick="notify('分页功能建设中')">${p}</span>`).join('')}</div></div>
    </div>
    <div class="page-note">${icon('info', 14)} 成绩发布后自动触发能力画像更新：客观题 + 主观题评分点命中结果统一映射至知识图谱。</div>
  </div>`;
}

/* ============================================================
 * 考后评价 —— 能力画像
 * ============================================================ */
function pagePortrait() {
  const P = MOCK.portrait;
  const isStudent = state.role === 'student';
  const head = pageHead(isStudent ? '我的能力画像' : '能力画像', '从「给分数」到「画肖像」：52 维能力诊断与个性化学习建议',
    `<button class="btn" onclick="notify('PDF 报告导出建设中')">${icon('download', 15)} 导出 PDF 报告</button>
     <button class="btn btn-primary" onclick="notify('个性化学习计划生成建设中')">${icon('sparkles', 15)} 生成学习计划</button>`);

  const selector = isStudent ? '' : `<div class="card portrait-picker">
    <span class="pp-label">查看对象</span>
    <select class="select" onchange="notify('学生切换建设中')"><option>${P.name} · ${P.sid} · ${P.cls}</option><option>李文博 · 2023213056</option><option>王一诺 · 2023213067</option></select>
    <span class="pp-meta">${icon('database', 13)} 数据源：考试 + 作业 + 实操 · 最近更新 09-20</span></div>`;

  const profile = `<div class="card portrait-head-card">
    <div class="phc-left"><div class="avatar-lg">${P.name[0]}</div>
      <div><b>${P.name}<span class="tag tag-blue" style="margin-left:8px">${P.sid}</span></b>
        <p>${P.cls} · 综合评级 <b class="hl">B+</b> · 诊断维度 <b class="hl">${P.dims}</b> 项 · 画像匹配度 <b class="hl">${P.matchRate}%</b></p ></div></div>
    <div class="phc-badges">${['集合框架 · 精通', '面向对象 · 扎实', '多线程 · 良好'].map(b => `<span class="badge-chip">${icon('sparkles', 12)} ${b}</span>`).join('')}</div></div>`;

  const radarCard = `<div class="card"><div class="card-head"><h3>能力雷达</h3><span class="card-sub">五大能力维度</span></div>
    <div class="radar-wrap">${radarSVG(P.radar)}</div></div>`;

  const masteryCard = `<div class="card"><div class="card-head"><h3>知识点掌握度</h3><span class="card-sub">Q-Matrix 关联映射</span></div>
    <div class="mastery-list">${P.mastery.map(m => masteryRow(m.kp, m.v)).join('')}</div></div>`;

  const weakCard = `<div class="card"><div class="card-head"><h3>${icon('alert', 16)} 薄弱点诊断</h3><span class="card-sub">3 个薄弱知识点</span></div>
    <div class="weak-list">${P.weakness.map(w => `
      <div class="weak-item"><div class="wi-top"><b>${w.kp}</b><span class="wv">${w.rate}%</span></div>
        <div class="hr-bar"><i class="hb-red" style="width:${w.rate}%"></i></div><p>${w.desc}</p ></div>`).join('')}</div></div>`;

  const adviceCard = `<div class="card"><div class="card-head"><h3>${icon('sparkles', 16)} 个性化学习建议</h3><span class="card-sub">按画像动态生成</span></div>
    <div class="advice-list">${P.suggestions.map((s, i) => `<div class="advice-item"><span class="ad-idx">${i + 1}</span><p>${s}</p ></div>`).join('')}</div></div>`;

  const commentCard = `<div class="card comment-card"><div class="card-head"><h3>${icon('message', 16)} AI 综合评语</h3>
      <span class="card-sub">大模型生成 · 教师可修订</span></div>
    <blockquote>${P.comment}</blockquote>
    <div class="comment-foot">${ACT('教师修订评语')}<span class="td-sub">生成于 2026-09-21 08:30 · 置信度 0.89</span></div></div>`;

  return `<div class="page">${head}${selector}${profile}
    <div class="grid grid-2">${radarCard}${masteryCard}</div>
    <div class="grid grid-2">${weakCard}${adviceCard}</div>
    ${commentCard}
    <div class="page-note">${icon('info', 14)} 画像由「试题—评分点—知识点—技能点—能力维度」知识图谱聚合计算，细分诊断维度 ≥50 项，能力画像匹配度 ≥88%。</div>
  </div>`;
}
/* ============================================================
 * 系统中台 —— 架构总览
 * ============================================================ */
function pageArch() {
  const head = pageHead('架构总览', '一个中台 + 三大能力引擎 · 自上而下四层架构');

  const layers = [
    { name: '应用层', sub: '场景化应用', tone: 'l-blue', boxes: ['在线考试', '混合式考试', '线下机房考试', '技能实操考评'] },
    { name: '能力层', sub: '五大核心引擎', tone: 'l-purple', boxes: ['身份核验引擎', '行为分析引擎', '语音分析引擎', '智能评阅引擎', '能力诊断引擎'] },
    { name: '中台层', sub: '统一管控', tone: 'l-orange', boxes: ['考试编排', '题库管理', '考务调度', '数据治理', '开放接口 API/SDK'] },
    { name: '基础设施层', sub: '弹性底座', tone: 'l-green', boxes: ['容器化部署 K8s', '分布式缓存', '消息队列', '对象存储', '公有云 / 私有云 / 混合'] },
  ];
  const arch = `<div class="arch">${layers.map((l, i) => `
    ${i > 0 ? `<div class="arch-arrow">${icon('chevdown', 16)}</div>` : ''}
    <div class="arch-layer">
      <div class="al-title ${l.tone}"><b>${l.name}</b><span>${l.sub}</span></div>
      <div class="al-boxes">${l.boxes.map(b => `<div class="al-box">${b}</div>`).join('')}</div>
    </div>`).join('')}</div>`;

  const routes = [
    { ic: 'face', t: '视觉侧', d: '轻量级人脸检测 + 活体识别 + 行为姿态估计，保准确率同时降低算力成本' },
    { ic: 'mic', t: '语音侧', d: '语音识别 + 声纹 + 口语评测，解决口语题、实操讲解题的自动评分' },
    { ic: 'sparkles', t: '评阅侧', d: '大模型做要点提取与评语生成，知识图谱做评分点映射，教师最终把关' },
    { ic: 'cpu', t: '中台侧', d: '微服务 + 事件驱动架构，新考试场景配置即可上线，不写或少量写代码' },
  ].map(r => `<div class="route-card"><div class="mi-ic ic-blue">${icon(r.ic, 18)}</div><div><b>${r.t}</b><p>${r.d}</p ></div></div>`).join('');

  const features = [
    ['zap', '高并发抗洪', '试卷预铺边缘节点，K8s 弹性伸缩，1 万人同考不崩'],
    ['layers', '题型即插件', '实操视频题、口语题等新题型即插即用，不改主干'],
    ['network', '流程即配置', '报名→核验→开考→监考→交卷→评阅→报告，节点拖拽编排'],
    ['book', '场景模板', '公共课统考 / 技能等级考核 / 专业测评，选模板改参数即上线'],
    ['refresh', '断网续考', '答案本地暂存 + 30 秒心跳保存，断网 5 分钟重连不丢'],
    ['activity', '全链路监控', '并发、延迟、告警实时可见，出事秒级定位'],
    ['filter', '灰度试考', '正式考试前小规模彩排，验证配置再全量放开'],
    ['code', '7 天对接', '标准 API + 正方/强智教务适配器，单点登录 / 名单同步 / 成绩回写'],
  ].map(f => `<div class="feature-card"><div class="ft-ic">${icon(f[0], 16)}</div><b>${f[1]}</b><p>${f[2]}</p ></div>`).join('');

  return `<div class="page">${head}
    <div class="card"><div class="card-head"><h3>系统架构</h3><span class="card-sub">模块化 · 可扩展 · 高并发</span></div>${arch}</div>
    <div class="card"><div class="card-head"><h3>技术路线</h3><span class="card-sub">可落地 · 可解释 · 可对接</span></div>
      <div class="grid grid-2">${routes}</div></div>
    <div class="card"><div class="card-head"><h3>中台弹性能力</h3><span class="card-sub">「配百种考」</span></div>
      <div class="feature-grid">${features}</div></div>
    <div class="page-note">${icon('info', 14)} 监考视频流与答题流量分通道传输；交卷后一键调度 AI 评阅：自动批改、成绩回写、能力画像生成。</div>
  </div>`;
}

/* ============================================================
 * 系统中台 —— 用户与权限
 * ============================================================ */
function pageUsers() {
  const head = pageHead('用户与权限', '管理员 / 教师 / 学生 三级权限体系',
    `<button class="btn" onclick="notify('批量导入用户建设中')">${icon('download', 15)} 批量导入</button>
     <button class="btn btn-primary" onclick="notify('新增用户建设中')">${icon('plus', 15)} 新增用户</button>`);

  const perms = [
    { role: '管理员', ic: 'settings', tone: 'red', perms: ['全局配置与数据治理', '院系 / 组织架构管理', '接口密钥与审计日志', '系统监控与告警处置'] },
    { role: '教师', ic: 'graduation', tone: 'blue', perms: ['考试创建与排考', '监考告警复核 · 证据链处置', '主观题终审与评语修订', '班级 / 学生画像查看'] },
    { role: '学生', ic: 'user', tone: 'green', perms: ['在线答题与断网续考', '成绩查询与申诉复核', '个人能力画像查看', '个性化学习路径'] },
  ].map(p => `<div class="card perm-card"><div class="ec-head"><div class="mi-ic ic-${p.tone}">${icon(p.ic, 20)}</div><b>${p.role}</b></div>
    <ul class="ec-points">${p.perms.map(x => `<li>${icon('check', 13)} ${x}</li>`).join('')}</ul></div>`).join('');

  const rows = MOCK.users.map(u => `<tr>
    <td class="td-strong">${u.name}</td><td>${tag(u.role === '管理员' ? 'high' : u.role === '教师' ? 'ongoing' : 'normal', u.role)}</td>
    <td>${u.dept}</td><td class="mono">${u.account}</td>
    <td>${tag(u.status === '启用' ? 'approved' : 'rejected', u.status)}</td>
    <td class="td-actions"><a class="link" onclick="notify('权限配置建设中')">${icon('lock', 13)} 权限</a ><a class="link" onclick="notify('用户编辑建设中')">${icon('edit', 13)} 编辑</a ></td></tr>`).join('');

  return `<div class="page">${head}<div class="grid grid-3">${perms}</div>
    ${tableWrap(['姓名', '角色', '所属部门 / 班级', '账号', '状态', '操作'], rows)}
    <div class="page-note">${icon('info', 14)} 敏感操作全部留痕，支持按角色配置数据可见范围（最小化原则）。</div>
  </div>`;
}

/* ============================================================
 * 系统中台 —— 数据治理
 * ============================================================ */
function pageData() {
  const head = pageHead('数据治理', '数据源接入、脱敏策略与全生命周期安全');

  const sources = [
    { ic: 'file', t: '考试数据', d: '考试 / 题库 / 试卷 / 考场编排', v: '结构化 · MySQL 集群' },
    { ic: 'edit', t: '答题数据', d: '作答过程 / 暂存 / 交卷事件流', v: '事件流 · Kafka + 对象存储' },
    { ic: 'video', t: '监考音视频', d: '人脸帧 / 行为序列 / 音频片段', v: '本地化 · 加密对象存储' },
    { ic: 'clipboard', t: '评阅结果', d: '评分点命中 / 置信度 / 证据链', v: '结构化 · 不可篡改归档' },
    { ic: 'chart', t: '能力画像', d: '掌握度 / 雷达维度 / 学习路径', v: '图数据库 · Neo4j' },
  ].map(s => `<div class="card source-card"><div class="mi-ic ic-blue">${icon(s.ic, 18)}</div>
    <div><b>${s.t}</b><p>${s.d}</p ><span class="src-meta">${icon('harddrive', 12)} ${s.v}</span></div></div>`).join('');

  const lifecycle = ['采集', '传输', '存储', '使用', '销毁'];
  const secure = `<div class="card"><div class="card-head"><h3>${icon('lock', 16)} 安全合规</h3><span class="card-sub">人脸、声纹等敏感数据本地化处理</span></div>
    <div class="pipeline">${lifecycle.map((l, i) => `
      <div class="pipe-step"><span class="ps-idx">${i + 1}</span><span class="ps-label">${l}阶段</span></div>
      ${i < lifecycle.length - 1 ? `<div class="pipe-arrow">${icon('arrowright', 14)}</div>` : ''}`).join('')}</div>
    <div class="grid grid-2 sec-grid">
      <div class="sec-item">${icon('shield', 15)}<div><b>本地化存储</b><p>敏感数据不出校，公有云场景仅存脱敏特征</p ></div></div>
      <div class="sec-item">${icon('lock', 15)}<div><b>加密传输</b><p>全链路 TLS，监考流独立通道</p ></div></div>
      <div class="sec-item">${icon('filter', 15)}<div><b>最小化采集</b><p>只采集评价必需数据，考生知情同意</p ></div></div>
      <div class="sec-item">${icon('eye', 15)}<div><b>可审计</b><p>遵循《个人信息保护法》，操作全程留痕</p ></div></div>
    </div></div>`;

  const kpis = `<div class="grid grid-4">
    ${kpi('book', '脱敏试卷', '12,400 <em>份</em>', '历年真题入库', 'blue')}
    ${kpi('clipboard', '评分样本', '8.6 <em>万条</em>', '教师标注', 'purple')}
    ${kpi('video', '考试视频', '3,200 <em>小时</em>', '脱敏标注', 'green')}
    ${kpi('database', '知识节点', '52 <em>维</em>', '持续扩充', 'orange')}
  </div>`;

  return `<div class="page">${head}${kpis}<div class="grid grid-3">${sources}</div>${secure}
    <div class="page-note">${icon('info', 14)} 建立采集、传输、存储、销毁全生命周期安全机制，支撑算法训练与跨校共建。</div>
  </div>`;
}

/* ============================================================
 * 系统中台 —— 开放接口
 * ============================================================ */
function pageAPI() {
  const head = pageHead('开放接口', '标准 API / SDK，7 天完成教务系统对接',
    `<button class="btn" onclick="notify('API 文档站点建设中')">${icon('book', 15)} 查看文档</button>
     <button class="btn btn-primary" onclick="notify('密钥申请审批流建设中')">${icon('lock', 15)} 申请密钥</button>`);

  const methodTag = { GET: 'tag-green', POST: 'tag-blue', WS: 'tag-purple', ADP: 'tag-orange' };
  const rows = MOCK.apis.map(a => `<tr>
    <td class="td-strong">${a.name}</td><td><span class="tag ${methodTag[a.method]} mono">${a.method}</span></td>
    <td class="mono td-sub">${a.path}</td><td class="td-sub">${a.desc}</td>
    <td>${tag(a.status === '已发布' ? 'approved' : a.status === '灰度中' ? 'pending' : 'draft', a.status)}</td>
    <td class="td-actions"><a class="link" onclick="notify('在线调试功能建设中')">${icon('play', 13)} 调试</a ><a class="link" onclick="notify('接口文档建设中')">${icon('book', 13)} 文档</a ></td></tr>`).join('');

  const adapterCard = `<div class="card adapter-card">
    <div class="ad-left"><div class="mi-ic ic-orange">${icon('network', 22)}</div>
      <div><b>教务系统适配器</b><p>预置正方 / 强智等主流教务系统适配器：单点登录、名单同步、成绩回写一次打通。</p >
      <div class="ad-metrics"><span>对接周期 ≤ 7 天</span><span>新场景配置 ≤ 3 工作日</span></div></div></div>
    <div class="ad-partners">${['正方教务', '强智教务', '超星学习通', '智慧树'].map(p => `<span class="tool-chip">${p}</span>`).join('')}</div></div>`;

  return `<div class="page">${head}${adapterCard}
    ${tableWrap(['接口名称', '方法', '路径', '说明', '状态', '操作'], rows)}
    <div class="page-note">${icon('info', 14)} 所有接口按 OAuth2 + 签名鉴权；监考事件支持 WebSocket 订阅推送，延迟 ≤ 2 秒。</div>
  </div>`;
}
/* ============================================================
 * 系统中台 —— 监控大屏
 * ============================================================ */
function pageMonitor() {
  const head = pageHead('监控大屏', '全链路：并发、延迟、告警实时可见，出事秒级定位',
    `<button class="btn" onclick="notify('告警规则配置建设中')">${icon('settings', 15)} 告警规则</button>
     <button class="btn btn-primary" onclick="notify('导出运维报告建设中')">${icon('download', 15)} 导出报告</button>`);

  const kpis = `<div class="grid grid-4">
    ${kpi('users', '当前并发', '8,642 <em>人</em>', '今日峰值 9,208', 'blue')}
    ${kpi('zap', '平均响应延迟', '328 <em>ms</em>', 'P99 412ms', 'green')}
    ${kpi('activity', '近 30 天可用率', '99.97%', '目标 ≥99.9%', 'purple')}
    ${kpi('alert', '今日告警', '3 <em>条</em>', '均已处置', 'orange')}
  </div>`;

  const chart = `<div class="card"><div class="card-head"><h3>24h 并发曲线</h3><span class="card-sub">今日 · 实时刷新</span></div>
    <div class="chart-wrap">${concurrencySVG()}</div></div>`;

  const svcRows = MOCK.services.map(s => `<div class="svc-row">
    <span class="svc-status ${s.status === 'ok' ? '' : 'warn'}"></span><span class="svc-name">${s.name}</span>
    <div class="hr-bar slim"><i class="hb-${s.load > 80 ? 'orange' : 'blue'}" style="width:${s.load}%"></i></div>
    <b class="svc-load">${s.load}%</b><span class="tag tag-green">正常</span></div>`).join('');

  const services = `<div class="card"><div class="card-head"><h3>服务状态</h3><span class="card-sub">9 / 9 运行中</span></div>${svcRows}</div>`;

  const events = [
    ['14:02', '机房 B203 网络抖动', '已自动恢复 · 断网续考生效', 'approved'],
    ['11:35', '评阅队列积压 > 5000', '已触发自动扩容，10 分钟清空', 'pending'],
    ['09:00', '开考洪峰', '预案扩容完成，峰值 9,208 并发', 'approved'],
  ].map(e => `<div class="mini-alert lv-${e[3] === 'approved' ? 'low' : 'mid'}">
    <div class="ma-l"><span class="ma-time">${e[0]}</span><b>${e[1]}</b><span class="ma-type">${e[2]}</span></div>
    ${tag(e[3] === 'approved' ? 'low' : 'mid', e[3] === 'approved' ? '已恢复' : '已处置')}</div>`).join('');

  const eventsCard = `<div class="card"><div class="card-head"><h3>${icon('alert', 16)} 今日告警事件</h3><span class="card-sub">3 条</span></div>${events}</div>`;

  return `<div class="page">${head}${kpis}<div class="grid grid-2">${chart}${services}</div>${eventsCard}
    <div class="page-note">${icon('info', 14)} 监考视频流与答题流量分通道走：1 万路摄像头挤不死答题业务。</div>
  </div>`;
}

function concurrencySVG() {
  const pts = [[0, 152], [45, 150], [90, 151], [135, 146], [180, 141], [225, 118], [270, 38], [315, 30], [360, 52], [405, 96], [450, 122], [495, 84], [540, 62], [585, 88], [630, 112], [675, 138]];
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
  const area = `${line} L675,170 L0,170 Z`;
  const gridLines = [30, 70, 110, 150].map(y => `<line x1="0" y1="${y}" x2="675" y2="${y}" class="cg"/>`).join('');
  const peak = pts[7];
  return `<svg viewBox="0 0 690 180" class="con-svg">
    <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(79,107,255,.35)"/><stop offset="100%" stop-color="rgba(79,107,255,0)"/></linearGradient></defs>
    ${gridLines}<path d="${area}" fill="url(#ag)"/><path d="${line}" class="con-line"/>
    <g><circle cx="${peak[0]}" cy="${peak[1]}" r="4" class="con-dot"/>
      <text x="${peak[0]}" y="${peak[1] - 10}" class="con-peak" text-anchor="middle">09:00 开考峰值 9,208</text></g>
    ${['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'].map((t, i) =>
      `<text x="${i * 135}" y="172" class="con-x" text-anchor="middle">${t}</text>`).join('')}
  </svg>`;
}

/* ============================================================
 * 关于 —— 项目说明
 * ============================================================ */
function pageAbout() {
  const head = pageHead('项目说明', '《智慧考试评价系统项目计划书》核心内容摘要');

  const quote = `<div class="card quote-card">
    <div class="qc-mark">"</div>
    <p>我们不是做一套更聪明的监考摄像头，而是给高校搭一个<b>「考试评价操作系统」</b>：考前自动组卷、考中实时管控、考后生成能力画像，让考试从「给人打分」真正转向「帮人成长」。</p >
    <div class="qc-foot"><span>—— 项目一句话定位</span></div></div>`;

  const goals = `<div class="grid grid-2">
    <div class="card goal-card"><div class="mi-ic ic-blue">${icon('shield', 20)}</div>
      <div><b>守住公平底线</b><p>用多模态技术把替考、作弊、违规行为自动识别出来，降低考务人力成本。</p ></div></div>
    <div class="card goal-card"><div class="mi-ic ic-green">${icon('sparkles', 20)}</div>
      <div><b>释放评价价值</b><p>用知识图谱把分数背后的能力拆清楚，给学生可落地的学习提升建议。</p ></div></div>
  </div>`;

  const loopTable = tableWrap(['环节', '现在的问题', '我们想变成什么样'], `
    <tr><td><b>考前</b></td><td class="td-sub">组卷靠经验，题目和能力目标容易脱节</td><td class="td-strong">基于知识图谱和能力目标智能组卷，考什么、怎么考有据可依</td></tr>
    <tr><td><b>考中</b></td><td class="td-sub">监考靠人海，作弊手段花样翻新</td><td class="td-strong">人脸+行为+语音多模态实时识别，异常自动预警并留痕</td></tr>
    <tr><td><b>考后</b></td><td class="td-sub">阅卷主观性强，分数背后的能力看不清</td><td class="td-strong">AI 辅助评阅+教师终审，输出 50 维以上能力诊断报告</td></tr>`);

  const innovations = tableWrap(['市面上常见做法', '我们的做法'], [
    ['做一个防作弊摄像头', '做一个覆盖考前、考中、考后的考试评价操作系统'],
    ['只识别「有没有作弊」', '既识别作弊，又把完整证据链自动留存，做到事后可追溯'],
    ['AI 直接给主观题打分', 'AI 提取得分点和评语，教师最终把关，人机协同更可靠'],
    ['考完输出分数和排名', '考完输出能力画像和学习建议，让考试反哺教学'],
    ['一套系统只服务一种考试', '中台化架构，新场景几天内可配置上线'],
  ].map(r => `<tr><td class="td-sub">${r[0]}</td><td class="td-strong">${r[1]}</td></tr>`).join(''));

  const phases = [
    { t: '第一阶段 · 能力验证', d: '1-3 个月', items: ['活体检测、8 类作弊行为识别算法验证', '主观题 AI 评阅、知识图谱构建', '输出算法测试报告与 Demo'] },
    { t: '第二阶段 · 试点应用', d: '4-9 个月', items: ['1-2 所高校落地试点', '覆盖公共课统考、英语口语测评场景', '与教务系统对接，收集真实反馈迭代'] },
    { t: '第三阶段 · 规模推广', d: '10-18 个月', items: ['可复制的高校解决方案', '拓展区域考试院、职业院校、继续教育', '完善商业化交付体系'] },
  ].map(p => `<div class="phase-card"><div class="pc-head"><b>${p.t}</b><span class="pc-time">${p.d}</span></div>
    <ul class="ec-points">${p.items.map(i => `<li>${icon('check', 13)} ${i}</li>`).join('')}</ul></div>`).join('');

  const kpiRows = MOCK.kpiTable.map(r => `<tr>
    <td>${tag('draft', r[0])}</td><td class="td-strong">${r[1]}</td><td class="mono kpi-target">${r[2]}</td></tr>`).join('');

  const biz = [
    ['building', '高校授权 + SaaS', '按考试场次或考生人数订阅，降低一次性投入'],
    ['graduation', '校企联合共建', '共建智慧考试实验室，真实场景变成算法训练场'],
    ['network', '区域考试院合作', '承接区域统考、技能等级认定，形成标杆案例'],
  ].map(b => `<div class="feature-card"><div class="ft-ic">${icon(b[0], 16)}</div><b>${b[1]}</b><p>${b[2]}</p ></div>`).join('');

  const team = ['算法组：CV · 语音 · NLP · 知识图谱', '工程组：后端 · 前端 · 测试运维', '教育组：教育学 · 考试测量学 · 学科教师', '商务组：高校合作 · 市场推广 · 实施'].map(t => `<span class="tool-chip">${t}</span>`).join('');

  return `<div class="page">${head}${quote}${goals}
    <div class="card"><div class="card-head"><h3>三段式闭环</h3><span class="card-sub">重新设计考试评价</span></div>${loopTable}</div>
    <div class="card"><div class="card-head"><h3>创新亮点</h3><span class="card-sub">五个「不是…而是…」</span></div>${innovations}</div>
    <div class="card"><div class="card-head"><h3>落地路径</h3><span class="card-sub">三阶段 · 18 个月</span></div><div class="grid grid-3">${phases}</div></div>
    <div class="card"><div class="card-head"><h3>核心技术指标对照表</h3><span class="card-sub">验收核心依据 · 全部达标</span></div>
      ${tableWrap(['指标类别', '具体指标', '目标值'], kpiRows)}</div>
    <div class="card"><div class="card-head"><h3>商业模式与团队</h3><span class="card-sub">校企协同 · 共建共享</span></div>
      <div class="feature-grid">${biz}</div><div class="chips-wrap" style="margin-top:14px">${team}</div></div>
    <div class="about-footer">${icon('graduation', 14)} 河南工业大学 · 智慧教育创新团队 · 2026 年 9 月</div>
  </div>`;
}

/* ============================================================ SMART
 * 学生 —— 我的考试
 * ============================================================ */
function pageMyExams() {
  const e = MOCK.myExams;
  const head = pageHead('我的考试', '进行中、待开考与历史成绩',
    `<button class="btn" onclick="notify('考试日历订阅建设中')">${icon('calendar', 15)} 订阅日历</button>`);

  const ongoing = `<div class="card ongoing-exam">
    <div class="oe-left"><span class="oe-badge">${icon('clock', 13)} 考试进行中</span>
      <h3>${e.ongoing.name}</h3>
      <div class="oe-meta"><span>剩余 <b class="oe-timer">${e.ongoing.time}</b></span><span>已作答 <b>${e.ongoing.progress}%</b></span></div>
      <div class="hr-bar"><i class="hb-blue" style="width:${e.ongoing.progress}%"></i></div></div>
    <button class="btn btn-primary btn-lg" onclick="notify('进入考试 · 在线答题功能建设中')">${icon('play', 16)} 进入考试</button></div>`;

  const sched = `<div class="card"><div class="card-head"><h3>待开考</h3><span class="card-sub">${e.scheduled.length} 场</span></div>
    <div class="sched-list">${e.scheduled.map(s => `
      <div class="sched-item"><div class="si-ic">${icon('calendar', 18)}</div>
        <div class="si-body"><b>${s.name}</b><span>${s.time} · ${s.scene}</span></div>
        <button class="btn btn-sm" onclick="notify('设备检测 · 功能建设中')">设备检测</button></div>`).join('')}</div></div>`;

  const finRows = e.finished.map(f => `<tr>
    <td class="td-strong">${f.name}</td><td class="td-sub">${f.time}</td><td class="score-hl"><b>${f.total}</b></td><td>${f.rank}</td>
    <td class="td-actions"><a class="link" onclick="go('portrait')">${icon('user', 13)} 能力画像</a ><a class="link" onclick="notify('答卷回看建设中')">${icon('eye', 13)} 答卷</a ></td></tr>`).join('');

  return `<div class="page">${head}${ongoing}${sched}
    <div class="card"><div class="card-head"><h3>历史成绩</h3></div>
      ${tableWrap(['考试', '时间', '总分', '排名', '操作'], finRows)}</div>
    <div class="page-note">${icon('info', 14)} 断网续考：答案本地暂存 + 每 30 秒心跳自动保存，断网 5 分钟内重连答案不丢失。</div>
  </div>`;
}