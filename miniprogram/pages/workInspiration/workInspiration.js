Page({
  data: {
    statusBarHeight: 20,
    clock: '08:30:56',
    salaryItems: ['0.0145', '0.0208', '0.0186', '0.0102', '0.0119', '0.0168']
  },

  onLoad() {
    const windowInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
    this.setData({ statusBarHeight: windowInfo.statusBarHeight || 20 });
    this.updateClock();
    this.clockTimer = setInterval(() => this.updateClock(), 1000);
  },

  onUnload() {
    clearInterval(this.clockTimer);
  },

  updateClock() {
    const now = new Date();
    const pad = (value) => String(value).padStart(2, '0');
    this.setData({
      clock: `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
    });
  }
});
