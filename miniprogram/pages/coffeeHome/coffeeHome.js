const luckyMallProducts = [
  {
    image: '/images/coffee-mall-product-1.jpg',
    countdownDays: 3,
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
    countdownDays: 5,
    title: '【60杯囤货装】瑞幸元气弹2.0系列即溶咖啡（2.3g/杯）',
    tags: ['赠品'],
    priceLabel: '秒杀价',
    price: '169',
    handPrice: '169',
    sold: '已售卖117400+件',
    limit: ''
  }
];

const collabMallProducts = [
  {
    image: '/images/coffee-mall-collab-1.jpg',
    title: '【海绵宝宝联名】瑞幸醇香/经典浓缩咖啡液 32杯/盒',
    tags: ['限时立减', '赠品'],
    priceLabel: '',
    price: '99',
    handPrice: '64',
    sold: '已售卖95700+件',
    limit: '限购10件'
  },
  {
    image: '/images/coffee-mall-collab-2.jpg',
    title: '【海绵宝宝联名】随享瓶系列 瓶装饮料300mL×15瓶/箱',
    tags: ['限时立减', '赠品'],
    priceLabel: '',
    price: '95',
    handPrice: '85',
    sold: '已售卖6600+件',
    limit: '限购10件'
  },
  {
    image: '/images/coffee-mall-collab-3.jpg',
    title: '【海绵宝宝联名】大师经典冻干咖啡 大颗粒黑咖啡',
    tags: ['限时立减', '满减', '赠品'],
    priceLabel: '',
    price: '59.9',
    handPrice: '54.9',
    sold: '已售卖75700+件',
    limit: '限购10件'
  },
  {
    image: '/images/coffee-mall-collab-4.jpg',
    title: '【海绵宝宝联名】绵白拿铁经典原味（多种规格可选）',
    tags: ['首购立减8元', '限时立减'],
    priceLabel: '',
    price: '107.7',
    handPrice: '99.7',
    sold: '已售卖3400+件',
    limit: '限购10件'
  }
];

const flashMallProducts = [
  {
    image: '/images/coffee-mall-flash-1.jpg',
    countdownDays: 3,
    title: '【热销榜单No.1】瑞幸醇香/经典浓缩咖啡液 32杯/盒',
    tags: ['赠品'],
    priceLabel: '秒杀价',
    price: '64',
    handPrice: '64',
    sold: '已售卖764000+件',
    limit: '限购6件'
  },
  {
    image: '/images/coffee-mall-flash-2.jpg',
    countdownDays: 14,
    title: '【冠军臻选系列咖啡豆】意式拼配咖啡豆/埃塞·西达摩咖啡豆',
    tags: ['首购立减3元'],
    priceLabel: '秒杀价',
    price: '69',
    handPrice: '66',
    sold: '已售卖4800+件',
    limit: '限购10件'
  },
  {
    image: '/images/coffee-mall-flash-3.jpg',
    countdownDays: 4,
    title: '【60杯囤货装】瑞幸元气弹2.0系列即溶咖啡（2.3g/杯）',
    tags: ['赠品'],
    priceLabel: '秒杀价',
    price: '169',
    handPrice: '169',
    sold: '已售卖117400+件',
    limit: '限购10件'
  },
  {
    image: '/images/coffee-mall-flash-4.jpg',
    countdownDays: 12,
    title: '【看球必备】随享瓶系列瓶装饮料300mL×3瓶（3种口味）',
    tags: ['返券'],
    priceLabel: '秒杀价',
    price: '18.9',
    handPrice: '18.9',
    sold: '已售卖26000+件',
    limit: '限购10件'
  }
];

const mallProductGroups = [luckyMallProducts, collabMallProducts, flashMallProducts];

function padTime(value) {
  return value < 10 ? `0${value}` : String(value);
}

function formatCountdown(totalSeconds) {
  const safeSeconds = Math.max(0, totalSeconds);
  const days = Math.floor(safeSeconds / 86400);
  const hours = Math.floor((safeSeconds % 86400) / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;
  return `${days}天${padTime(hours)}:${padTime(minutes)}:${padTime(seconds)}`;
}

function initializeCountdowns() {
  const usedSeconds = new Set();

  mallProductGroups.forEach((products) => {
    products.forEach((product) => {
      if (!product.countdownDays) return;

      let countdownSeconds;
      do {
        countdownSeconds = product.countdownDays * 86400 + Math.floor(Math.random() * 86400);
      } while (usedSeconds.has(countdownSeconds));

      usedSeconds.add(countdownSeconds);
      product.countdownSeconds = countdownSeconds;
      product.countdown = formatCountdown(countdownSeconds);
    });
  });
}

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
    mallProducts: luckyMallProducts,
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
    initializeCountdowns();
    this.refreshMallProducts();
    this.mallCountdownTimer = setInterval(() => this.tickMallCountdowns(), 1000);
  },

  onUnload() {
    if (this.mallCountdownTimer) {
      clearInterval(this.mallCountdownTimer);
      this.mallCountdownTimer = null;
    }
  },

  tickMallCountdowns() {
    mallProductGroups.forEach((products) => {
      products.forEach((product) => {
        if (typeof product.countdownSeconds !== 'number') return;
        product.countdownSeconds = Math.max(0, product.countdownSeconds - 1);
        product.countdown = formatCountdown(product.countdownSeconds);
      });
    });
    this.refreshMallProducts();
  },

  refreshMallProducts() {
    const products = mallProductGroups[this.data.activeMallCategory] || [];
    this.setData({ mallProducts: products.map((product) => Object.assign({}, product)) });
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
    const title = event.currentTarget.dataset.title;
    if (title === '到店取') {
      wx.switchTab({ url: '/pages/coffeeMenu/coffeeMenu' });
      return;
    }
    if (title === '即享咖啡') {
      wx.switchTab({ url: '/pages/coffeeEnjoy/coffeeEnjoy' });
      return;
    }
    wx.showToast({ title, icon: 'none' });
  },

  showPromotion() {
    wx.showToast({ title: '优惠活动', icon: 'none' });
  },

  switchMallCategory(event) {
    const categoryIndex = Number(event.currentTarget.dataset.index);
    this.setData({
      activeMallCategory: categoryIndex,
      mallProducts: (mallProductGroups[categoryIndex] || []).map((product) => Object.assign({}, product))
    });
  },

  openMallProduct(event) {
    const product = this.data.mallProducts[Number(event.currentTarget.dataset.index)];
    wx.showToast({ title: product ? product.title.slice(0, 10) : '商品详情', icon: 'none' });
  },

  openMallMore() {
    wx.showToast({ title: '更多即享商品', icon: 'none' });
  },

  switchTab(event) {
    const tabIndex = Number(event.currentTarget.dataset.index);
    const tabPaths = [
      '/pages/coffeeHome/coffeeHome',
      '/pages/coffeeMenu/coffeeMenu',
      '/pages/coffeeEnjoy/coffeeEnjoy',
      '/pages/coffeeMember/coffeeMember',
      '/pages/coffeeMy/coffeeMy'
    ];
    if (tabIndex !== 0) wx.switchTab({ url: tabPaths[tabIndex] });
  }
});
