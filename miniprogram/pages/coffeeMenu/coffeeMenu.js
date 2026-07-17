Page({
  data: {
    statusBarHeight: 20,
    serviceMode: 0,
    activeMenuTab: 0,
    activeCategory: 0,
    serviceModes: ['自提', '外送'],
    menuTabs: ['经典菜单', '每周9.9起', '我的常点'],
    coupons: ['最高9.9元', '膨胀券', '9.9元商品兑换券', '更多优惠'],
    categories: [
      { icon: '🔥', title: '人气Top' },
      { badge: '绿沙沙☕', title: '当季新品' },
      { badge: '15:00开始', title: '买一送一' },
      { badge: '集杯免单', title: '9.9吨吨节' },
      { badge: '西班牙', title: '球迷专区' },
      { badge: '周边上新', title: '多邻国' },
      { title: '人气周边' },
      { title: '全冰去冰' },
      { title: '风味拿铁' },
      { badge: '乳酸菌', title: '美式家族' },
      { badge: '爆款', title: '小黄油系列' },
      { title: '冰茶冰奶' }
    ],
    products: [
      {
        image: '/images/coffee-menu-product-1.jpg',
        name: '生椰拿铁（首创）',
        badges: ['全球销量第一', '瑞幸专属生椰岛'],
        description: '每日限购1件｜12:00–17:00限时购',
        price: '10.5',
        originalPrice: '20'
      },
      {
        image: '/images/coffee-menu-product-2.jpg',
        name: '绿沙沙拿铁',
        badges: ['消暑爆品回归', 'IIAC金奖豆'],
        description: '清甜冰凉绿豆味，一杯舌头好乘凉',
        price: '9.9',
        originalPrice: '11.9'
      },
      {
        image: '/images/coffee-menu-product-3.jpg',
        name: '乳酸菌美式（含百亿活菌吸管）',
        badges: ['边喝边补益生菌', '热量仅约108大卡'],
        description: '搭配“神奇”吸管，畅享轻“腹”担',
        price: '11.9',
        originalPrice: '20'
      },
      {
        image: '/images/coffee-menu-product-4.jpg',
        name: '葡萄鲜切柠檬茶（超大杯）',
        badges: ['鲜果鲜切现榨', '撞打爆香'],
        description: '葡萄果肉挂满酸甜柠檬汁，清新鲜爽',
        price: '13.9',
        originalPrice: '21'
      }
    ],
    bottomTabs: [
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

  selectServiceMode(event) {
    this.setData({ serviceMode: Number(event.currentTarget.dataset.index) });
  },

  selectMenuTab(event) {
    this.setData({ activeMenuTab: Number(event.currentTarget.dataset.index) });
  },

  selectCategory(event) {
    this.setData({ activeCategory: Number(event.currentTarget.dataset.index) });
  },

  showSearch() {
    wx.showToast({ title: '搜索饮品', icon: 'none' });
  },

  showGroupOrder() {
    wx.showToast({ title: '发起拼单', icon: 'none' });
  },

  selectProduct(event) {
    const product = this.data.products[Number(event.currentTarget.dataset.index)];
    wx.showToast({ title: product ? product.name.slice(0, 8) : '选择规格', icon: 'none' });
  },

  switchBottomTab(event) {
    const tabIndex = Number(event.currentTarget.dataset.index);
    if (tabIndex === 0) {
      wx.navigateBack({
        delta: 1,
        fail: () => wx.redirectTo({ url: '/pages/coffeeHome/coffeeHome' })
      });
      return;
    }
    if (tabIndex !== 1) {
      wx.showToast({ title: this.data.bottomTabs[tabIndex].title, icon: 'none' });
    }
  }
});
