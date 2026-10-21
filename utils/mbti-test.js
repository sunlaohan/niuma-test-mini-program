const LIKERT_OPTIONS = ['非常符合', '比较符合', '中立', '比较不符合', '非常不符合']

// 每个维度 5 题；direction 表示该题高分时偏向的字母。题目顺序刻意交叉四个维度。
const MBTI_QUESTIONS = [
  { statement: '与人交流、交换想法后，我通常会觉得更有精神。', direction: 'E' },
  { statement: '面对新问题时，我会先留意已经发生的事实和具体细节。', direction: 'S' },
  { statement: '做决定时，我会优先确认它是否合乎逻辑与标准。', direction: 'T' },
  { statement: '日程有明确安排、事情有结论时，我会更安心。', direction: 'J' },
  { statement: '长时间多人社交后，我通常需要独处来恢复状态。', direction: 'I' },
  { statement: '我很容易联想到事情背后的联系、意义或未来可能。', direction: 'N' },
  { statement: '发生分歧时，我会在意彼此的感受是否被好好照顾。', direction: 'F' },
  { statement: '比起尽早定下唯一计划，我更喜欢保留调整的空间。', direction: 'P' },
  { statement: '有开心或烦心的事时，我第一反应往往是找人分享。', direction: 'E' },
  { statement: '我更信任经过验证的经验，而不是尚未证实的设想。', direction: 'S' },
  { statement: '讨论问题时，我倾向先把问题分析清楚，再处理情绪。', direction: 'T' },
  { statement: '面对截止日期，我通常愿意尽早完成并留出余量。', direction: 'J' },
  { statement: '重要决定前，我习惯先在心里梳理清楚，再和别人沟通。', direction: 'I' },
  { statement: '比起现成的做法，我更容易被新思路和潜在可能吸引。', direction: 'N' },
  { statement: '评判一件事时，我会在意它是否会伤害到相关的人。', direction: 'F' },
  { statement: '计划临时改变时，我通常能顺着变化重新探索。', direction: 'P' },
  { statement: '我更喜欢在互动中逐渐形成想法，而不是全都想好再开口。', direction: 'E' },
  { statement: '描述一件事时，我通常会先从具体发生了什么说起。', direction: 'S' },
  { statement: '即使有人不高兴，只要规则一致、理由充分，我也能接受这个决定。', direction: 'T' },
  { statement: '生活中留一些未确定的选择，会让我感觉更自在。', direction: 'P' }
]

const TYPE_NAMES = {
  INTJ: '战略规划者', INTP: '好奇分析者', ENTJ: '目标推动者', ENTP: '灵感探索者',
  INFJ: '洞察理想者', INFP: '价值守护者', ENFJ: '共情引导者', ENFP: '热情可能者',
  ISTJ: '可靠执行者', ISFJ: '细致守护者', ESTJ: '秩序推进者', ESFJ: '温暖协调者',
  ISTP: '冷静实干者', ISFP: '自在体验者', ESTP: '行动体验者', ESFP: '活力感染者'
}

const TYPE_INSIGHTS = {
  INTJ: '你喜欢先建立全局模型，再用长期视角安排下一步；当目标清楚时，往往能稳定推进复杂问题。',
  INTP: '你享受拆解概念、追问原理和保持思考自由；有足够空间时，常能给出新鲜而严谨的视角。',
  ENTJ: '你会自然寻找目标、资源和推进路径；当环境允许你做决定时，行动与组织能力容易被激活。',
  ENTP: '你容易从变化和观点碰撞中获得灵感；探索新可能时表现活跃，也需要把好点子落到下一步。',
  INFJ: '你常把细节放进更长的意义里理解，也在意人与人之间真正的共鸣和一致性。',
  INFP: '你重视内在价值与真实感受；在认可的事情上，往往愿意投入细腻的理解和理想主义热情。',
  ENFJ: '你会留意群体里的氛围和他人的成长需要；在共同目标中，常能成为温和的连接者。',
  ENFP: '你对新鲜的人、想法和可能性有天然好奇；被兴趣点燃时，能带来积极而有感染力的能量。',
  ISTJ: '你偏好可靠、清楚和可验证的做法；责任边界明确时，往往能持续完成别人依赖的部分。',
  ISFJ: '你会留意日常中的需要和细节；在熟悉关系里，常以安静、稳定的方式让人感到被照顾。',
  ESTJ: '你重视秩序、责任和有效推进；任务目标明确时，通常能迅速建立规则并推动执行。',
  ESFJ: '你在意互动是否顺畅、每个人是否被照顾；共同生活或协作中，常能营造稳定的归属感。',
  ISTP: '你习惯冷静观察、动手验证和随机应变；面对具体问题时，往往愿意先找到能用的解决办法。',
  ISFP: '你看重当下真实的感受与个人空间；在舒服自然的环境里，容易展现温和、审美和行动力。',
  ESTP: '你对现场变化反应快，也喜欢通过行动获得直接反馈；机会出现时，常敢于先尝试。',
  ESFP: '你会把注意力放在当下体验和人际互动上；在有回应、有活力的环境里，容易带来快乐与热度。'
}

const PREFERENCE_COPY = {
  E: '你会在互动、表达和行动中获得能量。', I: '你更常在独处、思考和内在空间中恢复能量。',
  S: '你重视事实、细节和已经被验证的经验。', N: '你会自然关注联系、可能性与未来方向。',
  T: '你习惯用逻辑、原则和效果来判断问题。', F: '你会把人的感受、价值与关系纳入判断。',
  J: '清晰的计划和确定性会让你更安心。', P: '弹性、探索和保留选择会让你更自在。'
}

function getResult(scores) {
  const type = `${scores.E >= scores.I ? 'E' : 'I'}${scores.S >= scores.N ? 'S' : 'N'}${scores.T >= scores.F ? 'T' : 'F'}${scores.J >= scores.P ? 'J' : 'P'}`
  const letters = type.split('')
  return {
    type,
    name: TYPE_NAMES[type],
    summary: `${type} 的你，通常会把${letters[0] === 'E' ? '外部互动' : '内在思考'}、${letters[1] === 'S' ? '现实细节' : '未来可能'}、${letters[2] === 'T' ? '逻辑判断' : '价值感受'}与${letters[3] === 'J' ? '明确秩序' : '灵活空间'}组合成自己的做事方式。`,
    insight: TYPE_INSIGHTS[type],
    preferences: letters.map(letter => PREFERENCE_COPY[letter]),
    strength: `${TYPE_NAMES[type]}的优势，往往是能以自己舒服的节奏持续投入，并在擅长的场景里发挥稳定影响力。`,
    growth: '类型不是限制，也没有更好的类型。把它当作观察自己偏好的一个入口：在压力、冲突或重要选择里，多留意自己真正需要什么。'
  }
}

function getDimensionScores(scores) {
  return [
    { label: '能量来源', left: '外向互动', leftScore: scores.E, right: '独处思考', rightScore: scores.I },
    { label: '信息偏好', left: '现实细节', leftScore: scores.S, right: '未来可能', rightScore: scores.N },
    { label: '决策方式', left: '逻辑分析', leftScore: scores.T, right: '感受价值', rightScore: scores.F },
    { label: '生活节奏', left: '计划确定', leftScore: scores.J, right: '灵活探索', rightScore: scores.P }
  ].map(item => ({ ...item, tendency: item.leftScore >= item.rightScore ? item.left : item.right }))
}

module.exports = { MBTI_QUESTIONS, LIKERT_OPTIONS, getResult, getDimensionScores }
