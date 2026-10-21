const { MBTI_TYPES } = require('../../utils/mbti')

Page({
  data: {
    mbtiTypes: MBTI_TYPES,
    mbtiIndex: 0,
    selectedMBTI: '',
    selectedMBTILabel: '',
    emotionTitle: '情绪自查&拯救计划',
    relationshipTitle: '情感自查&优化',
    nextHoliday: {},
    weekendCountdown: {},
    offWorkCountdown: '00:00:00',
    offWorkLabel: '到点就走，谁拦谁死'
  },

  onLoad() {
    this.setData({ nextHoliday: this.getNextHoliday() })
    this.setData({ weekendCountdown: this.getWeekendCountdown() })
    this.startOffWorkTimer()
    const selectedMBTI = wx.getStorageSync('partnerTestMBTI')
    const mbtiIndex = MBTI_TYPES.findIndex(item => item.value === selectedMBTI)
    if (mbtiIndex !== -1) {
      this.setData({
        mbtiIndex,
        selectedMBTI,
        selectedMBTILabel: MBTI_TYPES[mbtiIndex].label
      })
    }
  },

  getNextHoliday() {
    const holidays = [
      { name: '元旦', date: '2026-01-01', days: 3 },
      { name: '春节', date: '2026-02-15', days: 9 },
      { name: '清明节', date: '2026-04-04', days: 3 },
      { name: '劳动节', date: '2026-05-01', days: 5 },
      { name: '端午节', date: '2026-06-19', days: 3 },
      { name: '中秋节', date: '2026-09-25', days: 3 },
      { name: '国庆节', date: '2026-10-01', days: 7 }
    ]
    const today = new Date()
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const next = holidays.find(({ date }) => this.toDate(date) >= todayStart) || {
      name: '元旦',
      date: `${today.getFullYear() + 1}-01-01`,
      days: 1
    }
    const countdown = Math.ceil((this.toDate(next.date) - todayStart) / 86400000)
    return { ...next, countdown }
  },

  getWeekendCountdown() {
    const today = new Date()
    const dayOfWeek = today.getDay()
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return { countdown: 0, label: '今天就是周末，好好休息' }
    }
    const countdown = 6 - dayOfWeek
    return {
      countdown,
      label: 'Friday Night！！'
    }
  },

  updateOffWorkCountdown() {
    const now = new Date()
    const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0)
    const isTomorrow = now >= target
    if (isTomorrow) target.setDate(target.getDate() + 1)
    let seconds = Math.ceil((target - now) / 1000)
    const hours = Math.floor(seconds / 3600)
    seconds %= 3600
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    const pad = value => String(value).padStart(2, '0')
    this.setData({
      offWorkCountdown: `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`,
      offWorkLabel: '到点就走，谁拦谁死'
    })
  },

  startOffWorkTimer() {
    if (this.offWorkTimer) clearInterval(this.offWorkTimer)
    this.updateOffWorkCountdown()
    this.offWorkTimer = setInterval(() => this.updateOffWorkCountdown(), 1000)
  },

  toDate(date) {
    const [year, month, day] = date.split('-').map(Number)
    return new Date(year, month - 1, day)
  },

  onShow() {
    wx.showShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })
    if (!this.offWorkTimer) this.startOffWorkTimer()
  },

  onHide() {
    if (this.offWorkTimer) {
      clearInterval(this.offWorkTimer)
      this.offWorkTimer = null
    }
  },

  onUnload() {
    if (this.offWorkTimer) clearInterval(this.offWorkTimer)
  },

  selectMBTI(event) {
    const mbtiIndex = Number(event.detail.value)
    const selected = MBTI_TYPES[mbtiIndex]
    this.setData({
      mbtiIndex,
      selectedMBTI: selected.value,
      selectedMBTILabel: selected.label
    })
    wx.setStorageSync('partnerTestMBTI', selected.value)
  },

  openRelationship() {
    if (!this.data.selectedMBTI) {
      wx.setStorageSync('partnerTestMBTI', 'UNKNOWN')
    }
    wx.removeStorageSync('partnerTestAnswers')
    wx.removeStorageSync('marriageTestAnswers')
    getApp().globalData.answers = []
    wx.navigateTo({
      url: '/pages/quiz/quiz?reset=1'
    })
  },

  openWorkValue() {
    wx.navigateTo({ url: '/pages/work-value/form' })
  },

  openPersonality() {
    wx.navigateTo({ url: '/pages/personality/quiz?reset=1' })
  },

  openMbtiTest() {
    wx.navigateTo({ url: '/pages/mbti/quiz?reset=1' })
  },

  openEmotion() {
    wx.navigateTo({ url: '/pages/emotion/quiz?reset=1' })
  },

  showComingSoon(event) {
    wx.showToast({
      title: `${event.currentTarget.dataset.title}正在准备中`,
      icon: 'none'
    })
  },

  onShareAppMessage() {
    return {
      title: '牛马状态测试｜盘点你的真实状态',
      path: '/pages/index/index'
    }
  },

  onShareTimeline() {
    return {
      title: '牛马状态测试｜盘点你的真实状态',
      query: ''
    }
  }
})
