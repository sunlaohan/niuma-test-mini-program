const { sharePoster } = require('../../utils/share-poster')

const scoreMaps = [
  [0, 1, 2, 3], [0, 1, 2, 3], [0, 1, 2, 3], [0, 1, 2, 3],
  [0, 1, 2, 3], [0, 1, 2, 3], [0, 1, 2, 3], [0, 1, 2, 3],
  [0, 1, 2, 3], [0, 1, 2, 3], [0, 1, 2, 3], [0, 1, 2, 3]
]

const dimensionConfig = [
  { name: '能量', indexes: [0, 4, 8], note: '你还有多少余量应对日常。' },
  { name: '边界', indexes: [1, 5, 9], note: '你能否把别人的需求和自己的需求分开。' },
  { name: '连接', indexes: [2, 6, 10], note: '你是否还有安全地靠近他人的空间。' },
  { name: '修复', indexes: [3, 7, 11], note: '难受之后，你能不能把自己接回来。' }
]

function getResult(total) {
  if (total <= 8) return { title: '状态在线', tagline: '你有在好好照顾自己。', truth: '你最近的情绪底盘相对稳定。不是没有压力，而是你还保有感受、表达和恢复的能力。继续珍惜那些让你舒服的人和日常。', plan: '1. 把现在有效的习惯留住。\n2. 在还没很累时就休息。\n3. 给自己安排一点纯粹开心、没有产出的时间。', quote: '你不是永远有电，只是知道怎么充电。', safety: false }
  if (total <= 17) return { title: '有点耗电', tagline: '你需要一段不必硬撑的时间。', truth: '你还能运转，但已经不是轻松的状态。那些“没事”“再忍一下”积累久了，也会让人慢慢失去感觉。', plan: '1. 今天先拒绝一件并不紧急的事。\n2. 找一个不需要解释太多的人，说一句“我最近有点累”。\n3. 这周安排一次不带目的的休息。', quote: '累不是失败，是身体在提醒你慢一点。', safety: false }
  if (total <= 26) return { title: '情绪超载', tagline: '先把自己从待办事项里捞出来。', truth: '你可能已经习惯一边难受一边继续做事。不是你不够坚强，而是目前承担的东西已经超过了你的恢复速度。', plan: '1. 暂停为所有人负责。\n2. 把最消耗你的事写下来，只处理最小的一步。\n3. 连续三天给自己留出一段完全不被打扰的时间。', quote: '你不是机器，断电之前也可以先停下来。', safety: true }
  return { title: '需要先照顾自己', tagline: '现在最重要的事，是让你安全地缓下来。', truth: '这段时间的你可能很难真正休息，也很难从情绪里抽身。请不要把它理解成“自己太脆弱”，这更像是需要被认真看见的求救信号。', plan: '1. 今天联系一个可信赖的人，不用把话说完整。\n2. 尽量减少独自硬扛和重要决定。\n3. 考虑联系心理咨询师、医生或当地支持资源，获得更专业的陪伴。', quote: '你值得被照顾，不需要先证明自己够难。', safety: true }
}

Page({
  data: { total: 0, result: {}, dimensions: [], generatingReport: false, reportImagePath: '' },
  onLoad() {
    const answers = wx.getStorageSync('emotionAnswers')
    if (!Array.isArray(answers) || answers.length !== scoreMaps.length) { wx.reLaunch({ url: '/pages/emotion/quiz?reset=1' }); return }
    const raw = answers.map((answer, index) => scoreMaps[index][answer] || 0)
    const total = raw.reduce((sum, value) => sum + value, 0)
    const dimensions = dimensionConfig.map(item => { const load = item.indexes.reduce((sum, index) => sum + raw[index], 0); const score = 9 - load; return { ...item, score, percent: Math.round(score / 9 * 100) } })
    this.setData({ total, result: getResult(total), dimensions })
  },
  onShow() { wx.showShareMenu({ menus: ['shareAppMessage', 'shareTimeline'] }) },
  restart() { wx.removeStorageSync('emotionAnswers'); wx.redirectTo({ url: '/pages/emotion/quiz?reset=1' }) },
  goHome() { wx.reLaunch({ url: '/pages/index/index' }) },
  shareReportImage() {
    const { result, total, dimensions } = this.data
    sharePoster(this, {
      eyebrow: '牛马状态测试 · 情绪监测报告',
      masthead: '02 / EMOTION CHECK',
      title: result.title,
      subtitle: result.tagline,
      score: `${total} / 36`,
      cards: [
        { title: '此刻的你', content: result.truth },
        { title: '拯救计划', content: result.plan },
        { title: '给你的一句话', content: result.quote },
        { title: '情绪维度', content: dimensions.map(item => `${item.name}：${item.score} / 9\n${item.note}`).join('\n\n') },
        ...(result.safety ? [{ title: '重要提醒', content: '如果低落、失眠、无望感或自我伤害的想法持续出现，请尽快联系可信赖的人、心理咨询师或当地紧急支持服务。' }] : [])
      ]
    })
  },
  onShareAppMessage() { return { title: `我的情绪监测结果：${this.data.result.title}`, path: '/pages/index/index' } }
})
