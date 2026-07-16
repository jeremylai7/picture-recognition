const MAX_ATTACHMENTS = 30;
const ALLOWED_FILE_EXTENSIONS = ['pdf', 'xls', 'xlsx'];

Page({
  data: {
    images: [
      { id: 'sample-1', path: '/images/order-jewelry-sample.svg', name: '首饰参考图1' },
      { id: 'sample-2', path: '/images/order-jewelry-sample.svg', name: '首饰参考图2' },
      { id: 'sample-3', path: '/images/order-jewelry-sample.svg', name: '首饰参考图3' },
      { id: 'sample-4', path: '/images/order-jewelry-sample.svg', name: '首饰参考图4' }
    ],
    files: [
      { id: 'sample-pdf', name: '资料名称资料.pdf', path: '', extension: 'pdf', sizeText: '219.8KB' },
      { id: 'sample-xls', name: '资料名称资料.xls', path: '', extension: 'xls', sizeText: '219.8KB' }
    ],
    attachmentCount: 6,
    selectedStores: [
      { id: '88845-136', name: '88845/兰州英海特黄金珠宝罗湖136店' },
      { id: '22231-12', name: '22231/兰州英海特黄金珠宝罗湖12店' },
      { id: '36563-23', name: '36563/兰州英海特黄金珠宝罗湖23店' }
    ],
    selectedStoreCount: 3,
    draftStoreCount: 3,
    storeSelectorVisible: false,
    storeOptions: [
      { id: '10017-1', name: '10017/兰州英海特黄金珠宝罗湖1店', selected: false },
      { id: '88845-136', name: '88845/兰州英海特黄金珠宝罗湖136店', selected: true },
      { id: '32456-7', name: '32456/兰州英海特黄金珠宝罗湖7店', selected: false },
      { id: '10001-8', name: '10001/兰州英海特黄金珠宝罗湖8店', selected: false },
      { id: '22231-12', name: '22231/兰州英海特黄金珠宝罗湖12店', selected: true },
      { id: '36563-23', name: '36563/兰州英海特黄金珠宝罗湖23店', selected: true },
      { id: '10017-88', name: '10017/兰州英海特黄金珠宝罗湖88店', selected: false },
      { id: '45887-98', name: '45887/兰州英海特黄金珠宝罗湖98店', selected: false },
      { id: '32456-45', name: '32456/兰州英海特黄金珠宝罗湖45店', selected: false }
    ],
    remark: '尽快配货，加急！客户输入的备注展示在此处',
    contactName: '施逸凡',
    contactPhone: '18844551122',
    submitting: false
  },

  chooseImages() {
    const remaining = MAX_ATTACHMENTS - this.data.attachmentCount;
    if (!remaining) {
      this.showLimitToast();
      return;
    }

    wx.chooseMedia({
      count: Math.min(remaining, 9),
      mediaType: ['image'],
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const timestamp = Date.now();
        const images = this.data.images.concat(res.tempFiles.map((file, index) => ({
          id: `image-${timestamp}-${index}`,
          path: file.tempFilePath,
          name: `上传图片${index + 1}`
        })));
        this.updateAttachments(images, this.data.files);
      }
    });
  },

  chooseFiles() {
    const remaining = MAX_ATTACHMENTS - this.data.attachmentCount;
    if (!remaining) {
      this.showLimitToast();
      return;
    }

    wx.chooseMessageFile({
      count: Math.min(remaining, 10),
      type: 'file',
      success: (res) => {
        const timestamp = Date.now();
        const acceptedFiles = res.tempFiles
          .map((file, index) => {
            const extension = this.getExtension(file.name || file.path);
            return {
              id: `file-${timestamp}-${index}`,
              name: file.name,
              path: file.path,
              extension,
              sizeText: this.formatFileSize(file.size)
            };
          })
          .filter((file) => ALLOWED_FILE_EXTENSIONS.includes(file.extension));

        if (acceptedFiles.length !== res.tempFiles.length) {
          wx.showToast({ title: '仅支持 PDF、XLS、XLSX 文件', icon: 'none' });
        }
        this.updateAttachments(this.data.images, this.data.files.concat(acceptedFiles));
      }
    });
  },

  removeImage(event) {
    const index = Number(event.currentTarget.dataset.index);
    const images = this.data.images.filter((item, itemIndex) => itemIndex !== index);
    this.updateAttachments(images, this.data.files);
  },

  removeFile(event) {
    const index = Number(event.currentTarget.dataset.index);
    const files = this.data.files.filter((item, itemIndex) => itemIndex !== index);
    this.updateAttachments(this.data.images, files);
  },

  previewImage(event) {
    const index = Number(event.currentTarget.dataset.index);
    wx.previewImage({
      current: this.data.images[index].path,
      urls: this.data.images.map((item) => item.path)
    });
  },

  updateAttachments(images, files) {
    const attachmentCount = images.length + files.length;
    this.setData({ images, files, attachmentCount });
  },

  openStoreSelector() {
    const selectedIds = this.data.selectedStores.map((store) => store.id);
    const storeOptions = this.data.storeOptions.map((store) => ({
      ...store,
      selected: selectedIds.includes(store.id)
    }));

    this.setNavigationDimmed(true);
    this.setData({
      storeOptions,
      draftStoreCount: selectedIds.length,
      storeSelectorVisible: true
    });
  },

  toggleStore(event) {
    const index = Number(event.currentTarget.dataset.index);
    const key = `storeOptions[${index}].selected`;
    const selected = !this.data.storeOptions[index].selected;

    this.setData({
      [key]: selected,
      draftStoreCount: this.data.draftStoreCount + (selected ? 1 : -1)
    });
  },

  closeStoreSelector() {
    this.setData({ storeSelectorVisible: false });
  },

  onStoreSelectorClosed() {
    this.setNavigationDimmed(false);
    this.setData({ storeSelectorVisible: false });
  },

  confirmStores() {
    const selectedStores = this.data.storeOptions
      .filter((store) => store.selected)
      .map(({ id, name }) => ({ id, name }));

    this.setData({
      selectedStores,
      selectedStoreCount: selectedStores.length,
      storeSelectorVisible: false
    });
  },

  setNavigationDimmed(dimmed) {
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: dimmed ? '#999999' : '#ffffff',
      animation: {
        duration: 250,
        timingFunc: 'easeIn'
      }
    });
  },

  onRemarkInput(event) {
    this.setData({ remark: event.detail.value });
  },

  submitOrder() {
    if (!this.data.attachmentCount) {
      wx.showToast({ title: '请先上传内容', icon: 'none' });
      return;
    }
    if (!this.data.selectedStoreCount) {
      wx.showToast({ title: '请选择出货门店', icon: 'none' });
      return;
    }

    this.setData({ submitting: true });
    setTimeout(() => {
      this.setData({ submitting: false });
      wx.showToast({ title: '提交成功', icon: 'success' });
    }, 500);
  },

  getExtension(fileName) {
    const name = fileName || '';
    const lastDotIndex = name.lastIndexOf('.');
    return lastDotIndex === -1 ? '' : name.substring(lastDotIndex + 1).toLowerCase();
  },

  formatFileSize(size) {
    if (!size) return '0KB';
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)}KB`;
    return `${(size / 1024 / 1024).toFixed(1)}MB`;
  },

  showLimitToast() {
    wx.showToast({ title: `最多上传${MAX_ATTACHMENTS}个文件`, icon: 'none' });
  }
});
