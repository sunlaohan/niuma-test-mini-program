const { sharePoster } = require('../../utils/share-poster')

function clamp(value) { return Math.max(0, Math.min(100, Math.round(value))) }

function getLevel(score) {
  if (score >= 80) return { title: '这班上得有账可算', tagline: '回报、时间和环境暂时处在可接受的平衡里。', summary: '你的工作没有占据全部生活，也能提供足以支撑当前阶段的回报和发展空间。这是一份可以继续经营的选择。', action: '继续保留你正在享受的优势，同时在下一次谈薪、晋升或换岗时，用这份账本为自己争取更高的单小时回报。' }
  if (score >= 60) return { title: '暂可维持，建议抬价', tagline: '这份工作不算亏，但你的投入值得获得更清楚的回报。', summary: '目前存在一些稳定支撑，但时间或现金回报仍有改善空间。不要只用“还行”概括它，具体变量才是谈判筹码。', action: '从最低的一项开始处理：谈一次薪、减少无效通勤，或把模糊的职责边界写清楚。让每一次额外投入都有明确回报。' }
  if (score >= 40) return { title: '投入正在挤压回报', tagline: '你的时间和精力，已经开始超过它给你的反馈。', summary: '这份工作未必没有价值，但目前的时间、环境或收入正在彼此拉扯。继续硬扛会让你的真实时薪进一步下降。', action: '把真实时薪和月投入时长纳入下一次职业选择。优先寻找能提高单小时回报，或显著降低通勤与加班成本的机会。' }
  return { title: '这份工在透支你', tagline: '问题不只是累，而是投入、回报和感受同时失衡。', summary: '现在最重要的不是证明自己能忍，而是重新获得选择权。你的时间、精力和生活不应长期被一份失衡的工作全部占用。', action: '先建立缓冲：更新简历，盘点可迁移能力，设定一个明确的调整时间点。离开或改变不必仓促，但应开始准备。' }
}

function getCity(city, hometown) {
  const title = hometown === '在家乡' ? '熟悉的生活半径' : '独自经营的城市生活'
  const tiers = { '一线城市': '资源密度高，但生活成本和竞争也更高。', '新一线城市': '机会与生活节奏之间有一定平衡。', '二线城市': '生活压力相对适中，适合把工作和个人生活放在同一张账上考虑。', '三线城市': '生活成本更可控，职业机会则更需要主动筛选。', '四线及以下': '生活压力较低，但需要更重视行业机会和长期积累。', '县城 / 乡镇': '日常成本较低，职业选择的宽度需要靠主动创造。' }
  return { title, copy: `${tiers[city] || ''}${hometown === '在家乡' ? '熟人支持和生活熟悉度，是这份工作之外的隐性收益。' : '不在家乡意味着你需要把社交、居住和返乡成本也算进工作账本。'}` }
}

function getCommute(hours, wfhDays) {
  if (hours <= .5) return { title: '通勤几乎不构成负担', copy: '往返时间很短，你能把更多精力留给工作之外的生活。' }
  if (hours <= 1.5) return { title: '通勤仍在可承受范围', copy: `每天 ${hours} 小时的通勤不算轻松，但尚未显著挤压你的私人时间。${wfhDays > 0 ? '远程工作日为你留出了一些弹性。' : ''}` }
  return { title: '通勤正在吞掉生活', copy: `每天 ${hours} 小时往返会持续消耗注意力和休息。除非收入或成长足够有竞争力，否则值得把距离视为一个需要改善的变量。` }
}

function getEnvironment(form) {
  const positive = ['善解人意', '我是嫡系', '和和睦睦', '私交甚好'].includes(form.manager) || ['和和睦睦', '私交甚好'].includes(form.colleague)
  const hasBenefits = form.hasShuttle || form.hasCanteen || form.shuttle === '有' || form.canteen === '有'
  return { title: positive ? '关系环境能提供支撑' : '环境稳定，但需要边界感', copy: `你所在的环境是“${form.environment}”，与领导的关系为“${form.manager}”，同事关系为“${form.colleague}”。${positive ? '人际支持会让高强度阶段更容易度过。' : '不必期待所有关系都亲密，但清晰、可靠的协作边界很重要。'}${hasBenefits ? '班车或餐补等基础福利，也在降低日常消耗。' : ''}` }
}

function getSchoolContent(school) {
  const content = {
    '双非本科': { score: 10, copy: '学历背景提供了稳定起点，后续更需要用可迁移技能、作品和业务成果建立议价权。' },
    '986/211': { score: 17, copy: '学校背景能为你打开一部分机会窗口，关键在于把它转化为具体的专业能力与职业成果。' },
    '顶尖名校': { score: 22, copy: '学校背景是明显的履历优势，也意味着你有条件更主动地选择能够放大这份优势的机会。' },
    'QS/USNEWS 100': { score: 17, copy: '海外院校背景能带来差异化视角，适合把语言、跨文化协作或专业训练沉淀为可展示的能力。' },
    '其他海外院校': { score: 15, copy: '海外学习经历本身是一种差异化资产，重点是让专业能力和实际成果比学校名称更有说服力。' }
  }
  return content[school] || content['双非本科']
}

function getCareer(form) {
  const junior = form.experience === '应届生' || form.experience === '1-3 年'
  const school = getSchoolContent(form.school)
  return { title: junior ? '仍在积累职业筹码' : '履历开始形成复利', copy: `“${form.education}”与“${form.school}”构成了当前履历的基础。${school.copy}${junior ? '现阶段比起立即追求完美，更重要的是确认这份工作能否为下一步提供可迁移的技能和成果。' : '你已有一定经验，应该更主动地选择能带来议价权、作品和关键关系的工作内容。'}“${form.stability}”也会影响你对风险和回报的取舍。` }
}

Page({
  data: { score: 0, yearWorkDays: 0, dailyPay: '0', hourlyPay: '0.0', dailyCommitment: '0.0', annualSalaryText: '', form: {}, level: {}, city: {}, commute: {}, environment: {}, time: {}, career: {}, pay: {}, generatingReport: false, reportImagePath: '' },
  onLoad() {
    const form = wx.getStorageSync('workValueForm')
    if (!form || !Number(form.annualSalary)) { wx.reLaunch({ url: '/pages/work-value/form' }); return }
    const legacySchool = { '普通院校': '双非本科', '双一流 / QS200': '986/211', '顶尖院校 / 海外名校': '顶尖名校' }
    if (legacySchool[form.school]) form.school = legacySchool[form.school]
    const annualSalary = Number(form.annualSalary)
    const monthlyTakeHome = Number(form.monthlyTakeHome) || 0
    const monthlyBenefits = Number(form.monthlyBenefits) || 0
    const monthlyDeductions = Number(form.monthlyDeductions) || 0
    const weeklyDays = Number(form.weeklyDays) || 5
    const wfhDays = Math.min(weeklyDays, Number(form.wfhDays) || 0)
    const dailyHours = Number(form.dailyHours) || 0
    const commuteHours = Number(form.commuteHours) || 0
    const breakHours = Number(form.breakHours) || 0
    const annualLeave = Number(form.annualLeave) || 0
    const statutoryHolidays = Number(form.statutoryHolidays) || 0
    const sickLeave = Number(form.sickLeave) || 0
    const yearWorkDays = Math.max(1, weeklyDays / 7 * 365 - annualLeave - statutoryHolidays - sickLeave)
    const dailyCommitment = dailyHours + breakHours + commuteHours * (1 - wfhDays / weeklyDays)
    const annualHours = yearWorkDays * dailyCommitment
    const netIncome = Math.max(0, (monthlyTakeHome ? monthlyTakeHome * 12 : annualSalary) + monthlyBenefits * 12 - monthlyDeductions * 12)
    const dailyPay = netIncome / yearWorkDays
    const hourlyPay = netIncome / annualHours
    const payScore = clamp(hourlyPay / 110 * 100)
    const timeScore = clamp(100 - Math.max(0, dailyCommitment - 9) * 13 + Math.min(15, (annualLeave + sickLeave) * .7))
    const cityScoreMap = { '一线城市': 62, '新一线城市': 72, '二线城市': 78, '三线城市': 75, '四线及以下': 72, '县城 / 乡镇': 68 }
    const environmentScore = clamp((['善解人意', '我是嫡系'].includes(form.manager) ? 35 : form.manager === '中规中矩' ? 24 : 13) + (['和和睦睦', '私交甚好'].includes(form.colleague) ? 35 : form.colleague === '萍水相逢' ? 24 : 12) + (form.hasShuttle || form.shuttle === '有' ? 12 : 0) + (form.hasCanteen || form.canteen === '有' ? 10 : 0) + (form.hometown === '在家乡' ? 8 : 0))
    const schoolScore = getSchoolContent(form.school).score
    const careerScore = clamp((['硕士', '博士及以上'].includes(form.education) ? 28 : form.education === '本科' ? 22 : 16) + schoolScore + (form.experience === '应届生' ? 12 : form.experience === '1-3 年' ? 20 : form.experience === '3-5 年' ? 28 : 36) + (form.stability === '私企 / 狼性文化' ? 10 : form.stability === '劳务派遣 / OD' ? 5 : form.stability === '自由职业' ? 16 : 24))
    const score = clamp(payScore * .38 + timeScore * .27 + environmentScore * .2 + ((cityScoreMap[form.city] || 70) * .45 + careerScore * .55) * .15)
    const level = getLevel(score)
    this.setData({ score, yearWorkDays: Math.round(yearWorkDays * 10) / 10, dailyPay: Math.round(dailyPay), hourlyPay: hourlyPay.toFixed(1), dailyCommitment: dailyCommitment.toFixed(1), annualSalaryText: annualSalary.toLocaleString('zh-CN'), form, level, city: getCity(form.city, form.hometown), commute: getCommute(commuteHours, wfhDays), environment: getEnvironment(form), time: { title: dailyCommitment > 10 ? '工作日被拉得很长' : '时间尚有可用的余地', copy: `你每天实际为工作投入约 ${dailyCommitment.toFixed(1)} 小时，全年约 ${Math.round(annualHours)} 小时。${dailyCommitment > 10 ? '长时间投入需要用更高的收入、成长或休息来交换，否则很容易变成慢性消耗。' : '请继续守住休息和个人生活的边界，别让可控的节奏被临时任务慢慢侵蚀。'}` }, career: getCareer(form), pay: { title: dailyPay >= 800 ? '日薪有竞争力' : dailyPay >= 450 ? '收入需要更精细地衡量' : '回报值得重新评估', copy: `按你填写的收入口径计算，扣除每月 ${monthlyDeductions} 元支出、计入每月 ${monthlyBenefits} 元福利后，平均日薪约为 ${Math.round(dailyPay)} 元，真实时薪约为 ${hourlyPay.toFixed(1)} 元。${dailyPay >= 800 ? '收入可以覆盖日常生活，并为选择权留出一些空间。' : '把通勤、餐食和时间都加进来后，这份工作的真实回报可能低于表面数字。'}` } })
  },
  restart() { wx.redirectTo({ url: '/pages/work-value/form' }) },
  goHome() { wx.reLaunch({ url: '/pages/index/index' }) },
  shareReportImage() {
    const { score, level, hourlyPay, dailyPay, yearWorkDays, city, commute, environment, time, career, pay } = this.data
    sharePoster(this, {
      eyebrow: '牛马状态测试 · 工作价值报告',
      masthead: '01 / WORK VALUE',
      title: level.title,
      subtitle: level.tagline,
      score: `${score} / 100`,
      cards: [
        { title: '工作账本', content: `真实时薪 ${hourlyPay} 元 · 平均日薪 ${dailyPay} 元 · 年工作 ${yearWorkDays} 天` },
        { title: '最终评估', content: level.summary },
        { title: '工作城市', content: `${city.title}。${city.copy}` },
        { title: '每天通勤', content: `${commute.title}。${commute.copy}` },
        { title: '工作环境', content: `${environment.title}。${environment.copy}` },
        { title: '工作时间', content: `${time.title}。${time.copy}` },
        { title: '教育与工作经验', content: `${career.title}。${career.copy}` },
        { title: '日薪', content: `${pay.title}。${pay.copy}` },
        { title: '综合建议', content: level.action }
      ]
    })
  }
})
