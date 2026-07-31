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
    workStatus: '未到上班时间',
    monthlySalary: '6600',
    morningStart: '09:00',
    morningEnd: '12:00',
    afternoonStart: '13:30',
    afternoonEnd: '18:00',
    draftMonthlySalary: '6600',
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
    this.setData({
      clock: `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
    });
  },

  timeToSeconds(value) {
    const [hours, minutes] = String(value).split(':').map(Number);
    return hours * 3600 + minutes * 60;
  },

  getDailyIncome() {
    return Number(this.data.monthlySalary || 0) / 22;
  },

  getWorkState(now = new Date()) {
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
      workStatus
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
  }
});
