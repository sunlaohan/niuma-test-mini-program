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
  ctx.quadraticCurveTo(x, y + height, x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function getLines(ctx, text, maxWidth) {
  const lines = []
  String(text || '').split('\n').forEach(paragraph => {
    let line = ''
    Array.from(paragraph).forEach(char => {
      if (line && ctx.measureText(line + char).width > maxWidth) {
        lines.push(line)
        line = char
      } else {
        line += char
      }
    })
    if (line) lines.push(line)
  })
  return lines
}

function drawLines(ctx, lines, x, y, lineHeight) {
  lines.forEach((line, index) => ctx.fillText(line, x, y + index * lineHeight))
}

function createPoster(page, config) {
  if (page.data.reportImagePath) return Promise.resolve(page.data.reportImagePath)
  page.setData({ generatingReport: true })

  return new Promise((resolve, reject) => {
    page.createSelectorQuery().select('#reportCanvas').fields({ node: true, size: true }).exec(result => {
      const canvas = result[0] && result[0].node
      if (!canvas) { reject(new Error('未找到报告画布')); return }
      canvas.width = REPORT_WIDTH
      canvas.height = 1
      const ctx = canvas.getContext('2d')
      const contentWidth = REPORT_WIDTH - 152
      ctx.font = '24px sans-serif'
      const cards = config.cards.map(card => ({ ...card, lines: getLines(ctx, card.content, contentWidth) }))
      const cardHeights = cards.map(card => 104 + card.lines.length * 42)
      const reportHeight = 336 + cardHeights.reduce((sum, height) => sum + height + 28, 0) + 104
      canvas.height = reportHeight
      const drawCtx = canvas.getContext('2d')

      drawCtx.fillStyle = '#f4f4f1'
      drawCtx.fillRect(0, 0, REPORT_WIDTH, reportHeight)
      drawCtx.fillStyle = '#111111'
      drawCtx.fillRect(0, 0, REPORT_WIDTH, 292)
      drawCtx.textAlign = 'center'
      drawCtx.fillStyle = 'rgba(255,255,255,.78)'
      drawCtx.font = '24px sans-serif'
      drawCtx.fillText(config.eyebrow, REPORT_WIDTH / 2, 58)
      drawCtx.fillStyle = '#ffffff'
      drawCtx.font = 'bold 54px sans-serif'
      drawCtx.fillText(config.title, REPORT_WIDTH / 2, 148)
      drawCtx.font = '26px sans-serif'
      drawCtx.fillStyle = 'rgba(255,255,255,.82)'
      drawCtx.fillText(config.subtitle, REPORT_WIDTH / 2, 202)
      if (config.score) {
        drawCtx.fillStyle = '#ffffff'
        drawCtx.font = 'bold 34px sans-serif'
        drawCtx.fillText(config.score, REPORT_WIDTH / 2, 252)
      }

      let y = 336
      cards.forEach((card, index) => {
        const height = cardHeights[index]
        roundedRect(drawCtx, 44, y, REPORT_WIDTH - 88, height, 26)
        drawCtx.fillStyle = '#ffffff'
        drawCtx.fill()
        drawCtx.textAlign = 'left'
        drawCtx.fillStyle = '#171a19'
        drawCtx.font = 'bold 30px sans-serif'
        drawCtx.fillText(card.title, 76, y + 54)
        drawCtx.fillStyle = '#5e6663'
        drawCtx.font = '24px sans-serif'
        drawLines(drawCtx, card.lines, 76, y + 102, 42)
        y += height + 28
      })
      drawCtx.textAlign = 'center'
      drawCtx.fillStyle = '#929996'
      drawCtx.font = '22px sans-serif'
      drawCtx.fillText('测试结果仅供娱乐', REPORT_WIDTH / 2, reportHeight - 48)
      drawCtx.fillStyle = '#111111'
      drawCtx.font = 'bold 24px sans-serif'
      drawCtx.fillText('牛马状态测试', REPORT_WIDTH / 2, reportHeight - 16)

      wx.canvasToTempFilePath({
        canvas,
        x: 0,
        y: 0,
        width: REPORT_WIDTH,
        height: reportHeight,
        destWidth: REPORT_WIDTH,
        destHeight: reportHeight,
        fileType: 'png',
        quality: 1,
        success: res => { page.setData({ generatingReport: false, reportImagePath: res.tempFilePath }); resolve(res.tempFilePath) },
        fail: error => { page.setData({ generatingReport: false }); reject(error) }
      })
    })
  }).catch(error => {
    page.setData({ generatingReport: false })
    wx.showToast({ title: '报告图片生成失败', icon: 'none' })
    throw error
  })
}

function sharePoster(page, config) {
  const deviceInfo = wx.getDeviceInfo ? wx.getDeviceInfo() : wx.getSystemInfoSync()
  if (deviceInfo.platform === 'devtools') {
    wx.showModal({ title: '请在手机微信中分享', content: '开发者工具无法调用微信好友和朋友圈能力。请点击“预览”并在手机微信中打开后再分享。', showCancel: false, confirmText: '知道了' })
    return
  }
  createPoster(page, config).then(path => {
    if (wx.showShareImageMenu) {
      wx.showShareImageMenu({ path, needShowEntrance: true, entrancePath: '/pages/index/index' })
    } else {
      wx.showToast({ title: '当前微信版本不支持图片分享', icon: 'none' })
    }
  }).catch(() => {})
}

module.exports = { createPoster, sharePoster }
