Page({
  data: {
    statusBarHeight: 20,
    assets: [
      { value: '15', unit: '张', title: '优惠券', badge: '即将过期' },
      { value: '0', unit: '张', title: '咖啡卡券' },
      { value: '0', unit: '张', title: '好运卡' },
      { value: '0', unit: '元', title: '余额' }
    ],
    functions: [
      { icon: '▱', title: '招商加盟' },
      { icon: '◇', title: '租赁合作' },
      { icon: '♧', title: '兑换优惠' },
      { icon: '▣', title: '礼品卡' },
      { icon: '▢', title: '口味定制' }
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

  showAction(event) {
    wx.showToast({ title: event.currentTarget.dataset.title || '功能建设中', icon: 'none' });
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
    if (tabIndex !== 4) wx.switchTab({ url: tabPaths[tabIndex] });
  }
});
