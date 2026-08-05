const HOLIDAY_API_URL = 'https://timor.tech/api/holiday/info/';

Page({
  data: {
    statusBarHeight: 20,
    clock: '08:30:56',
    todayIncome: '0.00',
    progressPercent: '0.0',
    progressWidth: '0%',
    twoSecondAmount: '0.0222',
    bonusPulse: false,
    isWorking: false,
    isDayOff: false,
    dayOffType: '',
    holidayDateKey: '',
    holidayApiLoaded: false,
    apiDayOff: false,
    apiDayOffType: '',
    workStatus: '未到上班时间',
    monthlySalary: '10000',
    morningStart: '09:00',
    morningEnd: '12:00',
    afternoonStart: '13:30',
    afternoonEnd: '18:00',
    isSalaryHidden: false,
    draftMonthlySalary: '10000',
    draftMorningStart: '09:00',
    draftMorningEnd: '12:00',
    draftAfternoonStart: '13:30',
    draftAfternoonEnd: '18:00',
    isEditingConfig: false,
    configStatus: '已确认'
  },

  onLoad() {
    const windowInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
    const storedConfig = wx.getStorageSync('workInspirationConfig') || {};
    const isSalaryHidden = wx.getStorageSync('workInspirationSalaryHidden') === true;
    const config = {
      monthlySalary: storedConfig.monthlySalary || this.data.monthlySalary,
      morningStart: storedConfig.morningStart || this.data.morningStart,
      morningEnd: storedConfig.morningEnd || this.data.morningEnd,
      afternoonStart: storedConfig.afternoonStart || this.data.afternoonStart,
      afternoonEnd: storedConfig.afternoonEnd || this.data.afternoonEnd
    };

    this.setData({
      statusBarHeight: windowInfo.statusBarHeight || 20,
      ...config,
      isSalaryHidden,
      draftMonthlySalary: config.monthlySalary,
      draftMorningStart: config.morningStart,
      draftMorningEnd: config.morningEnd,
      draftAfternoonStart: config.afternoonStart,
      draftAfternoonEnd: config.afternoonEnd
    }, () => {
      this.refreshIncomeRate();
      this.updateClock();
      this.updateIncome();
    });

    wx.showShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  onShow() {
    this.startTimers();
  },

  onHide() {
    this.clearTimers();
  },

  onUnload() {
    this.clearTimers();
  },

  startTimers() {
    this.clearTimers();
    this.updateClock();
    this.updateIncome();
    this.clockTimer = setInterval(() => this.updateClock(), 1000);
    this.incomeTimer = setInterval(() => this.updateIncome(), 2000);
    this.bonusTimer = setInterval(() => this.triggerTwoSecondBonus(), 2000);
  },

  clearTimers() {
    clearInterval(this.clockTimer);
    clearInterval(this.incomeTimer);
    clearInterval(this.bonusTimer);
    clearTimeout(this.bonusPulseTimer);
    this.clockTimer = null;
    this.incomeTimer = null;
    this.bonusTimer = null;
    this.bonusPulseTimer = null;
  },

  updateClock() {
    const now = new Date();
    const pad = (value) => String(value).padStart(2, '0');
    const dateKey = this.getDateKey(now);
    this.setData({
      clock: `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
    });

    if (dateKey !== this.data.holidayDateKey) {
      this.fetchHolidayInfo(dateKey);
    }
  },

  timeToSeconds(value) {
    const [hours, minutes] = String(value).split(':').map(Number);
    return hours * 3600 + minutes * 60;
  },

  getDailyIncome() {
    return Number(this.data.monthlySalary || 0) / 22;
  },

  getDateKey(date) {
    const pad = (value) => String(value).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  },

  fetchHolidayInfo(dateKey) {
    this.setData({
      holidayDateKey: dateKey,
      holidayApiLoaded: false,
      apiDayOff: false,
      apiDayOffType: ''
    });

    wx.request({
      url: `${HOLIDAY_API_URL}${dateKey}`,
      method: 'GET',
      success: (response) => {
        // 接口类型：0 工作日、1 周末、2 节日、3 调休补班。
        const result = response.data || {};
        const type = result.type || {};
        const holiday = result.holiday || {};
        const typeValue = Number(type.type);
        const isDayOff = holiday.holiday === true || typeValue === 1 || typeValue === 2;

        // 日期跨天时丢弃上一天的异步响应。
        if (dateKey !== this.getDateKey(new Date())) {
          return;
        }

        this.setData({
          holidayApiLoaded: true,
          apiDayOff: isDayOff,
          apiDayOffType: holiday.name || type.name || (isDayOff ? '休息日' : '')
        }, () => {
          this.refreshIncomeRate();
          this.updateIncome();
        });
      },
      fail: () => {
        // 网络不可用时，仍保证普通周末有放假提示。
        this.setData({ holidayApiLoaded: true });
        this.updateIncome();
      }
    });
  },

  getDayOffInfo(now = new Date()) {
    const dateKey = this.getDateKey(now);

    if (this.data.holidayApiLoaded && this.data.holidayDateKey === dateKey) {
      return {
        isDayOff: this.data.apiDayOff,
        dayOffType: this.data.apiDayOffType
      };
    }

    // 接口结果返回前，以周末做临时兜底；接口返回后会覆盖该状态。
    if (now.getDay() === 0 || now.getDay() === 6) {
      return { isDayOff: true, dayOffType: '周末' };
    }

    return { isDayOff: false, dayOffType: '' };
  },

  getWorkState(now = new Date()) {
    const dayOffInfo = this.getDayOffInfo(now);

    if (dayOffInfo.isDayOff) {
      return {
        elapsedWorkSeconds: 0,
        totalWorkSeconds: 1,
        isWorking: false,
        workStatus: '今日放假',
        ...dayOffInfo
      };
    }

    const secondOfDay = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    const morningStart = this.timeToSeconds(this.data.morningStart);
    const morningEnd = this.timeToSeconds(this.data.morningEnd);
    const afternoonStart = this.timeToSeconds(this.data.afternoonStart);
    const afternoonEnd = this.timeToSeconds(this.data.afternoonEnd);
    const morningSeconds = morningEnd - morningStart;
    const totalWorkSeconds = morningSeconds + afternoonEnd - afternoonStart;

    let elapsedWorkSeconds = 0;
    let isWorking = false;
    let workStatus = '未到上班时间';

    if (secondOfDay < morningStart) {
      workStatus = '未到上班时间';
    } else if (secondOfDay < morningEnd) {
      elapsedWorkSeconds = secondOfDay - morningStart;
      isWorking = true;
      workStatus = 'LIVE';
    } else if (secondOfDay < afternoonStart) {
      elapsedWorkSeconds = morningSeconds;
      workStatus = '午休中';
    } else if (secondOfDay < afternoonEnd) {
      elapsedWorkSeconds = morningSeconds + secondOfDay - afternoonStart;
      isWorking = true;
      workStatus = 'LIVE';
    } else {
      elapsedWorkSeconds = totalWorkSeconds;
      workStatus = '今日已完成';
    }

    return {
      elapsedWorkSeconds: Math.max(0, Math.min(totalWorkSeconds, elapsedWorkSeconds)),
      totalWorkSeconds,
      isWorking,
      workStatus,
      isDayOff: false,
      dayOffType: ''
    };
  },

  updateIncome() {
    const state = this.getWorkState();
    const dailyIncome = this.getDailyIncome();
    const income = dailyIncome * state.elapsedWorkSeconds / state.totalWorkSeconds;
    const progress = state.elapsedWorkSeconds / state.totalWorkSeconds * 100;

    this.setData({
      todayIncome: Math.min(dailyIncome, income).toFixed(2),
      progressPercent: Math.min(100, progress).toFixed(1),
      progressWidth: `${Math.min(100, progress)}%`,
      isWorking: state.isWorking,
      isDayOff: state.isDayOff,
      dayOffType: state.dayOffType,
      workStatus: state.workStatus
    });
  },

  refreshIncomeRate() {
    const state = this.getWorkState();
    const twoSecondAmount = this.getDailyIncome() / state.totalWorkSeconds * 2;
    this.setData({
      twoSecondAmount: twoSecondAmount.toFixed(4)
    });
  },

  beginConfigUpdate() {
    this.setData({
      draftMonthlySalary: this.data.monthlySalary,
      draftMorningStart: this.data.morningStart,
      draftMorningEnd: this.data.morningEnd,
      draftAfternoonStart: this.data.afternoonStart,
      draftAfternoonEnd: this.data.afternoonEnd,
      isEditingConfig: true,
      configStatus: '更新中'
    });
  },

  cancelConfigUpdate() {
    this.setData({
      isEditingConfig: false,
      configStatus: '已确认'
    });
  },

  onMonthlySalaryInput(event) {
    this.setData({
      draftMonthlySalary: event.detail.value
    });
  },

  toggleSalaryVisibility() {
    const isSalaryHidden = !this.data.isSalaryHidden;
    this.setData({ isSalaryHidden });
    wx.setStorageSync('workInspirationSalaryHidden', isSalaryHidden);
  },

  onConfigTimeChange(event) {
    const field = event.currentTarget.dataset.field;
    this.setData({
      [field]: event.detail.value
    });
  },

  confirmConfigUpdate() {
    const monthlySalary = Number(this.data.draftMonthlySalary);
    const morningStart = this.timeToSeconds(this.data.draftMorningStart);
    const morningEnd = this.timeToSeconds(this.data.draftMorningEnd);
    const afternoonStart = this.timeToSeconds(this.data.draftAfternoonStart);
    const afternoonEnd = this.timeToSeconds(this.data.draftAfternoonEnd);

    if (!Number.isFinite(monthlySalary) || monthlySalary <= 0) {
      wx.showToast({ title: '请输入正确的月薪', icon: 'none' });
      return;
    }

    if (!(morningStart < morningEnd && morningEnd <= afternoonStart && afternoonStart < afternoonEnd)) {
      wx.showToast({ title: '请检查上班时间', icon: 'none' });
      return;
    }

    const config = {
      monthlySalary: monthlySalary.toFixed(2).replace(/\.00$/, ''),
      morningStart: this.data.draftMorningStart,
      morningEnd: this.data.draftMorningEnd,
      afternoonStart: this.data.draftAfternoonStart,
      afternoonEnd: this.data.draftAfternoonEnd
    };

    this.setData({
      ...config,
      isEditingConfig: false,
      configStatus: '已确认'
    }, () => {
      wx.setStorageSync('workInspirationConfig', config);
      this.refreshIncomeRate();
      this.updateIncome();
      wx.showToast({ title: '配置已更新', icon: 'success' });
    });
  },

  triggerTwoSecondBonus() {
    const state = this.getWorkState();
    if (!state.isWorking) {
      this.setData({
        bonusPulse: false,
        isWorking: false,
        workStatus: state.workStatus
      });
      return;
    }

    this.setData({ bonusPulse: false }, () => {
      this.setData({ bonusPulse: true });
      clearTimeout(this.bonusPulseTimer);
      this.bonusPulseTimer = setTimeout(() => {
        this.setData({ bonusPulse: false });
      }, 1000);
    });
  },

  onBannerAdLoad() {
    console.log('Banner 广告加载成功');
  },

  onBannerAdError(event) {
    console.warn('Banner 广告加载失败', event.detail);
  },

  onBannerAdClose() {
    console.log('Banner 广告已关闭');
  },

  // 当前页面转发
  onShareAppMessage() {
    return {
      title: '上班鼓励器助手',
      path: '/pages/workInspiration/workInspiration'
    };
  },
  onShareTimeline() {
    return {
      title: '上班鼓励器助手',
      query: ''
    };
  }
});
