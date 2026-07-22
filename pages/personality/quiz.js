const questions = [
  { question: '午休你更想？', dimension: ['E', 'I'], options: [{ label: '找人八卦', trait: 'E' }, { label: '和熟人聊两句', trait: 'E' }, { label: '戴耳机独处', trait: 'I' }, { label: '隐身吃饭', trait: 'I' }] },
  { question: '新项目组建时？', dimension: ['E', 'I'], options: [{ label: '我先拉群', trait: 'E' }, { label: '跟上节奏', trait: 'E' }, { label: '需要我再说', trait: 'I' }, { label: '藏好自己', trait: 'I' }] },
  { question: '同事崩溃？', dimension: ['F', 'T'], options: [{ label: '我能帮啥', trait: 'F' }, { label: '安慰下', trait: 'F' }, { label: '一起难过', trait: 'F' }, { label: '先解决问题', trait: 'T' }] },
  { question: '需求变更？', dimension: ['J', 'P'], options: [{ label: '更新计划', trait: 'J' }, { label: '尝试适配', trait: 'P' }, { label: '哀嚎', trait: 'P' }, { label: '装没看到', trait: 'P' }] },
  { question: 'Deadline', dimension: ['J', 'P'], options: [{ label: '早完毕', trait: 'J' }, { label: '预留检查', trait: 'J' }, { label: '燃烧期', trait: 'P' }, { label: '明天再说', trait: 'P' }] },
  { question: '计划 vs 灵感？', dimension: ['S', 'N'], options: [{ label: '计划更强', trait: 'S' }, { label: '有框就行', trait: 'S' }, { label: '想到啥干啥', trait: 'N' }, { label: '随缘', trait: 'N' }] },
  { question: '冲突？', dimension: ['F', 'T'], options: [{ label: '直接说', trait: 'T' }, { label: '就事论事', trait: 'T' }, { label: '先沉默', trait: 'F' }, { label: '回避', trait: 'F' }] },
  { question: '做决定？', dimension: ['S', 'N'], options: [{ label: '前瞻性', trait: 'N' }, { label: '想象值', trait: 'N' }, { label: '现实优先', trait: 'S' }, { label: '脚踏实地', trait: 'S' }] },
  { question: '领导只给大方向？', dimension: ['J', 'P'], options: [{ label: '脑补计划', trait: 'J' }, { label: '大概懂', trait: 'P' }, { label: '没细节不动', trait: 'J' }, { label: '写清楚先', trait: 'J' }] },
  { question: '办公室沉默时你会？', dimension: ['E', 'I'], options: [{ label: '主动破冰', trait: 'E' }, { label: '等别人说', trait: 'I' }, { label: '装忙', trait: 'I' }, { label: '希望自己消失', trait: 'I' }] },
  { question: '被说不够好？', dimension: ['F', 'T'], options: [{ label: '问问题在哪', trait: 'T' }, { label: '改就完', trait: 'T' }, { label: '内心难过', trait: 'F' }, { label: '三天难眠', trait: 'F' }] },
  { question: '新流程？', dimension: ['S', 'N'], options: [{ label: '必须升级！', trait: 'N' }, { label: '可以优化', trait: 'N' }, { label: '照旧执行', trait: 'S' }, { label: '折磨人', trait: 'S' }] }
]

Page({
  data: { questions, currentIndex: 0, currentQuestion: questions[0], answers: [], selectedIndex: -1, progress: 0 },
  onLoad(options = {}) {
    const saved = options.reset === '1' ? [] : wx.getStorageSync('personalityAnswers')
    const answers = Array.isArray(saved) ? saved : []
    const currentIndex = Math.min(answers.length, questions.length - 1)
    this.setData({ answers, currentIndex })
    this.updateQuestion()
  },
  updateQuestion() {
    const { currentIndex, answers } = this.data
    this.setData({ currentQuestion: questions[currentIndex], selectedIndex: Number.isInteger(answers[currentIndex]) ? answers[currentIndex] : -1, progress: Math.round((currentIndex / questions.length) * 100) })
  },
  selectOption(event) {
    const selectedIndex = Number(event.currentTarget.dataset.index)
    const answers = [...this.data.answers]
    answers[this.data.currentIndex] = selectedIndex
    this.setData({ answers, selectedIndex })
    wx.setStorageSync('personalityAnswers', answers)
  },
  previous() { if (this.data.currentIndex > 0) { this.setData({ currentIndex: this.data.currentIndex - 1 }); this.updateQuestion() } },
  next() {
    if (this.data.selectedIndex === -1) { wx.showToast({ title: '选一个更像你的答案', icon: 'none' }); return }
    if (this.data.currentIndex < questions.length - 1) { this.setData({ currentIndex: this.data.currentIndex + 1 }); this.updateQuestion(); return }
    wx.navigateTo({ url: '/pages/personality/result' })
  }
})
