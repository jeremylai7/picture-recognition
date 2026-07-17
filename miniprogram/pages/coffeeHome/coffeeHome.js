Page({
  data: {
    statusBarHeight: 20,
    activeTab: 0,
    activeMallCategory: 0,
    currentHero: 0,
    heroBanners: [
      { image: '/images/coffee-sports-hero.jpg' },
      { image: '/images/coffee-duolingo-hero-clean.jpg' }
    ],
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
    mallCategories: ['瑞幸即享', '联名限定', '限时秒杀'],
    mallProducts: [
      {
        image: '/images/coffee-mall-product-1.jpg',
        title: '【热销榜单No.1】瑞幸醇香/经典浓缩咖啡液 32杯/盒',
        tags: ['赠品'],
        priceLabel: '秒杀价',
        price: '64',
        handPrice: '64',
        sold: '已售卖763900+件',
        limit: '限购6件'
      },
      {
        image: '/images/coffee-mall-product-2.jpg',
        title: '【海绵宝宝联名】冷萃黑咖啡液/果C美式咖啡液36杯/组',
        tags: ['首购立减3元', '限时立减', '赠品'],
        priceLabel: '',
        price: '168',
        handPrice: '101',
        sold: '已售卖5100+件',
        limit: '限购5件'
      },
      {
        image: '/images/coffee-mall-product-3.jpg',
        title: '瑞幸大师经典冻干咖啡 大颗粒黑咖啡（新升级90g/瓶）',
        tags: ['限时立减', '满减', '赠品'],
        priceLabel: '',
        price: '59.9',
        handPrice: '54.9',
        sold: '已售卖75700+件',
        limit: '限购10件'
      },
      {
        image: '/images/coffee-mall-product-4.jpg',
        title: '【60杯囤货装】瑞幸元气弹2.0系列即溶咖啡（2.3g/杯）',
        tags: ['赠品'],
        priceLabel: '秒杀价',
        price: '169',
        handPrice: '169',
        sold: '已售卖117400+件',
        limit: ''
      }
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

  changeHero(event) {
    this.setData({ currentHero: event.detail.current });
  },

  tapService(event) {
    wx.showToast({ title: event.currentTarget.dataset.title, icon: 'none' });
  },

  showPromotion() {
    wx.showToast({ title: '优惠活动', icon: 'none' });
  },

  switchMallCategory(event) {
    this.setData({ activeMallCategory: Number(event.currentTarget.dataset.index) });
  },

  openMallProduct(event) {
    const product = this.data.mallProducts[Number(event.currentTarget.dataset.index)];
    wx.showToast({ title: product ? product.title.slice(0, 10) : '商品详情', icon: 'none' });
  },

  openMallMore() {
    wx.showToast({ title: '更多即享商品', icon: 'none' });
  },

  switchTab(event) {
    this.setData({ activeTab: Number(event.currentTarget.dataset.index) });
  }
});
