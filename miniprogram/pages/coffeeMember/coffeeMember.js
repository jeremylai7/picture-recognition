Page({
  data: {
    statusBarHeight: 20,
    selectedPlan: 0,
    agreementChecked: false,
    memberActive: false,
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

  onShow() {
    const membership = wx.getStorageSync('coffeeMembership');
    this.setData({ memberActive: Boolean(membership && membership.active) });
  },

  selectPlan(event) {
    this.setData({ selectedPlan: Number(event.currentTarget.dataset.index) });
  },

  toggleAgreement() {
    this.setData({ agreementChecked: !this.data.agreementChecked });
  },

  subscribe() {
    if (this.data.memberActive) {
      wx.showToast({ title: '瑞王卡权益已生效', icon: 'none' });
      return;
    }
    if (!this.data.agreementChecked) {
      wx.showToast({ title: '请先勾选会员服务协议', icon: 'none' });
      return;
    }
    const membership = {
      active: true,
      plan: this.data.selectedPlan === 0 ? '连续包月' : '月卡',
      price: this.data.selectedPlan === 0 ? '9.90' : '15.90',
      startedAt: Date.now()
    };
    wx.setStorageSync('coffeeMembership', membership);
    this.setData({ memberActive: true });
    wx.showModal({ title: '开通成功', content: `${membership.plan}权益已生效`, showCancel: false });
  },

  showAction(event) {
    wx.showToast({ title: event.currentTarget.dataset.title || '更多功能', icon: 'none' });
  },

  switchBottomTab(event) {
    const tabIndex = Number(event.currentTarget.dataset.index);
    const tabPaths = [
      '/pages/coffeeHome/coffeeHome',
      '/pages/coffeeMenu/coffeeMenu',
      '/pages/coffeeEnjoy/coffeeEnjoy',
      '/pages/coffeeMember/coffeeMember',
      '/pages/coffeeMy/coffeeMy'
    ];
    if (tabIndex !== 3) wx.switchTab({ url: tabPaths[tabIndex] });
  }
});
