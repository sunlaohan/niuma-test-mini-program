const { sharePoster } = require('../../utils/share-poster')

const answerTraits = [
  ['E', 'E', 'I', 'I'], ['E', 'E', 'I', 'I'], ['F', 'F', 'F', 'T'], ['J', 'P', 'P', 'P'],
  ['J', 'J', 'P', 'P'], ['S', 'S', 'N', 'N'], ['T', 'T', 'F', 'F'], ['N', 'N', 'S', 'S'],
  ['J', 'P', 'J', 'J'], ['E', 'I', 'I', 'I'], ['T', 'T', 'F', 'F'], ['N', 'N', 'S', 'S']
]

const baseProfiles = {
  E: { truth: '你会通过连接、表达和行动确认自己的位置。人多不一定耗电，长期没有回应才会。', guide: '把你的热情用在值得的人和项目上。先说清需求，再主动拉齐节奏，别把所有气氛都扛在自己身上。', quote: '你不是话多，你是在给世界递一根线。' },
  I: { truth: '你更习惯先在心里完成判断，再决定要不要开口。独处不是撤退，是你恢复秩序的方式。', guide: '给自己留出不被打断的时间。重要的观点不必抢着说，但准备好后请让它被听见。', quote: '安静不是空白，是你在给自己充电。' },
  S: { truth: '你相信看得见的事实、可执行的步骤和已经验证过的经验。你让事情真正落地。', guide: '保留你的务实，也偶尔抬头看看变化。先问一句“有没有更好的做法”，会让稳定不等于停滞。', quote: '你不靠口号，你靠把事情做成。' },
  N: { truth: '你对可能性和下一步很敏感，常常比现场更早看到方向。你需要的是能容纳想法的空间。', guide: '把灵感落成一个下一步动作。不是每个想法都要实现，但值得给最重要的那个一个截止时间。', quote: '你看到的路，常常比现在的路更远。' },
  T: { truth: '你会先拆问题、看逻辑、找最有效的解法。对你来说，清楚比好听更重要。', guide: '结论前多留一句感受的空间。别人不一定反对你的方案，只是希望先被理解。', quote: '你的冷静，是复杂局面里的坐标。' },
  F: { truth: '你会先感知气氛和人的状态，再判断事情要怎么推进。关系对你不是附属，是工作本身的一部分。', guide: '共情不等于替所有人兜底。把“我理解你”与“这件事我能做什么”分开，你会轻松很多。', quote: '你的敏感，不是负担，是读懂人的能力。' },
  J: { truth: '你需要清楚的边界、时间表和可预期的推进。计划不是束缚，是让你安心的结构。', guide: '为变化预留一点空白。不是所有临时调整都在破坏秩序，有些是新机会在敲门。', quote: '你把混乱排成队，事情就开始往前走。' },
  P: { truth: '你在变化中反而更灵活，保留选项会让你保持活力。你不爱被流程过早定义。', guide: '把自由留给过程，把截止时间留给结果。先完成一个版本，往往比等待完美的状态更有力量。', quote: '你不是拖延，你是在等更合适的入口。' }
}

const typeNames = {
  INTJ: '清醒规划牛马', INTP: '逻辑摸鱼牛马', ENTJ: '项目推进牛马', ENTP: '脑洞增殖牛马',
  INFJ: '洞察型牛马', INFP: '自由心牛马', ENFJ: '氛围组长牛马', ENFP: '热情启动牛马',
  ISTJ: '靠谱执行牛马', ISFJ: '稳定照顾牛马', ESTJ: '秩序管理牛马', ESFJ: '关系维护牛马',
  ISTP: '冷静修理牛马', ISFP: '自由心草马', ESTP: '现场反应牛马', ESFP: '快乐续航牛马'
}

function buildProfile(type) {
  const traits = type.split('')
  const descriptions = traits.map(trait => baseProfiles[trait])
  return {
    name: typeNames[type] || '自定义牛马',
    truth: `${descriptions[0].truth}\n${descriptions[1].truth}`,
    guide: `${descriptions[2].guide}\n${descriptions[3].guide}`,
    quote: `${descriptions[0].quote}`
  }
}

function getTendency(label, left, leftScore, right, rightScore) {
  const prefersLeft = leftScore >= rightScore
  return {
    label,
    result: `更偏向：${prefersLeft ? left : right}`,
    detail: `${left} ${leftScore} 分 · ${right} ${rightScore} 分`
  }
}

Page({
  data: { type: '', profile: {}, dimensionScores: [], generatingReport: false, reportImagePath: '' },
  onLoad() {
    const answers = wx.getStorageSync('personalityAnswers')
    if (!Array.isArray(answers) || answers.length !== answerTraits.length) { wx.reLaunch({ url: '/pages/personality/quiz?reset=1' }); return }
    const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }
    answerTraits.forEach((traits, index) => { const trait = traits[answers[index]]; if (trait) scores[trait] += 2 })
    const type = `${scores.E >= scores.I ? 'E' : 'I'}${scores.S >= scores.N ? 'S' : 'N'}${scores.T >= scores.F ? 'T' : 'F'}${scores.J >= scores.P ? 'J' : 'P'}`
    this.setData({
      type,
      profile: buildProfile(type),
      dimensionScores: [
        getTendency('社交充电方式', '热闹互动', scores.E, '独处充电', scores.I),
        getTendency('接收信息方式', '现实细节', scores.S, '可能方向', scores.N),
        getTendency('做决定时', '逻辑分析', scores.T, '感受与价值', scores.F),
        getTendency('做事节奏', '提前规划', scores.J, '随机应变', scores.P)
      ]
    })
  },
  onShow() { wx.showShareMenu({ menus: ['shareAppMessage', 'shareTimeline'] }) },
  restart() { wx.removeStorageSync('personalityAnswers'); wx.redirectTo({ url: '/pages/personality/quiz?reset=1' }) },
  goHome() { wx.reLaunch({ url: '/pages/index/index' }) },
  shareReportImage() {
    const { type, profile, dimensionScores } = this.data
    sharePoster(this, {
      eyebrow: '牛马状态测试 · 性格报告',
      title: type,
      subtitle: profile.name,
      cards: [
        { title: '你的牛马真相', content: profile.truth },
        { title: '生存指南', content: profile.guide },
        { title: '你的性格倾向', content: dimensionScores.map(item => `${item.label}：${item.result.replace('更偏向：', '')}`).join(' · ') }
      ]
    })
  },
  onShareAppMessage() { return { title: `我的牛马性格是 ${this.data.type}，来测测你的`, path: '/pages/index/index' } }
})
