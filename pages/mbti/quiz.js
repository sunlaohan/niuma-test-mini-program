const { MBTI_QUESTIONS, LIKERT_OPTIONS } = require('../../utils/mbti-test')

Page({
  data: { questions: MBTI_QUESTIONS, scaleOptions: LIKERT_OPTIONS, currentIndex: 0, currentQuestion: MBTI_QUESTIONS[0], answers: [], selectedIndex: -1, progress: 0 },
  onLoad(options = {}) {
    const answers = options.reset === '1' ? [] : wx.getStorageSync('mbtiTestAnswers')
    const safeAnswers = Array.isArray(answers) ? answers : []
    this.setData({ answers: safeAnswers, currentIndex: Math.min(safeAnswers.length, MBTI_QUESTIONS.length - 1) })
    this.updateQuestion()
  },
  updateQuestion() {
    const { currentIndex, answers } = this.data
    this.setData({ currentQuestion: MBTI_QUESTIONS[currentIndex], selectedIndex: Number.isInteger(answers[currentIndex]) ? answers[currentIndex] : -1, progress: Math.round(currentIndex / MBTI_QUESTIONS.length * 100) })
  },
  selectOption(event) {
    const answers = [...this.data.answers]
    const selectedIndex = Number(event.currentTarget.dataset.index)
    answers[this.data.currentIndex] = selectedIndex
    this.setData({ answers, selectedIndex })
    wx.setStorageSync('mbtiTestAnswers', answers)
  },
  previous() { if (this.data.currentIndex > 0) { this.setData({ currentIndex: this.data.currentIndex - 1 }); this.updateQuestion() } },
  next() {
    if (this.data.selectedIndex === -1) { wx.showToast({ title: '选一个更像你的答案', icon: 'none' }); return }
    if (this.data.currentIndex < MBTI_QUESTIONS.length - 1) { this.setData({ currentIndex: this.data.currentIndex + 1 }); this.updateQuestion(); return }
    wx.navigateTo({ url: '/pages/mbti/result' })
  }
})
