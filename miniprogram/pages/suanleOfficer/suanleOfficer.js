const STORAGE_KEY = 'suanleOfficerStats';

Page({
  data: {
    statusBarHeight: 20,
    navigationHeight: 44,
    topSpacerHeight: 36,
    currentStep: 0,
    hasStarted: false,
    loopCount: 0,
    saidCount: 0,
    autoLoop: false,
    steps: [
      {
        text: '你有驾照吗？',
        position: 'step-top',
        role: 'officer',
        audio: '/audio/suanle-officer/ni-you-jiazhao-ma.mp3',
        image: '/images/suanle-officer/officer.png'
      },
      {
        text: '有有有',
        position: 'step-right',
        role: 'driver',
        audio:'/audio/suanle-officer/you-you.mp3',
        image: '/images/suanle-officer/driver-1.png'
      },
      {
        text: '请出示你的驾照',
        position: 'step-bottom',
        role: 'officer',
        audio:'/audio/suanle-officer/qing-chu-shi-jiazhao.mp3',
        image: '/images/suanle-officer/officer.png'
      },
      {
        text: '算了嘛警官',
        position: 'step-left',
        role: 'driver',
        audio: '/audio/suanle-officer/suanle-ma-jingguan.mp3',
        image: '/images/suanle-officer/driver-2.png'
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
    // 用户主动点击台词时，iPhone 静音模式下也允许播放。
    wx.setInnerAudioOption({
      obeyMuteSwitch: false,
      fail(error) {
        console.warn('设置音频播放选项失败', error);
      }
    });

    if (this.data.autoLoop) {
      this.startAutoLoop();
    }
  },

  onHide() {
    this.stopAutoLoop();
    this.stopStepAudio();
  },

  onUnload() {
    this.stopAutoLoop();
    if (this.stepAudio) {
      this.stepAudio.destroy();
      this.stepAudio = null;
    }
  },

  advanceStep() {
    const nextStep = this.data.hasStarted
      ? (this.data.currentStep + 1) % this.data.steps.length
      : 0;
    const completedLoop = this.data.hasStarted && nextStep === 0;
    this.activateStep(nextStep, completedLoop);
  },

  onStepTap(event) {
    const index = Number(event.currentTarget.dataset.index);
    if (!Number.isInteger(index) || index < 0 || index >= this.data.steps.length) return;
    this.activateStep(index);
    if (this.data.autoLoop) this.startAutoLoop();
  },

  activateStep(nextStep, completedLoop = false) {
    const loopCount = this.data.loopCount + (completedLoop ? 1 : 0);
    const saidCount = this.data.saidCount + (nextStep === 3 ? 1 : 0);

    this.setData({
      currentStep: nextStep,
      hasStarted: true,
      loopCount,
      saidCount
    });
    this.playStepAudio(nextStep);

    wx.setStorageSync(STORAGE_KEY, { loopCount, saidCount });
  },

  playStepAudio(stepIndex) {
    this.stopStepAudio();
    const step = this.data.steps[stepIndex];
    if (!step || !step.audio) return;

    if (!this.stepAudio) {
      this.stepAudio = wx.createInnerAudioContext();
      this.stepAudio.onError((error) => {
        console.warn('台词音频播放失败', error);
        wx.showToast({ title: '音频播放失败，请重试', icon: 'none' });
      });
    }
    this.stepAudio.src = step.audio;
    this.stepAudio.play();
  },

  stopStepAudio() {
    if (this.stepAudio) this.stepAudio.stop();
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
    this.stopStepAudio();
    this.setData({
      currentStep: 0,
      hasStarted: false,
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
