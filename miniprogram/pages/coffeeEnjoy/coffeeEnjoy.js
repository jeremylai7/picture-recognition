Page({
  data: {
    statusBarHeight: 20,
    categories: [
      { title: '咖啡饮料', image: '/images/coffee-menu-product-4.jpg' },
      { title: '冻干咖啡', image: '/images/coffee-mall-product-2.jpg', badge: '新品' },
      { title: '咖啡液', image: '/images/coffee-mall-collab-1.jpg' },
      { title: '挂耳/胶囊', image: '/images/coffee-mall-product-3.jpg' },
      { title: '咖啡豆', image: '/images/coffee-mall-flash-2.jpg' }
    ],
    products: [
      {
        image: '/images/coffee-mall-collab-1.jpg',
        title: '【热销榜单No.1】瑞幸醇香/经典浓缩咖啡液 32杯/盒',
        tags: ['赠品'],
        priceLabel: '秒杀价',
        price: '64',
        sold: '已售卖95700+件'
      },
      {
        image: '/images/coffee-mall-collab-3.jpg',
        title: '大师经典冻干咖啡 大颗粒黑咖啡（独立条装18条/桶）',
        tags: ['满减', '赠品'],
        priceLabel: '预计到手价',
        price: '35.9',
        sold: '已售卖75700+件'
      },
      {
        image: '/images/coffee-mall-collab-2.jpg',
        title: '海绵宝宝联名 随享瓶系列瓶装饮料组合装',
        tags: ['限时立减', '赠品'],
        priceLabel: '预计到手',
        price: '85',
        sold: '已售卖6600+件'
      },
      {
        image: '/images/coffee-mall-flash-2.jpg',
        title: '冠军臻选系列咖啡豆 意式拼配咖啡豆',
        tags: ['首购立减3元'],
        priceLabel: '秒杀价',
        price: '69',
        sold: '已售卖4800+件'
      }
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

  openCategory(event) {
    const category = this.data.categories[Number(event.currentTarget.dataset.index)];
    wx.showToast({ title: category.title, icon: 'none' });
  },

  openCampaign(event) {
    wx.showToast({ title: event.currentTarget.dataset.title || '活动详情', icon: 'none' });
  },

  openProduct(event) {
    const product = this.data.products[Number(event.currentTarget.dataset.index)];
    wx.showToast({ title: product.title.slice(0, 10), icon: 'none' });
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
    if (tabIndex !== 2) wx.switchTab({ url: tabPaths[tabIndex] });
  }
});
