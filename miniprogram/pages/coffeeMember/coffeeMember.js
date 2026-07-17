Page({
  data: {
    statusBarHeight: 20,
    selectedPlan: 0,
    agreementChecked: false,
    drinks: [
      { name: '小青桔C美式', image: '/images/coffee-menu-product-4.jpg' },
      { name: '标准美式', image: '/images/coffee-menu-product-3.jpg' },
      { name: '拿铁', image: '/images/coffee-menu-product-1.jpg' }
    ],
    bottomTabs: [
      { icon: '⌂', title: '首页' },
      { icon: '▰', title: '菜单' },
      { icon: '▮', title: '即享' },
      { icon: '♛', title: '会员卡' },
      { icon: '♟', title: '我的' }
    ]
  },

  onLoad() {
    const windowInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
    this.setData({ statusBarHeight: windowInfo.statusBarHeight || 20 });
  },

  selectPlan(event) {
    this.setData({ selectedPlan: Number(event.currentTarget.dataset.index) });
  },

  toggleAgreement() {
    this.setData({ agreementChecked: !this.data.agreementChecked });
  },

  subscribe() {
    if (!this.data.agreementChecked) {
      wx.showToast({ title: '请先勾选会员服务协议', icon: 'none' });
      return;
    }
    wx.showToast({ title: '开通连续包月', icon: 'none' });
  },

  showAction(event) {
    wx.showToast({ title: event.currentTarget.dataset.title || '更多功能', icon: 'none' });
  },

  switchBottomTab(event) {
    const tabIndex = Number(event.currentTarget.dataset.index);
    if (tabIndex === 0) {
      wx.redirectTo({ url: '/pages/coffeeHome/coffeeHome' });
      return;
    }
    if (tabIndex === 1) {
      wx.redirectTo({ url: '/pages/coffeeMenu/coffeeMenu' });
      return;
    }
    if (tabIndex === 2) {
      wx.redirectTo({ url: '/pages/coffeeEnjoy/coffeeEnjoy' });
      return;
    }
    if (tabIndex === 4) {
      wx.redirectTo({ url: '/pages/coffeeMy/coffeeMy' });
    }
  }
});
