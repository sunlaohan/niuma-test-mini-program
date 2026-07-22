const questions = [
  { dimension: '沟通维度', key: 'communication', text: '遇到矛盾时，我们愿意静下心好好沟通，不会冷暴力、翻旧账' },
  { dimension: '沟通维度', key: 'communication', text: '我能放心向对方倾诉负面情绪，不会担心被指责、嘲讽' },
  { dimension: '沟通维度', key: 'communication', text: '争吵结束后，双方会主动复盘问题，而非单纯争输赢' },
  { dimension: '沟通维度', key: 'communication', text: '日常会主动分享工作、生活琐事，保持日常交流' },
  { dimension: '沟通维度', key: 'communication', text: '对方能听懂我的需求，很少出现长期误解' },
  { dimension: '沟通维度', key: 'communication', text: '有分歧时不会随意说分手、伤人狠话' },
  { dimension: '忠诚信任维度', key: 'trust', text: '我相信对方不会私下与他人暧昧、隐瞒重要社交' },
  { dimension: '忠诚信任维度', key: 'trust', text: '双方财务、重大人生选择会互相告知、共同商量' },
  { dimension: '忠诚信任维度', key: 'trust', text: '不会刻意隐瞒手机、社交记录，刻意防备彼此' },
  { dimension: '忠诚信任维度', key: 'trust', text: '发生诱惑时，对方会主动保持边界、拒绝越界行为' },
  { dimension: '忠诚信任维度', key: 'trust', text: '过往背叛或过错已彻底和解，不会反复拿旧事折磨彼此' },
  { dimension: '陪伴与付出维度', key: 'support', text: '愿意主动分担生活事务和现实压力，不会单方面索取付出' },
  { dimension: '陪伴与付出维度', key: 'support', text: '会记住彼此的喜好、纪念日，愿意制造小关怀' },
  { dimension: '陪伴与付出维度', key: 'support', text: '生病、低谷时期，对方会主动照顾、给予情绪支撑' },
  { dimension: '陪伴与付出维度', key: 'support', text: '尊重彼此个人爱好、社交圈子，不强行控制约束' },
  { dimension: '陪伴与付出维度', key: 'support', text: '对于婚育选择、定居、职业规划等未来安排能坦诚沟通' },
  { dimension: '亲密包容维度', key: 'intimacy', text: '彼此的亲密接触、肢体陪伴自然舒适，无长期排斥' },
  { dimension: '亲密包容维度', key: 'intimacy', text: '接纳对方缺点，不会长期贬低、否定伴侣人格' },
  { dimension: '亲密包容维度', key: 'intimacy', text: '愿意为这段关系适度妥协，不凡事只考虑自己' },
  { dimension: '亲密包容维度', key: 'intimacy', text: '想到和对方共度未来，内心更多是安心而非焦虑' }
]

const options = [
  { label: '完全符合', value: 5 },
  { label: '经常符合', value: 4 },
  { label: '一般', value: 3 },
  { label: '偶尔符合', value: 2 },
  { label: '完全不符合', value: 1 }
]

Page({
  data: {
    questions,
    options,
    answers: [],
    currentIndex: 0,
    currentQuestion: questions[0],
    selectedValue: 0,
    progress: 5,
    questionNo: '01',
    dimensions: []
  },

  onShow() {
    wx.showShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  onLoad(options = {}) {
    const shouldReset = options.reset === '1'
    const saved = shouldReset
      ? null
      : wx.getStorageSync('partnerTestAnswers')
        || wx.getStorageSync('marriageTestAnswers')
    const answers = Array.isArray(saved) && saved.length === questions.length
      ? saved
      : new Array(questions.length).fill(0)
    if (shouldReset) {
      wx.removeStorageSync('marriageTestAnswers')
      getApp().globalData.answers = []
    }
    wx.setStorageSync('partnerTestAnswers', answers)
    const firstUnanswered = answers.findIndex(value => !value)
    const currentIndex = firstUnanswered === -1 ? 0 : firstUnanswered
    this.setData({ answers, currentIndex })
    this.updateQuestion()
  },

  updateQuestion() {
    const { currentIndex, answers } = this.data
    const groups = [
      { name: '沟通维度', shortName: '沟通', start: 0, end: 5 },
      { name: '忠诚信任维度', shortName: '信任', start: 6, end: 10 },
      { name: '陪伴与付出维度', shortName: '陪伴', start: 11, end: 15 },
      { name: '亲密包容维度', shortName: '亲密', start: 16, end: 19 }
    ]
    const dimensions = groups.map(group => ({
      ...group,
      active: currentIndex >= group.start && currentIndex <= group.end,
      done: group.end < currentIndex
    }))
    this.setData({
      currentQuestion: questions[currentIndex],
      selectedValue: answers[currentIndex] || 0,
      progress: Math.round(((currentIndex + 1) / questions.length) * 100),
      questionNo: String(currentIndex + 1).padStart(2, '0'),
      dimensions
    })
  },

  selectOption(event) {
    const value = Number(event.detail.value)
    const answers = [...this.data.answers]
    answers[this.data.currentIndex] = value
    this.setData({ answers, selectedValue: value })
    wx.setStorageSync('partnerTestAnswers', answers)
  },

  previous() {
    if (this.data.currentIndex === 0) return
    this.setData({ currentIndex: this.data.currentIndex - 1 })
    this.updateQuestion()
  },

  next() {
    if (!this.data.selectedValue) {
      wx.showToast({ title: '请先选择一个答案', icon: 'none' })
      return
    }
    if (this.data.currentIndex < questions.length - 1) {
      this.setData({ currentIndex: this.data.currentIndex + 1 })
      this.updateQuestion()
      return
    }
    const app = getApp()
    app.globalData.answers = this.data.answers
    wx.redirectTo({ url: '/pages/result/result' })
  },

  onShareAppMessage() {
    return {
      title: '牛马状态测试｜情感自查 & 优化',
      path: '/pages/index/index'
    }
  },

  onShareTimeline() {
    return {
      title: '牛马状态测试｜情感自查 & 优化',
      query: ''
    }
  }
})
