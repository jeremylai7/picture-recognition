Page({
  data: {
    statusBarHeight: 20,
    windowWidth: 375,
    capsuleTop: 24,
    capsuleLeft: 280,
    capsuleHeight: 32,
    serviceMode: 0,
    currentStore: 'IBC MALL B1层店',
    activeMenuTab: 0,
    activeCategory: 0,
    searchVisible: false,
    searchKeyword: '',
    specVisible: false,
    selectedProductIndex: -1,
    selectedCup: '特大杯',
    selectedTemperature: '热',
    selectedBean: '意式拼配',
    selectedConcentration: '默认浓度',
    selectedSugar: '少少甜',
    selectedIce: '正常冰',
    specQuantity: 1,
    specTotal: '0.0',
    specDiscount: '0.0',
    cupOptions: [
      { label: '大杯', subtitle: '约450ml', extra: 0 },
      { label: '特大杯', subtitle: '约553ml', extra: 3, badge: '购买过' }
    ],
    temperatureOptions: ['冰', '热'],
    beanOptions: [
      { label: '意式拼配', subtitle: '坚果基调 香醇口感', badge: 'IIAC金奖' },
      { label: '深烘拼配', subtitle: '黑巧尾韵 浓郁口感', badge: '咖啡更浓' },
      { label: '埃塞金烘', subtitle: '花香可可 浓醇口感', badge: 'IIAC铂金' }
    ],
    concentrationOptions: [
      { label: '默认浓度', extra: 0 },
      { label: '加单份浓缩', extra: 3 }
    ],
    sugarOptions: [
      { label: '标准甜' },
      { label: '少甜' },
      { label: '少少甜' },
      { label: '微甜' },
      { label: '不另外加糖', badge: '推荐' }
    ],
    iceOptions: ['去冰', '少冰', '正常冰'],
    addons: [
      { name: '黑巧贝果', image: '/images/coffee-addon-bagel.jpg', price: 3.9, originalPrice: 6, quantity: 0 },
      { name: '蛋香鸡肉恰巴塔', image: '/images/coffee-addon-sandwich.jpg', price: 7.9, originalPrice: 11, quantity: 0 },
      { name: '黄油餐包', image: '/images/coffee-addon-bun.jpg', price: 3.9, originalPrice: 8, quantity: 0 }
    ],
    cartCount: 0,
    cartTotal: '0.0',
    cartItems: [],
    checkoutVisible: false,
    specTouchStartY: 0,
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
    const capsule = wx.getMenuButtonBoundingClientRect
      ? wx.getMenuButtonBoundingClientRect()
      : { top: (windowInfo.statusBarHeight || 20) + 7, left: (windowInfo.windowWidth || 375) - 96, height: 32 };
    this.setData({
      statusBarHeight: windowInfo.statusBarHeight || 20,
      windowWidth: windowInfo.windowWidth || 375,
      capsuleTop: capsule.top,
      capsuleLeft: capsule.left,
      capsuleHeight: capsule.height
    });
    this.restoreMenuState();
  },

  onShow() {
    this.restoreMenuState();
  },

  restoreMenuState() {
    const serviceMode = Number(wx.getStorageSync('coffeeServiceMode') || 0);
    const savedCart = wx.getStorageSync('coffeeCart') || [];
    const savedItems = {};
    savedCart.forEach((item) => { savedItems[item.name] = item; });
    const products = this.data.products.map((product) => Object.assign({}, product, {
      quantity: savedItems[product.name] ? Number(savedItems[product.name].quantity || 0) : Number(product.quantity || 0),
      configuredPrice: savedItems[product.name] ? Number(savedItems[product.name].configuredPrice || product.price) : product.configuredPrice,
      configuredSpecs: savedItems[product.name] ? savedItems[product.name].configuredSpecs : product.configuredSpecs,
      addons: savedItems[product.name] ? savedItems[product.name].addons : product.addons,
      addonTotal: savedItems[product.name] ? Number(savedItems[product.name].addonTotal || 0) : Number(product.addonTotal || 0)
    }));
    this.setData({ serviceMode, products }, () => this.recalculateCart(false));
  },

  selectServiceMode(event) {
    const serviceMode = Number(event.currentTarget.dataset.index);
    wx.setStorageSync('coffeeServiceMode', serviceMode);
    this.setData({ serviceMode });
  },

  selectMenuTab(event) {
    this.setData({ activeMenuTab: Number(event.currentTarget.dataset.index) });
  },

  selectCategory(event) {
    this.setData({ activeCategory: Number(event.currentTarget.dataset.index) });
  },

  showSearch() {
    this.setData({ searchVisible: true, searchKeyword: '' });
  },

  showGroupOrder() {
    wx.showShareMenu({ menus: ['shareAppMessage'] });
    wx.showModal({
      title: '好友拼单',
      content: '拼单已创建，可点击右上角分享给微信好友一起点单。',
      showCancel: false
    });
  },

  chooseStore() {
    const isDelivery = this.data.serviceMode === 1;
    const choices = isDelivery
      ? ['公司前台（默认地址）', 'IBC MALL 西门', '新增配送地址']
      : ['IBC MALL B1层店 · 60m', '卓悦中心店 · 480m', '会展中心店 · 1.2km'];
    wx.showActionSheet({
      itemList: choices,
      success: (result) => {
        const value = choices[result.tapIndex].split(' · ')[0];
        this.setData({ currentStore: value });
      }
    });
  },

  closeSearch() {
    this.setData({ searchVisible: false });
  },

  inputSearch(event) {
    this.setData({ searchKeyword: event.detail.value.trim() });
  },

  confirmSearch() {
    const keyword = this.data.searchKeyword;
    if (!keyword) return;
    const productIndex = this.data.products.findIndex((product) => product.name.indexOf(keyword) >= 0);
    if (productIndex < 0) {
      wx.showToast({ title: '暂未找到相关饮品', icon: 'none' });
      return;
    }
    this.setData({ searchVisible: false, selectedProductIndex: productIndex }, () => {
      this.openSpecification(productIndex);
    });
  },

  selectProduct(event) {
    this.openSpecification(Number(event.currentTarget.dataset.index));
  },

  openSpecification(productIndex) {
    if (!this.data.products[productIndex]) return;
    this.setData({
      specVisible: true,
      selectedProductIndex: productIndex,
      selectedCup: '特大杯',
      selectedTemperature: '热',
      selectedBean: '意式拼配',
      selectedConcentration: '默认浓度',
      selectedSugar: '少少甜',
      selectedIce: '正常冰',
      specQuantity: 1,
      addons: this.data.addons.map((item) => Object.assign({}, item, { quantity: 0 }))
    }, () => this.updateSpecTotal());
  },

  closeSpecification() {
    this.setData({ specVisible: false });
  },

  stopPropagation() {},

  specTouchStart(event) {
    const touch = event.touches && event.touches[0];
    if (touch) this.setData({ specTouchStartY: touch.clientY });
  },

  specTouchEnd(event) {
    const touch = event.changedTouches && event.changedTouches[0];
    if (!touch) return;
    if (touch.clientY - this.data.specTouchStartY > 55) {
      this.closeSpecification();
    }
  },

  selectTemperature(event) {
    this.setData({ selectedTemperature: event.currentTarget.dataset.value }, () => this.updateSpecTotal());
  },

  selectCup(event) {
    this.setData({ selectedCup: event.currentTarget.dataset.value }, () => this.updateSpecTotal());
  },

  selectBean(event) {
    this.setData({ selectedBean: event.currentTarget.dataset.value });
  },

  selectConcentration(event) {
    this.setData({ selectedConcentration: event.currentTarget.dataset.value }, () => this.updateSpecTotal());
  },

  selectSugar(event) {
    this.setData({ selectedSugar: event.currentTarget.dataset.value });
  },

  selectIce(event) {
    this.setData({ selectedIce: event.currentTarget.dataset.value });
  },

  increaseSpecQuantity() {
    this.setData({ specQuantity: this.data.specQuantity + 1 }, () => this.updateSpecTotal());
  },

  decreaseSpecQuantity() {
    this.setData({ specQuantity: Math.max(1, this.data.specQuantity - 1) }, () => this.updateSpecTotal());
  },

  increaseAddon(event) {
    const addonIndex = Number(event.currentTarget.dataset.index);
    const quantity = Number(this.data.addons[addonIndex].quantity || 0) + 1;
    this.setData({ [`addons[${addonIndex}].quantity`]: quantity }, () => this.updateSpecTotal());
  },

  decreaseAddon(event) {
    const addonIndex = Number(event.currentTarget.dataset.index);
    const quantity = Math.max(0, Number(this.data.addons[addonIndex].quantity || 0) - 1);
    this.setData({ [`addons[${addonIndex}].quantity`]: quantity }, () => this.updateSpecTotal());
  },

  updateSpecTotal() {
    const product = this.data.products[this.data.selectedProductIndex];
    if (!product) return;
    const cup = this.data.cupOptions.find((item) => item.label === this.data.selectedCup);
    const concentration = this.data.concentrationOptions.find((item) => item.label === this.data.selectedConcentration);
    const drinkUnitPrice = Number(product.price) + Number(cup ? cup.extra : 0) + Number(concentration ? concentration.extra : 0);
    const addonTotal = this.data.addons.reduce((total, item) => total + Number(item.price) * Number(item.quantity || 0), 0);
    const specTotal = drinkUnitPrice * this.data.specQuantity + addonTotal;
    const specDiscount = Math.max(0, Number(product.originalPrice) * this.data.specQuantity - Number(product.price) * this.data.specQuantity);
    this.setData({ specTotal: specTotal.toFixed(1), specDiscount: specDiscount.toFixed(1) });
  },

  confirmSpecification() {
    this.addConfiguredProduct(false);
  },

  submitSpecification() {
    this.addConfiguredProduct(true);
  },

  addConfiguredProduct(openCheckout) {
    const productIndex = this.data.selectedProductIndex;
    const product = this.data.products[productIndex];
    if (!product) return;
    const quantity = Number(product.quantity || 0) + this.data.specQuantity;
    const cup = this.data.cupOptions.find((item) => item.label === this.data.selectedCup);
    const concentration = this.data.concentrationOptions.find((item) => item.label === this.data.selectedConcentration);
    const configuredPrice = Number(product.price) + Number(cup ? cup.extra : 0) + Number(concentration ? concentration.extra : 0);
    const selectedAddons = this.data.addons.filter((item) => Number(item.quantity || 0) > 0).map((item) => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }));
    const addonTotal = selectedAddons.reduce((total, item) => total + Number(item.price) * Number(item.quantity), 0);
    const configuredSpecs = `${this.data.selectedCup} · ${this.data.selectedTemperature} · ${this.data.selectedBean} · ${this.data.selectedConcentration} · ${this.data.selectedSugar}`;
    this.setData({
      [`products[${productIndex}].quantity`]: quantity,
      [`products[${productIndex}].configuredPrice`]: configuredPrice,
      [`products[${productIndex}].configuredSpecs`]: configuredSpecs,
      [`products[${productIndex}].addons`]: selectedAddons,
      [`products[${productIndex}].addonTotal`]: addonTotal,
      specVisible: false
    }, () => {
      this.recalculateCart(true);
      if (openCheckout) this.setData({ checkoutVisible: true });
    });
  },

  increaseQuantity(event) {
    this.changeQuantity(Number(event.currentTarget.dataset.index), 1);
  },

  decreaseQuantity(event) {
    this.changeQuantity(Number(event.currentTarget.dataset.index), -1);
  },

  changeQuantity(productIndex, delta) {
    const product = this.data.products[productIndex];
    if (!product) return;
    const quantity = Math.max(0, Number(product.quantity || 0) + delta);
    this.setData({ [`products[${productIndex}].quantity`]: quantity }, () => this.recalculateCart(true));
  },

  recalculateCart(persist) {
    const cart = this.data.products
      .filter((product) => Number(product.quantity || 0) > 0)
      .map((product) => ({
        name: product.name,
        image: product.image,
        price: product.price,
        configuredPrice: Number(product.configuredPrice || product.price),
        configuredSpecs: product.configuredSpecs || '',
        addons: product.addons || [],
        addonTotal: Number(product.addonTotal || 0),
        quantity: Number(product.quantity),
        lineTotal: Number(product.configuredPrice || product.price) * Number(product.quantity) + Number(product.addonTotal || 0)
      }));
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cart.reduce((total, item) => total + Number(item.lineTotal), 0).toFixed(1);
    this.setData({ cartCount, cartTotal, cartItems: cart });
    if (persist) wx.setStorageSync('coffeeCart', cart);
  },

  openCheckout() {
    if (this.data.cartCount > 0) this.setData({ checkoutVisible: true });
  },

  closeCheckout() {
    this.setData({ checkoutVisible: false });
  },

  submitOrder() {
    const orderProducts = this.data.products.filter((product) => Number(product.quantity || 0) > 0);
    if (!orderProducts.length) return;
    const order = {
      id: `LK${Date.now()}`,
      serviceMode: this.data.serviceModes[this.data.serviceMode],
      store: this.data.currentStore,
      products: orderProducts.map((product) => ({ name: product.name, quantity: product.quantity })),
      total: this.data.cartTotal,
      createdAt: Date.now(),
      status: this.data.serviceMode === 0 ? '制作中' : '待配送'
    };
    wx.setStorageSync('coffeeLastOrder', order);
    wx.setStorageSync('coffeeCart', []);
    const products = this.data.products.map((product) => Object.assign({}, product, { quantity: 0 }));
    this.setData({ products, cartCount: 0, cartTotal: '0.0', cartItems: [], checkoutVisible: false });
    wx.showModal({
      title: '下单成功',
      content: `${order.serviceMode}订单已提交，订单号 ${order.id.slice(-8)}`,
      showCancel: false
    });
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
    if (tabIndex !== 1) wx.switchTab({ url: tabPaths[tabIndex] });
  }
});
