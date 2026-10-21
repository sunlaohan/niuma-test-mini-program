const { MBTI_QUESTIONS, getResult, getDimensionScores } = require('../../utils/mbti-test')
const { sharePoster } = require('../../utils/share-poster')

Page({
  data: { result: {}, dimensions: [], generatingReport: false, reportImagePath: '' },
  onLoad() {
    const answers = wx.getStorageSync('mbtiTestAnswers')
    if (!Array.isArray(answers) || answers.length !== MBTI_QUESTIONS.length) { wx.reLaunch({ url: '/pages/mbti/quiz?reset=1' }); return }
    const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }
    answers.forEach((answer, index) => {
      const question = MBTI_QUESTIONS[index]
      const score = 5 - Number(answer)
      const reverseScore = 6 - score
      const opposite = { E: 'I', I: 'E', S: 'N', N: 'S', T: 'F', F: 'T', J: 'P', P: 'J' }[question.direction]
      scores[question.direction] += score
      scores[opposite] += reverseScore
    })
    this.setData({ result: getResult(scores), dimensions: getDimensionScores(scores) })
  },
  onShow() { wx.showShareMenu({ menus: ['shareAppMessage', 'shareTimeline'] }) },
  restart() { wx.removeStorageSync('mbtiTestAnswers'); wx.redirectTo({ url: '/pages/mbti/quiz?reset=1' }) },
  goHome() { wx.reLaunch({ url: '/pages/index/index' }) },
  shareReportImage() {
    const { result, dimensions } = this.data
    sharePoster(this, { eyebrow: '牛马状态测试 · MBTI 人格报告', masthead: '04 / MBTI TENDENCIES', title: result.type, subtitle: result.name, cards: [{ title: '你的测试结果', content: result.summary }, { title: '四个偏好维度', content: dimensions.map(item => `${item.label}：${item.tendency}\n${item.left} ${item.leftScore} 分 · ${item.right} ${item.rightScore} 分`).join('\n\n') }, { title: '你的典型模式', content: result.insight }, { title: '你的天然优势', content: result.strength }, { title: '给你的提醒', content: result.growth }] })
  },
  onShareAppMessage() { return { title: `我的人格倾向是 ${this.data.result.type}，来测测你的`, path: '/pages/index/index' } }
})
