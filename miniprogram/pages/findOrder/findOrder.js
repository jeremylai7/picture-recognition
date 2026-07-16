const MAX_ATTACHMENTS = 30;
const ALLOWED_FILE_EXTENSIONS = ['pdf', 'xlsx'];
const DEFAULT_SELECTED_STORE_IDS = ['88845-136', '22231-12', '36563-23'];

Page({
  data: {
    attachments: [],
    attachmentCount: 0,
    selectedStore: '',
    selectedStores: [],
    hasConfirmedStores: false,
    storeSelectorVisible: false,
    draftStoreCount: 3,
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
    remark: '',
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
        const images = res.tempFiles.map((file, index) => ({
          id: `image-${timestamp}-${index}`,
          kind: 'image',
          name: this.getFileName(file.tempFilePath, `图片${this.data.attachmentCount + index + 1}`),
          path: file.tempFilePath,
          size: file.size || 0,
          extension: 'image'
        }));
        this.appendAttachments(images);
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
        const files = [];
        const rejected = [];

        res.tempFiles.forEach((file, index) => {
          const extension = this.getExtension(file.name || file.path);
          if (!ALLOWED_FILE_EXTENSIONS.includes(extension)) {
            rejected.push(file.name || '未知文件');
            return;
          }
          files.push({
            id: `file-${timestamp}-${index}`,
            kind: 'file',
            name: file.name || `文件${this.data.attachmentCount + index + 1}.${extension}`,
            path: file.path,
            size: file.size || 0,
            extension
          });
        });

        this.appendAttachments(files);
        if (rejected.length) {
          wx.showToast({ title: '仅支持 PDF、XLSX 文件', icon: 'none' });
        }
      }
    });
  },

  appendAttachments(newAttachments) {
    const attachments = this.data.attachments
      .concat(newAttachments)
      .slice(0, MAX_ATTACHMENTS);
    this.setData({
      attachments,
      attachmentCount: attachments.length
    });
  },

  removeAttachment(event) {
    const index = Number(event.currentTarget.dataset.index);
    const attachments = this.data.attachments.filter((item, itemIndex) => itemIndex !== index);
    this.setData({
      attachments,
      attachmentCount: attachments.length
    });
  },

  previewImage(event) {
    const selectedIndex = Number(event.currentTarget.dataset.index);
    const selected = this.data.attachments[selectedIndex];
    const urls = this.data.attachments
      .filter((item) => item.kind === 'image')
      .map((item) => item.path);

    if (selected && selected.kind === 'image') {
      wx.previewImage({ current: selected.path, urls });
    }
  },

  chooseStore() {
    const selectedIds = this.data.selectedStores.map((store) => store.id);
    const draftSelectedIds = this.data.hasConfirmedStores
      ? selectedIds
      : DEFAULT_SELECTED_STORE_IDS;
    const storeOptions = this.data.storeOptions.map((store) => ({
      ...store,
      selected: draftSelectedIds.includes(store.id)
    }));
    const draftStoreCount = storeOptions.filter((store) => store.selected).length;

    this.setNavigationDimmed(true);
    this.setData({
      storeOptions,
      draftStoreCount,
      storeSelectorVisible: true
    });
  },

  toggleStore(event) {
    const index = Number(event.currentTarget.dataset.index);
    const key = `storeOptions[${index}].selected`;
    const selected = !this.data.storeOptions[index].selected;
    const draftStoreCount = this.data.draftStoreCount + (selected ? 1 : -1);

    this.setData({
      [key]: selected,
      draftStoreCount
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
    const selectedStores = this.data.storeOptions.filter((store) => store.selected);
    this.setData({
      selectedStores,
      selectedStore: selectedStores.length ? `已选${selectedStores.length}家门店` : '',
      hasConfirmedStores: true,
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
    if (!this.data.selectedStore) {
      wx.showToast({ title: '请选择出货门店', icon: 'none' });
      return;
    }

    this.setData({ submitting: true });
    setTimeout(() => {
      this.setData({ submitting: false });
      wx.showToast({ title: '提交成功', icon: 'success' });
    }, 500);
  },

  getFileName(path, fallback) {
    if (!path) return fallback;
    const cleanPath = path.split('?')[0];
    return cleanPath.substring(cleanPath.lastIndexOf('/') + 1) || fallback;
  },

  getExtension(fileName) {
    const name = fileName || '';
    const lastDotIndex = name.lastIndexOf('.');
    return lastDotIndex === -1 ? '' : name.substring(lastDotIndex + 1).toLowerCase();
  },

  showLimitToast() {
    wx.showToast({ title: `最多上传${MAX_ATTACHMENTS}个文件`, icon: 'none' });
  }
});
