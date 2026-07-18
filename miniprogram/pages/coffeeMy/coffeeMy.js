Page({
  data: {
    statusBarHeight: 20,
    lastOrderName: '生椰拿铁（首创）',
    lastOrderStatus: '再来一单',
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

  onShow() {
    const order = wx.getStorageSync('coffeeLastOrder');
    if (order && order.products && order.products.length) {
      this.setData({
        lastOrderName: order.products[0].name,
        lastOrderStatus: order.status || '再来一单'
      });
    }
  },

  showAction(event) {
    const title = event.currentTarget.dataset.title || '功能建设中';
    if (title === '我的订单') {
      const order = wx.getStorageSync('coffeeLastOrder');
      if (!order || !order.products || !order.products.length) {
        wx.showToast({ title: '暂无订单', icon: 'none' });
        return;
      }
      const productText = order.products.map((item) => `${item.name}×${item.quantity}`).join('、');
      wx.showModal({
        title: `${order.serviceMode}订单 · ${order.status}`,
        content: `${productText}\n合计 ¥${order.total}\n${order.store}`,
        showCancel: false
      });
      return;
    }
    if (title === '设置') {
      wx.showActionSheet({ itemList: ['账户与安全', '隐私设置', '消息通知', '关于瑞幸'] });
      return;
    }
    wx.showToast({ title, icon: 'none' });
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
