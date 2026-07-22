const options = {
  education: ['高中及以下', '大专', '本科', '硕士', '博士及以上'],
  school: ['双非本科', '986/211', '顶尖名校', 'QS/USNEWS 100', '其他海外院校'],
  experience: ['应届生', '1-3 年', '3-5 年', '5-10 年', '10 年以上'],
  stability: ['政府 / 事业单位', '国企 / 大型企业', '外企 / 守法企业', '私企 / 狼性文化', '劳务派遣 / OD', '自由职业'],
  environment: ['偏僻工厂 / 工地 / 户外', '普通环境', 'CBD / 核心商圈', '远程为主'],
  city: ['一线城市', '新一线城市', '二线城市', '三线城市', '四线及以下', '县城 / 乡镇'],
  hometown: ['不在家乡', '在家乡'],
  manager: ['对我不爽', '管理严格', '中规中矩', '善解人意', '我是嫡系'],
  colleague: ['都是傻通', '萍水相逢', '和和睦睦', '私交甚好'],
  shuttle: ['无', '有'],
  canteen: ['无', '有']
}

function getIndexes(data) {
  const indexes = {}
  Object.keys(options).forEach(key => { indexes[`${key}Index`] = Math.max(0, options[key].indexOf(data[key])) })
  return indexes
}

Page({
  data: {
    annualSalary: '', monthlyTakeHome: '', monthlyBenefits: '0', monthlyDeductions: '0', weeklyDays: '5', wfhDays: '0', dailyHours: '8', commuteHours: '1', breakHours: '1', annualLeave: '5', statutoryHolidays: '13', sickLeave: '3',
    education: '本科', school: '双非本科', experience: '1-3 年', stability: '私企 / 狼性文化', environment: '普通环境', city: '二线城市', hometown: '不在家乡', manager: '中规中矩', colleague: '萍水相逢', shuttle: '无', canteen: '无',
    educationOptions: options.education, schoolOptions: options.school, experienceOptions: options.experience, stabilityOptions: options.stability, environmentOptions: options.environment, cityOptions: options.city, managerOptions: options.manager, colleagueOptions: options.colleague, benefitOptions: ['无', '有'],
    educationIndex: 2, schoolIndex: 0, experienceIndex: 1, stabilityIndex: 3, environmentIndex: 1, cityIndex: 2, managerIndex: 2, colleagueIndex: 1, shuttleIndex: 0, canteenIndex: 0
  },

  onLoad() {
    const saved = wx.getStorageSync('workValueForm')
    if (saved && saved.annualSalary !== undefined) {
      const legacySchool = {
        '普通院校': '双非本科',
        '双一流 / QS200': '986/211',
        '顶尖院校 / 海外名校': '顶尖名校'
      }
      if (legacySchool[saved.school]) saved.school = legacySchool[saved.school]
      if (saved.monthlyDeductions === undefined && saved.monthlyCost !== undefined) saved.monthlyDeductions = saved.monthlyCost
      this.setData({ ...saved, ...getIndexes(saved) })
    }
  },
  updateField(event) { this.setData({ [event.currentTarget.dataset.field]: event.detail.value }) },
  choosePicker(event) {
    const field = event.currentTarget.dataset.field
    const index = Number(event.detail.value)
    this.setData({ [field]: options[field][index], [`${field}Index`]: index })
  },
  toggleSwitch(event) { this.setData({ [event.currentTarget.dataset.field]: event.detail.value }) },
  toggleHometown(event) { this.setData({ hometown: event.detail.value ? '在家乡' : '不在家乡' }) },
  submit() {
    const form = this.data
    if (!Number(form.annualSalary) || !Number(form.weeklyDays) || !Number(form.dailyHours)) {
      wx.showToast({ title: '请填写年薪、工作天数和每日工时', icon: 'none' })
      return
    }
    wx.setStorageSync('workValueForm', form)
    wx.navigateTo({ url: '/pages/work-value/result' })
  }
})
