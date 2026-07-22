const { getMbtiContent, getMbtiLabel } = require('../../utils/mbti')

const REPORT_WIDTH = 750

function roundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2)
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + width - r, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + r)
  ctx.lineTo(x + width, y + height - r)
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height)
  ctx.lineTo(x + r, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function getTextLines(ctx, text, maxWidth) {
  const lines = []
  String(text || '').split('\n').forEach(paragraph => {
    let line = ''
    Array.from(paragraph).forEach(char => {
      const next = line + char
      if (line && ctx.measureText(next).width > maxWidth) {
        lines.push(line)
        line = char
      } else {
        line = next
      }
    })
    lines.push(line)
  })
  return lines
}

function drawLines(ctx, lines, x, y, lineHeight) {
  lines.forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight)
  })
  return y + lines.length * lineHeight
}

function getReportLayout(ctx, data) {
  const cardX = 44
  const cardWidth = REPORT_WIDTH - 88
  const lineHeight = 42

  ctx.font = '24px sans-serif'
  const analysisLines = getTextLines(ctx, data.mbtiAnalysis, cardWidth - 64)
  const analysisHeight = 146 + analysisLines.length * lineHeight
  const adviceLines = getTextLines(ctx, data.personalizedAdvice, cardWidth - 64)
  const adviceHeight = 112 + adviceLines.length * lineHeight
  const adviceY = 404 + 506 + analysisHeight + 36
  const reportHeight = adviceY + adviceHeight + 148

  return {
    cardX,
    cardWidth,
    lineHeight,
    analysisLines,
    analysisHeight,
    adviceLines,
    adviceHeight,
    reportHeight
  }
}

const resultLevels = [
  {
    min: 80,
    title: '健康优质',
    tagline: '你们在认真地爱，也在好好地相处',
    tone: 'healthy',
    description: '沟通顺畅、信任充足，彼此能够包容支撑。即使出现冲突，你们也有能力一起面对并良性化解，这是一段具有稳定感和成长力的关系。',
    advice: '继续保留那些有效的相处方式。可以定期安排只属于两个人的时间，也别忘了把感谢和欣赏说出口。'
  },
  {
    min: 60,
    title: '普通待改善',
    tagline: '关系有基础，也有一些地方在等待照顾',
    tone: 'watch',
    description: '整体没有重大裂痕，但沟通或陪伴中存在较明显的短板。未被表达的需求可能慢慢变成不满，需要双方主动看见并调整。',
    advice: '从得分最低的维度开始，每周进行一次不被打断的对话：只描述感受和需要，先倾听，不急着反驳或解决。'
  },
  {
    min: 40,
    title: '高危失衡',
    tagline: '这段关系正在消耗你们，需要认真面对',
    tone: 'risk',
    description: '关系中可能存在信任缺失、频繁争吵或冷暴力，双方付出也可能明显不对等。长期内耗不会自行消失，需要更深入的沟通和改变。',
    advice: '选择情绪平稳的时刻谈清核心矛盾，并共同约定可观察的改变。如果反复陷入同样的循环，可考虑寻求正规的伴侣关系咨询。'
  },
  {
    min: 0,
    title: '严重破损',
    tagline: '你感受到的痛苦值得被认真对待',
    tone: 'critical',
    description: '关系中可能存在背叛、持续的语言或精神伤害，以及难以调和的核心矛盾。此时不必勉强自己维持表面的完整，需要慎重考量关系的存续。',
    advice: '先照顾好自己的身心和现实安全，向可信任的亲友寻求支持。重要决定可在专业咨询师或法律人士的帮助下审慎作出。'
  }
]

Page({
  data: {
    total: 0,
    result: resultLevels[3],
    dimensionScores: [],
    mbti: '',
    mbtiLabel: '',
    mbtiAnalysisTitle: '结合 MBTI 分析',
    mbtiAnalysis: '',
    personalizedAdvice: '',
    generatingReport: false,
    reportImagePath: ''
  },

  onShow() {
    wx.showShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  onLoad() {
    const app = getApp()
    const answers = app.globalData.answers.length
      ? app.globalData.answers
      : wx.getStorageSync('partnerTestAnswers')
        || wx.getStorageSync('marriageTestAnswers')

    if (!Array.isArray(answers) || answers.length !== 20 || answers.some(value => !value)) {
      wx.reLaunch({ url: '/pages/index/index' })
      return
    }

    const mbti = wx.getStorageSync('partnerTestMBTI')
    if (!mbti) {
      wx.reLaunch({ url: '/pages/index/index' })
      return
    }

    const total = answers.reduce((sum, value) => sum + Number(value), 0)
    const result = resultLevels.find(level => total >= level.min)
    const definitions = [
      { name: '沟通', key: 'communication', start: 0, end: 6, max: 30 },
      { name: '忠诚信任', key: 'trust', start: 6, end: 11, max: 25 },
      { name: '陪伴与付出', key: 'support', start: 11, end: 16, max: 25 },
      { name: '亲密包容', key: 'intimacy', start: 16, end: 20, max: 20 }
    ]
    const dimensionScores = definitions.map(item => {
      const score = answers.slice(item.start, item.end).reduce((sum, value) => sum + Number(value), 0)
      return {
        ...item,
        score,
        percent: Math.round((score / item.max) * 100)
      }
    })
    const mbtiContent = getMbtiContent(mbti, result.tone, {
      total,
      resultTitle: result.title,
      dimensionScores
    })

    app.globalData.result = { total, result, dimensionScores, mbti }
    this.setData({
      total,
      result,
      dimensionScores,
      mbti,
      mbtiLabel: getMbtiLabel(mbti),
      mbtiAnalysisTitle: mbti === 'UNKNOWN' ? '关系倾向分析' : '结合 MBTI 分析',
      mbtiAnalysis: mbtiContent.analysis,
      personalizedAdvice: mbtiContent.advice
    })
  },

  restart() {
    wx.removeStorageSync('partnerTestAnswers')
    wx.removeStorageSync('marriageTestAnswers')
    getApp().globalData.answers = []
    wx.redirectTo({ url: '/pages/quiz/quiz?reset=1' })
  },

  goHome() {
    wx.reLaunch({ url: '/pages/index/index' })
  },

  createReportImage() {
    if (this.data.reportImagePath) {
      return Promise.resolve(this.data.reportImagePath)
    }

    this.setData({ generatingReport: true })

    return new Promise((resolve, reject) => {
      this.createSelectorQuery()
        .select('#reportCanvas')
        .fields({ node: true, size: true })
        .exec(result => {
          const canvas = result[0] && result[0].node
          if (!canvas) {
            reject(new Error('未找到报告画布'))
            return
          }

          canvas.width = REPORT_WIDTH
          canvas.height = 1
          let ctx = canvas.getContext('2d')
          const layout = getReportLayout(ctx, this.data)

          canvas.height = layout.reportHeight
          ctx = canvas.getContext('2d')

          this.drawReportPoster(ctx, layout)

          wx.canvasToTempFilePath({
            canvas,
            x: 0,
            y: 0,
            width: REPORT_WIDTH,
            height: layout.reportHeight,
            destWidth: REPORT_WIDTH,
            destHeight: layout.reportHeight,
            fileType: 'png',
            quality: 1,
            success: res => {
              this.setData({
                generatingReport: false,
                reportImagePath: res.tempFilePath
              })
              resolve(res.tempFilePath)
            },
            fail: error => {
              this.setData({ generatingReport: false })
              reject(error)
            }
          })
        })
    }).catch(error => {
      this.setData({ generatingReport: false })
      wx.showToast({
        title: '报告图片生成失败',
        icon: 'none'
      })
      throw error
    })
  },

  drawReportPoster(ctx, layout) {
    const {
      total,
      result,
      dimensionScores,
      mbtiLabel,
      mbtiAnalysisTitle,
    } = this.data
    const {
      cardX,
      cardWidth,
      lineHeight,
      analysisLines,
      analysisHeight,
      adviceLines,
      adviceHeight,
      reportHeight
    } = layout

    ctx.fillStyle = '#f4f4f1'
    ctx.fillRect(0, 0, REPORT_WIDTH, reportHeight)

    ctx.fillStyle = '#111111'
    ctx.fillRect(0, 0, REPORT_WIDTH, 360)

    ctx.textAlign = 'center'
    ctx.fillStyle = 'rgba(255,255,255,.78)'
    ctx.font = '24px sans-serif'
    ctx.fillText('牛马状态测试 · 情感自查报告', REPORT_WIDTH / 2, 62)

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 96px sans-serif'
    ctx.fillText(String(total), REPORT_WIDTH / 2, 180)
    ctx.font = '26px sans-serif'
    ctx.fillText('/ 100', REPORT_WIDTH / 2, 220)
    ctx.font = 'bold 42px sans-serif'
    ctx.fillText(result.title, REPORT_WIDTH / 2, 290)
    ctx.font = '24px sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,.82)'
    ctx.fillText(result.tagline, REPORT_WIDTH / 2, 330)

    let y = 404

    roundedRect(ctx, cardX, y, cardWidth, 470, 26)
    ctx.fillStyle = '#ffffff'
    ctx.fill()

    ctx.textAlign = 'left'
    ctx.fillStyle = '#171a19'
    ctx.font = 'bold 30px sans-serif'
    ctx.fillText('四个维度', 76, y + 54)

    dimensionScores.forEach((item, index) => {
      const rowY = y + 108 + index * 84
      ctx.fillStyle = '#5e6663'
      ctx.font = '24px sans-serif'
      ctx.fillText(item.name, 76, rowY)
      ctx.textAlign = 'right'
      ctx.fillStyle = '#111111'
      ctx.font = 'bold 24px sans-serif'
      ctx.fillText(`${item.percent}%`, REPORT_WIDTH - 76, rowY)
      ctx.textAlign = 'left'

      roundedRect(ctx, 76, rowY + 20, cardWidth - 64, 12, 6)
      ctx.fillStyle = '#d5d5d1'
      ctx.fill()
      roundedRect(ctx, 76, rowY + 20, (cardWidth - 64) * item.percent / 100, 12, 6)
      ctx.fillStyle = '#111111'
      ctx.fill()
    })

    y += 506
    roundedRect(ctx, cardX, y, cardWidth, analysisHeight, 26)
    ctx.fillStyle = '#ffffff'
    ctx.fill()

    ctx.textAlign = 'left'
    ctx.fillStyle = '#171a19'
    ctx.font = 'bold 30px sans-serif'
    ctx.fillText(mbtiAnalysisTitle, 76, y + 62)
    ctx.fillStyle = '#111111'
    ctx.font = '22px sans-serif'
    ctx.fillText(mbtiLabel, 76, y + 110)
    ctx.fillStyle = '#5e6663'
    ctx.font = '24px sans-serif'
    drawLines(ctx, analysisLines, 76, y + 154, lineHeight)

    y += analysisHeight + 36
    roundedRect(ctx, cardX, y, cardWidth, adviceHeight, 26)
    ctx.fillStyle = '#ffffff'
    ctx.fill()

    ctx.fillStyle = '#171a19'
    ctx.font = 'bold 28px sans-serif'
    ctx.fillText('给你们的小建议', 76, y + 58)
    ctx.fillStyle = '#5e6663'
    ctx.font = '24px sans-serif'
    drawLines(ctx, adviceLines, 76, y + 105, lineHeight)

    ctx.textAlign = 'center'
    ctx.fillStyle = '#929996'
    ctx.font = '22px sans-serif'
    ctx.fillText('测试结果仅供娱乐', REPORT_WIDTH / 2, reportHeight - 84)
    ctx.fillStyle = '#111111'
    ctx.font = 'bold 24px sans-serif'
    ctx.fillText('牛马状态测试', REPORT_WIDTH / 2, reportHeight - 42)
  },

  saveReportImage() {
    this.createReportImage()
      .then(filePath => new Promise((resolve, reject) => {
        wx.saveImageToPhotosAlbum({
          filePath,
          success: resolve,
          fail: reject
        })
      }))
      .then(() => {
        wx.showToast({
          title: '已保存到相册',
          icon: 'success'
        })
      })
      .catch(error => {
        if (error && /auth deny|authorize/.test(error.errMsg || '')) {
          wx.showModal({
            title: '需要相册权限',
            content: '请在设置中允许保存图片到相册。',
            confirmText: '去设置',
            success: res => {
              if (res.confirm) wx.openSetting()
            }
          })
        }
      })
  },

  shareReportImage() {
    const deviceInfo = wx.getDeviceInfo
      ? wx.getDeviceInfo()
      : wx.getSystemInfoSync()

    if (deviceInfo.platform === 'devtools') {
      wx.showModal({
        title: '请在手机微信中分享',
        content: '开发者工具无法调用微信好友和朋友圈能力。请点击“预览”并在手机微信中打开后，再使用“分享报告图片”。',
        showCancel: false,
        confirmText: '知道了'
      })
      return
    }

    this.createReportImage()
      .then(filePath => {
        if (wx.showShareImageMenu) {
          wx.showShareImageMenu({
            path: filePath,
            needShowEntrance: true,
            entrancePath: '/pages/index/index'
          })
          return
        }
        wx.showToast({
          title: '当前微信版本不支持图片分享',
          icon: 'none'
        })
      })
      .catch(() => {})
  },

  onShareAppMessage() {
    return {
      title: '我完成了牛马状态测试的情感自查，你也来试试',
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
