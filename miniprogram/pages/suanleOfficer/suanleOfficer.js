const STORAGE_KEY = 'suanleOfficerStats';

Page({
  data: {
    statusBarHeight: 20,
    navigationHeight: 44,
    topSpacerHeight: 36,
    currentStep: 0,
    loopCount: 0,
    saidCount: 0,
    autoLoop: false,
    steps: [
      {
        text: '你有驾照吗？',
        position: 'step-top',
        role: 'officer',
        image: '/images/suanle-officer/officer.png'
      },
      {
        text: '有有有',
        position: 'step-right',
        role: 'driver',
        image: '/images/suanle-officer/driver.png'
      },
      {
        text: '请出示你的驾照',
        position: 'step-bottom',
        role: 'officer',
        image: '/images/suanle-officer/officer.png'
      },
      {
        text: '算了嘛警官',
        position: 'step-left',
        role: 'driver',
        image: '/images/suanle-officer/driver.png'
      }
    ]
  },

  onLoad() {
    const windowInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
    const menuButton = wx.getMenuButtonBoundingClientRect
      ? wx.getMenuButtonBoundingClientRect()
      : null;
    const statusBarHeight = windowInfo.statusBarHeight || 20;
    const navigationHeight = menuButton
      ? (menuButton.top - statusBarHeight) * 2 + menuButton.height
      : 44;
    const stats = wx.getStorageSync(STORAGE_KEY) || {};

    this.setData({
      statusBarHeight,
      navigationHeight,
      topSpacerHeight: statusBarHeight + 16,
      loopCount: Number(stats.loopCount) || 0,
      saidCount: Number(stats.saidCount) || 0
    });

    wx.showShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  onShow() {
    if (this.data.autoLoop) {
      this.startAutoLoop();
    }
  },

  onHide() {
    this.stopAutoLoop();
  },

  onUnload() {
    this.stopAutoLoop();
  },

  advanceStep() {
    const nextStep = (this.data.currentStep + 1) % this.data.steps.length;
    const loopCount = this.data.loopCount + (nextStep === 0 ? 1 : 0);
    const saidCount = this.data.saidCount + (nextStep === 3 ? 1 : 0);

    this.setData({
      currentStep: nextStep,
      loopCount,
      saidCount
    });

    wx.setStorageSync(STORAGE_KEY, { loopCount, saidCount });
  },

  toggleAutoLoop() {
    const autoLoop = !this.data.autoLoop;
    this.setData({ autoLoop });

    if (autoLoop) {
      this.startAutoLoop();
      return;
    }
    this.stopAutoLoop();
  },

  startAutoLoop() {
    this.stopAutoLoop();
    this.autoLoopTimer = setInterval(() => {
      this.advanceStep();
    }, 1600);
  },

  stopAutoLoop() {
    if (this.autoLoopTimer) {
      clearInterval(this.autoLoopTimer);
      this.autoLoopTimer = null;
    }
  },

  resetStats() {
    this.setData({
      currentStep: 0,
      loopCount: 0,
      saidCount: 0
    });
    wx.removeStorageSync(STORAGE_KEY);
    wx.showToast({ title: '已重新开始', icon: 'none' });
  },

  onShareAppMessage() {
    return {
      title: '算了嘛警官 · 一段永远循环的对话',
      path: '/pages/suanleOfficer/suanleOfficer'
    };
  },

  onShareTimeline() {
    return {
      title: '算了嘛警官 · 一段永远循环的对话'
    };
  }
});
