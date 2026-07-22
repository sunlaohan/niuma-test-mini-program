const MBTI_TYPES = [
  { value: 'INTJ', label: 'INTJ · 建筑师' },
  { value: 'INTP', label: 'INTP · 逻辑学家' },
  { value: 'ENTJ', label: 'ENTJ · 指挥官' },
  { value: 'ENTP', label: 'ENTP · 辩论家' },
  { value: 'INFJ', label: 'INFJ · 提倡者' },
  { value: 'INFP', label: 'INFP · 调停者' },
  { value: 'ENFJ', label: 'ENFJ · 主人公' },
  { value: 'ENFP', label: 'ENFP · 竞选者' },
  { value: 'ISTJ', label: 'ISTJ · 物流师' },
  { value: 'ISFJ', label: 'ISFJ · 守卫者' },
  { value: 'ESTJ', label: 'ESTJ · 总经理' },
  { value: 'ESFJ', label: 'ESFJ · 执政官' },
  { value: 'ISTP', label: 'ISTP · 鉴赏家' },
  { value: 'ISFP', label: 'ISFP · 探险家' },
  { value: 'ESTP', label: 'ESTP · 企业家' },
  { value: 'ESFP', label: 'ESFP · 表演者' },
  { value: 'UNKNOWN', label: '不知道' }
]

const MBTI_PROFILES = {
  INTJ: {
    tendency: '你习惯先理解关系的运行规律，再决定如何投入，不太依赖频繁表达来确认感情。',
    strength: '理性规划、长期承诺和解决复杂问题',
    risk: '把感受当成待解决的问题，或在失望时迅速抽离',
    action: '每周主动说出一次感受与欣赏，先共情，再讨论解决方案'
  },
  INTP: {
    tendency: '你重视思想交流和个人空间，常通过理解对方、提供新视角来表达在意。',
    strength: '开放思考、尊重差异和冷静分析',
    risk: '回避高浓度情绪，或因想得太多而迟迟不表达',
    action: '发生分歧时先用一句话确认对方的感受，再说明自己的真实需要'
  },
  ENTJ: {
    tendency: '你倾向主动推动关系向前，也习惯快速定位问题、制定共同目标。',
    strength: '担当、行动力和共同成长意识',
    risk: '把亲密关系变成项目管理，无意中压过对方的节奏',
    action: '重要对话中少给一个方案，多问一句“你希望我怎样支持你”'
  },
  ENTP: {
    tendency: '你享受新鲜感和高质量对话，常用幽默、探索与观点碰撞保持关系活力。',
    strength: '创造力、适应变化和化解僵局',
    risk: '把严肃感受辩成观点，或对稳定维护缺少耐心',
    action: '把一个有趣想法落实成固定的小约定，并在争论中避免为了赢而继续追问'
  },
  INFJ: {
    tendency: '你对关系中的情绪变化十分敏锐，期待深度理解、价值共鸣和稳定回应。',
    strength: '洞察、共情和长期投入',
    risk: '积累失望却不说，最后以突然疏远保护自己',
    action: '在不满还只有三分时就具体表达，不等对方猜中你的全部心意'
  },
  INFP: {
    tendency: '你珍视真诚、浪漫和内在价值的一致，希望关系能容纳彼此最真实的部分。',
    strength: '温柔理解、忠于感受和接纳个体差异',
    risk: '理想化关系，受伤后独自消化并回避现实冲突',
    action: '把抽象期待改成一个可观察的小请求，并给对方回应和调整的时间'
  },
  ENFJ: {
    tendency: '你很自然地关注伴侣的需要，也愿意主动经营氛围、协调关系和规划未来。',
    strength: '情感支持、沟通推动和关系责任感',
    risk: '过度照顾后期待同等回报，忽略自己的边界',
    action: '帮助对方前先确认自己是否愿意，并直接说出希望得到的回应'
  },
  ENFP: {
    tendency: '你以热情、分享和共同体验靠近伴侣，重视被理解以及关系中的可能性。',
    strength: '情绪感染力、表达爱意和创造共同记忆',
    risk: '情绪来得快而强，或在日常维护中缺少稳定性',
    action: '保留热情表达，同时建立一个能长期坚持的沟通或陪伴习惯'
  },
  ISTJ: {
    tendency: '你更常用可靠、守约和承担责任表达感情，相比甜言蜜语更相信长期行动。',
    strength: '稳定、忠诚和现实责任感',
    risk: '坚持既有规则，低估情绪表达和变化需求的重要性',
    action: '除了把事情做好，也明确告诉对方你为什么愿意为这段关系付出'
  },
  ISFJ: {
    tendency: '你会记住细节并默默照顾伴侣，安全感往往来自稳定日常与彼此需要。',
    strength: '体贴、耐心和持续照料',
    risk: '害怕冲突而压下委屈，付出过多后感到不被珍惜',
    action: '每次答应照顾别人前先检查自己的余量，并练习温和而明确地拒绝'
  },
  ESTJ: {
    tendency: '你重视明确承诺、现实秩序和共同承担，希望关系中的问题能及时被处理。',
    strength: '务实推进、兑现承诺和建立稳定生活',
    risk: '表达过于直接，容易用效率标准评判伴侣的感受',
    action: '提出改进前先肯定对方的出发点，并为情绪留出不追求效率的空间'
  },
  ESFJ: {
    tendency: '你重视陪伴、回应和关系仪式感，常通过照顾日常与积极互动确认连接。',
    strength: '热心投入、察觉需要和营造归属感',
    risk: '过度依赖对方反馈，或为了和谐回避真正分歧',
    action: '区分“对方此刻没回应”和“不在乎我”，并坦诚讨论不同意见'
  },
  ISTP: {
    tendency: '你尊重独立空间，遇到问题更愿意用实际行动处理，不喜欢被情绪推着表态。',
    strength: '冷静、灵活和关键时刻解决问题',
    risk: '沉默过久让伴侣误以为你不在意，或突然退出冲突',
    action: '需要独处时说明何时回来继续沟通，并用简短语言同步自己的状态'
  },
  ISFP: {
    tendency: '你看重自然真实的相处感受，通常以温柔陪伴和细腻行动表达爱。',
    strength: '尊重感受、包容差异和享受当下',
    risk: '不愿破坏气氛而回避规划或矛盾，重要需求容易被藏起来',
    action: '在轻松时刻主动谈一次未来期待，把真实想法说得具体一些'
  },
  ESTP: {
    tendency: '你通过行动、体验和直接互动建立亲密，擅长让关系保持活力并快速应变。',
    strength: '坦率、行动力和带伴侣走出困局',
    risk: '追求即时感受，低估承诺维护和情绪余波',
    action: '冲突后不要只用行动翻篇，留十分钟确认双方是否真的恢复连接'
  },
  ESFP: {
    tendency: '你热情直接地表达喜欢，重视共同体验、即时回应和轻松有爱的氛围。',
    strength: '温暖表达、陪伴投入和创造快乐',
    risk: '害怕沉重话题，或因当下情绪做出过快判断',
    action: '情绪强烈时先暂停决定，约定一个明确时间回来完成严肃对话'
  },
  UNKNOWN: {
    tendency: '你暂时不确定自己的 MBTI，这并不影响理解关系；比起类型标签，真实互动和当下感受更值得关注。',
    strength: '观察具体行为、保持开放和根据实际情况调整',
    risk: '借助模糊的性格印象解释矛盾，却忽略双方真正说过和做过的事',
    action: '记录一次让你感到被理解和一次感到不舒服的互动，再把具体感受与需要告诉伴侣'
  }
}

const LEVEL_CONTENT = {
  healthy: {
    summary: '整体分数较高，说明你们之间已经有比较稳定的信任、沟通和互相照顾。',
    focus: '接下来不需要大改，而是把已经有效的相处方式继续保留下来，同时别忽略偶尔冒出来的小委屈。'
  },
  watch: {
    summary: '当前关系不是没有基础，只是有些需求还没有被稳定看见，久了容易变成失落或不满。',
    focus: '接下来先别急着解决全部问题，先抓住最影响你们相处体验的一项，用小改变让关系慢慢松动。'
  },
  risk: {
    summary: '当前分数提示这段关系正在让人明显消耗，可能已经有反复争执、冷处理、失望累积或信任下降。',
    focus: '接下来重点不是继续硬扛，而是看清你们总是卡在哪个循环里，并确认双方是否真的愿意一起改变。'
  },
  critical: {
    summary: '当前分数反映出较高的关系风险，你的感受值得被认真对待，安全、边界和现实支持要放在修复关系之前。',
    focus: '接下来重点不是维持表面完整，而是先确认自己有没有被尊重、有没有安全感、有没有可靠的人可以支持你。'
  }
}

const DIMENSION_CONTENT = {
  communication: {
    issue: '沟通得分偏低，通常不是单纯“不会聊天”，更像是心里有话却说不顺，或者一开口就容易变成解释、指责和防御。',
    action: '先约定一次只谈一件事的对话：用“我感到……我需要……”表达，不急着证明谁对谁错。'
  },
  trust: {
    issue: '忠诚信任得分偏低，说明安全感可能不太稳。你可能会更在意对方有没有兑现承诺、有没有隐瞒、有没有让你反复猜。',
    action: '把“让我不安的行为”和“我希望看到的具体改变”列出来，优先建立可验证的小承诺。'
  },
  support: {
    issue: '陪伴与付出得分偏低，容易让人觉得自己在单方面撑着关系，尤其在需要对方的时候，会更容易委屈。',
    action: '明确分配一件现实事务和一段固定陪伴时间，让付出从“靠自觉”变成双方都知道的约定。'
  },
  intimacy: {
    issue: '亲密包容得分偏低，可能不是完全不爱，而是靠近时不够放松，彼此的差异也更容易被理解成否定或嫌弃。',
    action: '从低压力的亲密开始，例如每天一次拥抱、夸奖或睡前十分钟聊天，先恢复安全感。'
  }
}

function getSortedDimensions(dimensionScores) {
  const scores = Array.isArray(dimensionScores) ? dimensionScores.slice() : []
  return scores.sort((a, b) => a.percent - b.percent)
}

function getMbtiContent(type, tone, context = {}) {
  const profile = MBTI_PROFILES[type] || MBTI_PROFILES.UNKNOWN
  const level = LEVEL_CONTENT[tone] || LEVEL_CONTENT.watch
  const sorted = getSortedDimensions(context.dimensionScores)
  const weakest = sorted[0]
  const strongest = sorted[sorted.length - 1]
  const weakContent = weakest && DIMENSION_CONTENT[weakest.key]
  const total = typeof context.total === 'number' ? context.total : 0
  const resultTitle = context.resultTitle || ''
  const weakText = weakest
    ? `${weakest.name}是当前最低的一项（${weakest.percent}%）。${weakContent ? weakContent.issue : '这说明这里更需要被优先照顾。'}`
    : '当前维度数据不足，建议先从你最有感受的问题开始观察。'
  const strongText = strongest && weakest && strongest.percent > weakest.percent
    ? `${strongest.name}相对更稳定（${strongest.percent}%），可以把这一项当成修复关系的入口。`
    : strongest
      ? '这四个维度目前比较接近，说明问题可能不是单点出现，而是整体相处状态都需要被温柔地重新整理。'
    : '如果暂时看不出优势维度，就先从最容易执行的小改变开始。'
  const weakAction = weakest && weakContent
    ? weakContent.action
    : '先选一个最困扰你的问题，写下具体场景、自己的感受和希望对方怎么做。'

  return {
    analysis: [
      `1. 这次总分是${total}分，结果为“${resultTitle}”。${level.summary}`,
      `2. 从 ${type === 'UNKNOWN' ? '当前性格倾向' : type} 来看，${profile.tendency}所以你在亲密关系里，往往会先用${profile.strength}来保护和经营关系。`,
      `3. ${weakText}这不代表你们一定不合适，更像是在提醒：这里已经需要被认真看见。对你来说，${profile.risk}可能会让这个问题更难被及时说清。`,
      `4. ${strongText}${level.focus}`
    ].join('\n'),
    advice: [
      `1. 先处理最低维度：${weakAction}`,
      `2. 结合你的性格特点：${profile.action}。不用一下子说得很完美，重点是让对方听懂“这件事为什么会影响我”。`,
      '3. 沟通时尽量一次只谈一个主题。先说发生了什么，再说自己的感受，最后提出一个具体请求，比如“下次能不能提前告诉我”，这样比“你总是不在乎我”更容易被接住。',
      '4. 给改变一点时间，但不要无限忍耐。可以连续两周观察：哪些做法让你更安心，哪些行为仍然反复伤到你。如果关系里有人身威胁、暴力、强迫或持续羞辱，请先保护自己，并向可信任的人或专业机构求助。'
    ].join('\n')
  }
}

function getMbtiLabel(type) {
  const match = MBTI_TYPES.find(item => item.value === type)
  return match ? match.label : type
}

module.exports = {
  MBTI_TYPES,
  getMbtiContent,
  getMbtiLabel
}
