Page({
  data: {
    statusBarHeight: 20,
    activeTab: 0,
    primaryServices: [
      { icon: '☕', iconClass: 'icon-pickup', title: '到店取', subtitle: '下单即享优惠' },
      { icon: '⚡', iconClass: 'icon-delivery', title: '幸运送', subtitle: '美味快速送达' },
      { icon: '🥤', iconClass: 'icon-coffee', title: '即享咖啡', subtitle: '大师经典冻干' }
    ],
    secondaryServices: [
      { icon: '▤', title: '咖啡卡券', subtitle: '立享优惠' },
      { icon: '🎁', title: '礼品卡', subtitle: '送TA咖啡' },
      { icon: '♞', title: '领3张9.9', subtitle: '天天优惠', badge: '专享价' },
      { icon: '♧', title: '拼单满减', subtitle: '一起点更划算' }
    ],
    products: [
      { name: '生椰拿铁', price: '9.9', color: 'cup-blue' },
      { name: '橙C美式', price: '13.9', color: 'cup-orange' },
      { name: '酱香拿铁', price: '15.9', color: 'cup-brown' }
    ],
    tabs: [
      { icon: '⌂', title: '首页' },
      { icon: '▰', title: '菜单' },
      { icon: '▥', title: '即享' },
      { icon: '♛', title: '会员卡' },
      { icon: '♞', title: '我的' }
    ]
  },

  onLoad() {
    const windowInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
    this.setData({ statusBarHeight: windowInfo.statusBarHeight || 20 });
  },

  scanCode() {
    wx.scanCode({
      fail: () => {}
    });
  },

  openMember() {
    wx.showToast({ title: '会员中心', icon: 'none' });
  },

  showCampaign() {
    wx.showToast({ title: '活动详情', icon: 'none' });
  },

  tapService(event) {
    wx.showToast({ title: event.currentTarget.dataset.title, icon: 'none' });
  },

  showPromotion() {
    wx.showToast({ title: '优惠活动', icon: 'none' });
  },

  switchTab(event) {
    this.setData({ activeTab: Number(event.currentTarget.dataset.index) });
  }
});
