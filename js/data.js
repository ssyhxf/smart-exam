/* ============================================================
 * 智慧考试评价系统 SmartExam OS - 演示数据（框架占位，均为静态 Mock）
 * ============================================================ */
const MOCK = {
  /* ---------- 考试列表 ---------- */
  exams: [
    { id: 'EX-2026-005', name: '大学物理实验实操考核', type: '技能实操', scene: '实操考评', time: '2026-09-26 08:30 ~ 12:00', students: 356, status: 'ongoing', statusText: '进行中' },
    { id: 'EX-2026-004', name: 'Java 程序设计阶段测验', type: '专业测评', scene: '在线考试', time: '2026-09-20 19:00 ~ 20:30', students: 287, status: 'finished', statusText: '已结束' },
    { id: 'EX-2026-006', name: '高等数学（下）期中统考', type: '公共课统考', scene: '线下机房', time: '2026-10-12 09:00 ~ 11:00', students: 1286, status: 'scheduled', statusText: '待开考' },
    { id: 'EX-2026-007', name: '大学英语四级模拟考试', type: '公共课统考', scene: '在线考试', time: '2026-10-18 14:00 ~ 16:20', students: 2043, status: 'scheduled', statusText: '待开考' },
    { id: 'EX-2026-008', name: '数据结构与算法期末考试', type: '专业测评', scene: '混合式', time: '2026-11-02 09:00 ~ 11:00', students: 412, status: 'draft', statusText: '草稿' },
  ],

  /* ---------- 题库 ---------- */
  bank: {
    stats: [
      { type: '单选题', count: 3214 }, { type: '多选题', count: 1102 }, { type: '判断题', count: 865 },
      { type: '填空题', count: 743 }, { type: '简答/论述', count: 1528 }, { type: '口语题', count: 216 }, { type: '实操视频题', count: 58 },
    ],
    questions: [
      { id: 'Q-10241', stem: '设函数 f(x) 在 x=0 处可导，讨论极限…', type: '单选题', kp: '导数与微分', diff: '中等', used: 46 },
      { id: 'Q-10287', stem: '请推导二叉树前序遍历的递归与非递归实现…', type: '简答/论述', kp: '树与二叉树', diff: '较难', used: 23 },
      { id: 'Q-10312', stem: 'Reading: Describe the chart and give your opinion.（口语）', type: '口语题', kp: '英语-图表描述', diff: '中等', used: 12 },
      { id: 'Q-10365', stem: '使用分光计测量三棱镜折射率的规范操作流程…', type: '实操视频题', kp: '物理实验-光学', diff: '较难', used: 8 },
      { id: 'Q-10388', stem: 'HashMap 与 TreeMap 的底层实现差异及适用场景…', type: '简答/论述', kp: '集合框架', diff: '中等', used: 31 },
      { id: 'Q-10401', stem: '齐次线性方程组有非零解的充要条件是…', type: '填空题', kp: '线性代数', diff: '简单', used: 55 },
    ],
  },

  /* ---------- 排考 ---------- */
  arrange: [
    { room: '机房 A101', exam: '高等数学（下）期中统考', time: '10-12 09:00', teachers: '陈思远 / 刘慧敏', students: 120, seats: '已编排', },
    { room: '机房 A102', exam: '高等数学（下）期中统考', time: '10-12 09:00', teachers: '赵国庆', students: 116, seats: '已编排' },
    { room: '机房 B203', exam: '数据结构与算法期末考试', time: '11-02 09:00', teachers: '待分配', students: 102, seats: '待编排' },
    { room: '线上考场-001', exam: '大学英语四级模拟考试', time: '10-18 14:00', teachers: '系统自动巡考 + 值班教师 4 人', students: 2043, seats: '—' },
    { room: '实验楼 C301', exam: '大学物理实验实操考核', time: '09-26 08:30', teachers: '孙立 / 周敏', students: 64, seats: '已编排' },
  ],

  /* ---------- 报名审核 ---------- */
  enroll: [
    { name: '刘子豪', sid: '2023213056', cls: '计算机 2301', exam: '大学英语四级模拟考试', applyTime: '09-21 10:12', status: 'pending' },
    { name: '王雨桐', sid: '2023213112', cls: '计算机 2303', exam: '高等数学（下）期中统考', applyTime: '09-22 08:40', status: 'approved' },
    { name: '赵子豪', sid: '2023213148', cls: '软件 2302', exam: '大学英语四级模拟考试', applyTime: '09-22 14:05', status: 'pending' },
    { name: '孙嘉怡', sid: '2023213160', cls: '计算机 2302', exam: '数据结构与算法期末考试', applyTime: '09-23 09:18', status: 'rejected' },
    { name: '周子墨', sid: '2023213175', cls: '网络 2301', exam: '高等数学（下）期中统考', applyTime: '09-23 16:44', status: 'pending' },
  ],

  /* ---------- 监考大屏：考生画面 ---------- */
  proctorCams: [
    { seat: 'A101-017', name: '刘子豪', risk: 'high', note: '频繁转头' },
    { seat: 'A101-018', name: '王雨桐', risk: 'high', note: '多人入镜' },
    { seat: 'A101-019', name: '张明远', risk: 'low', note: '正常' },
    { seat: 'A101-020', name: '刘思颖', risk: 'normal', note: '正常' },
    { seat: 'A101-021', name: '陈嘉豪', risk: 'normal', note: '正常' },
    { seat: 'A101-022', name: '赵子豪', risk: 'mid', note: '低头演算' },
    { seat: 'A101-023', name: '孙嘉怡', risk: 'normal', note: '正常' },
    { seat: 'A101-024', name: '周子墨', risk: 'normal', note: '正常' },
    { seat: 'A101-025', name: '吴雅婷', risk: 'normal', note: '正常' },
    { seat: 'A101-026', name: '郑浩然', risk: 'low', note: '正常' },
    { seat: 'A101-027', name: '冯若彤', risk: 'normal', note: '正常' },
    { seat: 'A101-028', name: '褚天佑', risk: 'normal', note: '正常' },
  ],
  /* ---------- 实时告警流 ---------- */
  alerts: [
    { time: '10:42:18', exam: '大学物理实验实操考核', student: '刘子豪（2023213056）', type: '频繁转头', modality: '视觉姿态', level: 'mid', status: '待复核' },
    { time: '10:38:05', exam: '大学物理实验实操考核', student: '王雨桐（2023213112）', type: '多人入镜', modality: '人脸核验', level: 'high', status: '已确认' },
    { time: '10:31:52', exam: '大学物理实验实操考核', student: '赵子豪（2023213148）', type: '低声交谈', modality: '语音声学', level: 'mid', status: '待复核' },
    { time: '10:24:37', exam: '大学物理实验实操考核', student: '周子墨（2023213175）', type: '视线异常', modality: '视觉姿态', level: 'low', status: '已排除' },
    { time: '10:17:09', exam: '大学物理实验实操考核', student: '吴雅婷（2023213186）', type: '离座超时', modality: '视觉姿态', level: 'mid', status: '已确认' },
    { time: '10:05:41', exam: '大学物理实验实操考核', student: '郑浩然（2023213194）', type: '疑似电子设备', modality: '视觉姿态', level: 'high', status: '待复核' },
    { time: '09:58:26', exam: '大学物理实验实操考核', student: '冯若彤（2023213201）', type: '身份核验通过', modality: '人脸核验', level: 'low', status: '正常' },
  ],

  /* ---------- 证据链 ---------- */
  evidence: [
    { id: 'EV-20260926-0187', time: '10:38:05', student: '王雨桐', type: '多人入镜', level: 'high', pack: '截图 6 张 / 音频 3 段 / 行为序列 1 份', status: '待复核' },
    { id: 'EV-20260926-0186', time: '10:17:09', student: '郑浩然', type: '疑似电子设备', level: 'high', pack: '截图 8 张 / 行为序列 1 份', status: '待复核' },
    { id: 'EV-20260926-0185', time: '10:42:18', student: '刘子豪', type: '频繁转头', level: 'mid', pack: '截图 4 张 / 音频 2 段', status: '待复核' },
    { id: 'EV-20260926-0184', time: '10:31:52', student: '赵子豪', type: '低声交谈', level: 'mid', pack: '音频 5 段 / 频谱图 1 份', status: '待复核' },
    { id: 'EV-20260926-0183', time: '10:24:37', student: '周子墨', type: '视线异常', level: 'low', pack: '截图 2 张 / 行为序列 1 份', status: '已排除' },
    { id: 'EV-20260926-0182', time: '10:17:09', student: '吴雅婷', type: '离座超时', level: 'mid', pack: '截图 3 张 / 行为序列 1 份', status: '已确认' },
  ],

  /* ---------- 智能评阅 ---------- */
  grading: {
    queue: [
      { paper: 'P-2026-004-0231', question: '简答：HashMap 与 TreeMap 的区别及适用场景', type: '文本主观题', ai: '18 / 20', conf: 0.94, flow: '高置信 · 自动评分', status: '已回写' },
      { paper: 'P-2026-004-0232', question: '口语：Describe an unforgettable experience', type: '口语题', ai: '—', conf: 0.91, flow: '高置信 · 自动评分', status: 'AI 评阅中' },
      { paper: 'P-2026-004-0237', question: '简答：进程与线程的区别', type: '文本主观题', ai: '12 / 20', conf: 0.78, flow: '中置信 · 模型二次复核', status: '复核中' },
      { paper: 'P-2026-004-0241', question: '实操：使用分光计测量三棱镜折射率', type: '实操视频题', ai: '—', conf: 0.62, flow: '低置信 · 转人工终审', status: '待教师复核' },
      { paper: 'P-2026-004-0244', question: '论述：结合案例谈谈对算法时间复杂度的理解', type: '文本主观题', ai: '15 / 20', conf: 0.83, flow: '中置信 · 模型二次复核', status: '复核中' },
    ],
    evidenceSample: {
      question: '简答：HashMap 与 TreeMap 的区别及适用场景（20 分）',
      score: '18 / 20',
      hits: ['底层结构：红黑树 vs 数组+链表 ✔', '时间复杂度对比 ✔', '线程安全性说明 ✔'],
      deduct: '未提及迭代顺序保证的底层原因（-2 分）',
      evidence: '关键作答片段："TreeMap 基于红黑树实现，查找为 O(log n)…"',
      conf: '0.94',
    },
  },

  /* ---------- 成绩 ---------- */
  scores: {
    examName: 'Java 程序设计阶段测验',
    rows: [
      { sid: '2023213048', name: '张明远', cls: '计算机 2301', obj: 42, subj: 38, total: 80, rank: 12 },
      { sid: '2023213049', name: '李思远', cls: '计算机 2301', obj: 45, subj: 44, total: 89, rank: 3 },
      { sid: '2023213056', name: '刘子豪', cls: '计算机 2301', obj: 38, subj: 33, total: 71, rank: 38 },
      { sid: '2023213067', name: '王一诺', cls: '计算机 2302', obj: 40, subj: 41, total: 81, rank: 9 },
      { sid: '2023213088', name: '陈嘉豪', cls: '计算机 2302', obj: 36, subj: 36, total: 72, rank: 34 },
    ],
    stats: { avg: 76.4, max: 98, min: 23, passRate: 88.2 },
  },

  /* ---------- 能力画像 ---------- */
  portrait: {
    name: '张明远', sid: '2023213048', cls: '计算机 2301',
    matchRate: 88.6, dims: 52,
    radar: [
      { axis: '理论知识', v: 82 }, { axis: '实践操作', v: 65 }, { axis: '逻辑推理', v: 74 },
      { axis: '问题解决', v: 58 }, { axis: '专业技能', v: 70 },
    ],
    mastery: [
      { kp: '面向对象基础', v: 92 }, { kp: '集合框架', v: 86 }, { kp: '异常处理', v: 78 },
      { kp: '多线程', v: 64 }, { kp: 'IO 流', v: 61 }, { kp: 'JVM 内存模型', v: 47 },
      { kp: '泛型与反射', v: 42 }, { kp: '网络编程', v: 35 },
    ],
    weakness: [
      { kp: '网络编程', desc: 'TCP/UDP 编程模型混淆，三次握手流程描述不完整', rate: 35 },
      { kp: '泛型与反射', desc: '通配符边界理解偏差，反射应用场景不清晰', rate: 42 },
      { kp: 'JVM 内存模型', desc: '堆栈分区易混淆，垃圾回收机制掌握薄弱', rate: 47 },
    ],
    suggestions: [
      '优先补强「网络编程」：推荐 3 个 TCP 实战案例 + Socket 编程专项练习（预计 2.5 小时）',
      '「泛型与反射」建议结合源码阅读巩固，已生成 12 道针对性练习题',
      '「JVM 内存模型」可先完成微课《一文看懂 JVM 分区》，再做知识图谱路径测验',
    ],
    comment: '张明远同学对面向对象与集合框架掌握扎实，逻辑推理能力良好；但网络编程与 JVM 底层原理存在明显短板，建议按推送路径集中补强后参加复测，预计可提升综合评级一档。',
  },
 /* ---------- 用户 ---------- */
  users: [
    { name: '王立群', role: '管理员', dept: '教务处', account: 'wanglq', status: '启用' },
    { name: '陈思远', role: '教师', dept: '计算机学院', account: 'chensy', status: '启用' },
    { name: '刘慧敏', role: '教师', dept: '数学学院', account: 'liuhm', status: '启用' },
    { name: '孙立', role: '教师', dept: '物理学院', account: 'sunli', status: '启用' },
    { name: '张明远', role: '学生', dept: '计算机 2301', account: '2023213048', status: '启用' },
    { name: '刘子豪', role: '学生', dept: '计算机 2301', account: '2023213056', status: '启用' },
    { name: '周子墨', role: '学生', dept: '网络 2301', account: '2023213175', status: '禁用' },
  ],

  /* ---------- 服务状态 ---------- */
  services: [
    { name: 'API 网关（考试业务）', load: 62, status: 'ok' },
    { name: '在线答题服务', load: 71, status: 'ok' },
    { name: '监考视频流通道', load: 48, status: 'ok' },
    { name: '多模态推理集群（GPU）', load: 83, status: 'ok' },
    { name: '智能评阅引擎', load: 57, status: 'ok' },
    { name: '能力诊断引擎', load: 34, status: 'ok' },
    { name: '消息队列 Kafka', load: 44, status: 'ok' },
    { name: 'Redis 分布式缓存', load: 66, status: 'ok' },
    { name: 'MySQL 集群', load: 39, status: 'ok' },
  ],

  /* ---------- 开放接口 ---------- */
  apis: [
    { name: '创建考试', method: 'POST', path: '/api/v1/exams', desc: '创建考试并配置组卷策略', status: '已发布' },
    { name: '题库同步', method: 'POST', path: '/api/v1/questions/batch', desc: '批量导入题目与评分点', status: '已发布' },
    { name: '交卷事件', method: 'POST', path: '/api/v1/papers/submit', desc: '触发评阅流水线（异步）', status: '已发布' },
    { name: '监考事件订阅', method: 'WS', path: '/ws/v1/proctor/events', desc: '实时推送风险告警（WebSocket）', status: '已发布' },
    { name: '成绩查询', method: 'GET', path: '/api/v1/scores', desc: '按考试/考生查询成绩明细', status: '已发布' },
    { name: '能力画像查询', method: 'GET', path: '/api/v1/portraits/{studentId}', desc: '获取 50+ 维能力诊断报告', status: '已发布' },
    { name: '教务系统适配器（正方）', method: 'ADP', path: '/adapter/zhengfang', desc: '单点登录 / 名单同步 / 成绩回写', status: '灰度中' },
    { name: '教务系统适配器（强智）', method: 'ADP', path: '/adapter/qiangzhi', desc: '单点登录 / 名单同步 / 成绩回写', status: '开发中' },
  ],

  /* ---------- 附录：核心技术指标 ---------- */
  kpiTable: [
    ['身份核验', '活体身份核验准确率', '≥ 99%'],
    ['身份核验', '单次核验响应时间', '≤ 1 秒'],
    ['智能监考', '≥ 8 类作弊行为综合识别准确率', '≥ 95%'],
    ['智能监考', '正常场景误报率', '≤ 3%'],
    ['智能监考', '异常行为预警响应延迟', '≤ 2 秒'],
    ['智能监考', '考务事件可追溯率', '100%'],
    ['智能评阅', '客观题自动判卷准确率', '100%'],
    ['智能评阅', '文本主观题与资深教师评分一致性', '≥ 90%'],
    ['智能评阅', '口语类综合评测准确率', '≥ 92%'],
    ['能力诊断', '能力画像匹配率', '≥ 88%'],
    ['能力诊断', '细分诊断维度', '≥ 50 项'],
    ['平台性能', '单场次在线并发人数', '≥ 10000 人'],
    ['平台性能', '系统平均响应延迟', '≤ 500ms'],
    ['平台性能', '全年系统可用率', '≥ 99.9%'],
    ['对接能力', '与主流教务/学习平台适配周期', '≤ 7 天'],
    ['对接能力', '新场景配置周期', '≤ 3 个工作日'],
  ],

  /* ---------- 学生：我的考试 ---------- */
  myExams: {
    ongoing: { name: '大学物理实验实操考核', time: '剩余 01:12:36', progress: 62 },
    scheduled: [
      { name: '高等数学（下）期中统考', time: '2026-10-12 09:00', scene: '线下机房 · 机房 A101-017' },
      { name: '大学英语四级模拟考试', time: '2026-10-18 14:00', scene: '在线考试 · 需设备检测' },
    ],
    finished: [
      { name: 'Java 程序设计阶段测验', time: '2026-09-20', total: 80, rank: '12 / 287' },
      { name: '数据结构期中测验', time: '2026-04-18', total: 74, rank: '41 / 302' },
    ],
  },
};

/* ---------- 登录角色 ---------- */
const ROLES = {
  admin: { label: '管理员', desc: '教务处 · 全局管理', icon: 'settings' },
  teacher: { label: '教师', desc: '监考 / 评阅 / 诊断', icon: 'graduation' },
  student: { label: '学生', desc: '考试 / 成绩 / 画像', icon: 'user' },
};