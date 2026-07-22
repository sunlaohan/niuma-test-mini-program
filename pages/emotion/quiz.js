const questions = [
  { dimension: '能量', question: '周一早上醒来？', options: [{ label: '还行，能开始', score: 0 }, { label: '想再缓五分钟', score: 1 }, { label: '身体到了，魂没到', score: 2 }, { label: '只想消失', score: 3 }] },
  { dimension: '边界', question: '下班后收到工作消息？', options: [{ label: '看情况回', score: 0 }, { label: '会回，但有点烦', score: 1 }, { label: '不回会内疚', score: 2 }, { label: '消息一响就心慌', score: 3 }] },
  { dimension: '连接', question: '有人问你“最近怎么样”？', options: [{ label: '能说点真的', score: 0 }, { label: '先说还行', score: 1 }, { label: '不知道怎么说', score: 2 }, { label: '不想被任何人问', score: 3 }] },
  { dimension: '修复', question: '难受的时候你会？', options: [{ label: '找方法让自己缓过来', score: 0 }, { label: '睡一觉再说', score: 1 }, { label: '硬撑着做事', score: 2 }, { label: '什么都不想做', score: 3 }] },
  { dimension: '能量', question: '周末最常见的状态？', options: [{ label: '有自己的安排', score: 0 }, { label: '想补补觉', score: 1 }, { label: '躺着也恢复不过来', score: 2 }, { label: '想到周一就难受', score: 3 }] },
  { dimension: '边界', question: '临时塞给你一件事？', options: [{ label: '先确认优先级', score: 0 }, { label: '嘴上答应，心里不爽', score: 1 }, { label: '不敢拒绝', score: 2 }, { label: '立刻开始责怪自己', score: 3 }] },
  { dimension: '连接', question: '和熟人待在一起时？', options: [{ label: '能放松做自己', score: 0 }, { label: '偶尔想躲开', score: 1 }, { label: '还是要装没事', score: 2 }, { label: '谁都不想见', score: 3 }] },
  { dimension: '修复', question: '犯错之后？', options: [{ label: '复盘然后继续', score: 0 }, { label: '会难受一阵', score: 1 }, { label: '反复想这件事', score: 2 }, { label: '觉得自己很糟', score: 3 }] },
  { dimension: '能量', question: '做一件小事也拖很久？', options: [{ label: '很少这样', score: 0 }, { label: '偶尔会', score: 1 }, { label: '最近经常', score: 2 }, { label: '几乎什么都启动不了', score: 3 }] },
  { dimension: '边界', question: '别人情绪不好时？', options: [{ label: '陪一会儿就好', score: 0 }, { label: '会被影响', score: 1 }, { label: '总想把人哄好', score: 2 }, { label: '把责任全揽到自己身上', score: 3 }] },
  { dimension: '连接', question: '你最近会笑吗？', options: [{ label: '会，挺自然的', score: 0 }, { label: '偶尔吧', score: 1 }, { label: '更多是礼貌笑', score: 2 }, { label: '不知道上次真开心是什么时候', score: 3 }] },
  { dimension: '修复', question: '累到极点时你会？', options: [{ label: '主动停下来', score: 0 }, { label: '再坚持一下', score: 1 }, { label: '靠咖啡和惯性撑', score: 2 }, { label: '一直撑到断电', score: 3 }] }
]

Page({
  data: { questions, currentIndex: 0, currentQuestion: questions[0], answers: [], selectedIndex: -1, progress: 0 },
  onLoad(options = {}) { const saved = options.reset === '1' ? [] : wx.getStorageSync('emotionAnswers'); const answers = Array.isArray(saved) ? saved : []; const currentIndex = Math.min(answers.length, questions.length - 1); this.setData({ answers, currentIndex }); this.updateQuestion() },
  updateQuestion() { const { currentIndex, answers } = this.data; this.setData({ currentQuestion: questions[currentIndex], selectedIndex: Number.isInteger(answers[currentIndex]) ? answers[currentIndex] : -1, progress: Math.round((currentIndex / questions.length) * 100) }) },
  selectOption(event) { const selectedIndex = Number(event.currentTarget.dataset.index); const answers = [...this.data.answers]; answers[this.data.currentIndex] = selectedIndex; this.setData({ answers, selectedIndex }); wx.setStorageSync('emotionAnswers', answers) },
  previous() { if (this.data.currentIndex > 0) { this.setData({ currentIndex: this.data.currentIndex - 1 }); this.updateQuestion() } },
  next() { if (this.data.selectedIndex === -1) { wx.showToast({ title: '选一个最接近的状态', icon: 'none' }); return } if (this.data.currentIndex < questions.length - 1) { this.setData({ currentIndex: this.data.currentIndex + 1 }); this.updateQuestion(); return } wx.navigateTo({ url: '/pages/emotion/result' }) }
})
