const TEAS = [
  { name: '桂花乌龙', short: '桂花乌龙', color: '#B76E3A', note: '清甜桂香，像刚刚好的秋风' },
  { name: '黑糖珍珠', short: '黑糖珍珠', color: '#8B4D2F', note: '暖甜醇厚，把小确幸嚼进嘴里' },
  { name: '芋泥啵啵', short: '芋泥啵啵', color: '#9A756E', note: '绵密软糯，今天也要温温柔柔' },
  { name: '茉莉奶绿', short: '茉莉奶绿', color: '#8A955B', note: '清新回甘，留住夏末的一点绿' }
];

const FORTUNES = [
  '一叶知秋，也知你今天会有好心情。',
  '入秋的风会吹走疲惫，也会带来新的期待。',
  '把今天调成喜欢的甜度，慢慢喝，慢慢生活。',
  '这一杯敬秋天，也敬认真生活的你。',
  '愿这个秋天，有人问你粥可温，也有人陪你喝奶茶。'
];

Page({
  data: {
    statusBarHeight: 20,
    teas: TEAS,
    sweetness: ['无糖', '三分糖', '五分糖', '全糖'],
    temperatures: ['热饮', '常温', '少冰'],
    teaIndex: 0,
    sugarIndex: 2,
    temperatureIndex: 0,
    blessing: '',
    created: false,
    making: false,
    posterVisible: false,
    posterPath: '',
    posterLoading: false
  },

  onLoad() {
    const info = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
    this.setData({ statusBarHeight: info.statusBarHeight || 20 });
  },

  chooseTea(event) {
    this.setData({ teaIndex: Number(event.currentTarget.dataset.index), created: false });
  },

  chooseSugar(event) {
    this.setData({ sugarIndex: Number(event.currentTarget.dataset.index), created: false });
  },

  chooseTemperature(event) {
    this.setData({ temperatureIndex: Number(event.currentTarget.dataset.index), created: false });
  },

  makeTea() {
    if (this.data.making) return;
    this.setData({ making: true });
    wx.vibrateShort({ type: 'light' });
    setTimeout(() => {
      const index = (this.data.teaIndex * 3 + this.data.sugarIndex + this.data.temperatureIndex) % FORTUNES.length;
      this.setData({
        blessing: FORTUNES[index],
        created: true,
        making: false,
        posterPath: ''
      });
    }, 520);
  },

  openPoster() {
    if (this.data.posterLoading) return;
    if (this.data.posterPath) {
      this.setData({ posterVisible: true });
      return;
    }

    this.setData({ posterLoading: true });
    const tea = TEAS[this.data.teaIndex];
    const sugar = this.data.sweetness[this.data.sugarIndex];
    const temperature = this.data.temperatures[this.data.temperatureIndex];
    const ctx = wx.createCanvasContext('autumnPoster', this);

    const roundedRect = (x, y, width, height, radius) => {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.arcTo(x + width, y, x + width, y + radius, radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
      ctx.lineTo(x + radius, y + height);
      ctx.arcTo(x, y + height, x, y + height - radius, radius);
      ctx.lineTo(x, y + radius);
      ctx.arcTo(x, y, x + radius, y, radius);
      ctx.closePath();
    };

    const drawLeaf = (x, y, rotate, color) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotate);
      ctx.setFillStyle(color);
      ctx.beginPath();
      ctx.moveTo(0, -34);
      ctx.bezierCurveTo(36, -24, 38, 24, 0, 40);
      ctx.bezierCurveTo(-28, 18, -28, -20, 0, -34);
      ctx.fill();
      ctx.setStrokeStyle('#75432d');
      ctx.setLineWidth(2);
      ctx.beginPath();
      ctx.moveTo(0, -22);
      ctx.lineTo(0, 52);
      ctx.stroke();
      ctx.restore();
    };

    const gradient = ctx.createLinearGradient(0, 0, 600, 1000);
    gradient.addColorStop(0, '#F9EAD4');
    gradient.addColorStop(0.55, '#EFCFA7');
    gradient.addColorStop(1, '#DDAE78');
    ctx.setFillStyle(gradient);
    ctx.fillRect(0, 0, 600, 1000);

    ctx.setFillStyle('rgba(255,248,235,0.36)');
    ctx.beginPath();
    ctx.arc(300, 405, 205, 0, Math.PI * 2);
    ctx.fill();
    drawLeaf(92, 240, -0.7, '#B96538');
    drawLeaf(510, 465, 0.8, '#D08A45');
    drawLeaf(95, 690, -1.7, '#9E5736');

    ctx.setTextAlign('center');
    ctx.setFillStyle('#875239');
    ctx.setFontSize(18);
    ctx.fillText('BEGINNING OF AUTUMN  ·  08 / 07', 300, 68);
    ctx.setFillStyle('#482B1D');
    ctx.setFontSize(48);
    ctx.fillText('收下这杯秋天', 300, 132);
    ctx.setFontSize(18);
    ctx.setFillStyle('#835942');
    ctx.fillText('风开始有了秋天的味道，日子也该加一点甜', 300, 174);

    ctx.setFillStyle('rgba(80,42,24,0.18)');
    ctx.save();
    ctx.translate(300, 655);
    ctx.scale(1, 0.16);
    ctx.beginPath();
    ctx.arc(0, 0, 125, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.setFillStyle('#F1DFC3');
    roundedRect(180, 276, 240, 34, 12);
    ctx.fill();
    ctx.setStrokeStyle('#653D29');
    ctx.setLineWidth(4);
    ctx.stroke();

    ctx.setFillStyle(tea.color);
    roundedRect(198, 304, 204, 330, 30);
    ctx.fill();
    ctx.setStrokeStyle('#653D29');
    ctx.setLineWidth(4);
    ctx.stroke();

    ctx.setFillStyle('#F6E5C8');
    roundedRect(220, 395, 160, 150, 5);
    ctx.fill();
    ctx.setStrokeStyle('#70422B');
    ctx.setLineWidth(2);
    ctx.stroke();
    ctx.setFillStyle('#5A3422');
    ctx.setFontSize(12);
    ctx.fillText('HELLO AUTUMN', 300, 425);
    ctx.setFontSize(28);
    ctx.fillText(tea.name, 300, 472);
    ctx.setFontSize(14);
    ctx.fillText(`${sugar}  ·  ${temperature}`, 300, 510);

    ctx.setStrokeStyle('#804A30');
    ctx.setLineWidth(17);
    ctx.setLineCap('round');
    ctx.beginPath();
    ctx.moveTo(355, 290);
    ctx.lineTo(378, 220);
    ctx.stroke();

    ctx.setFillStyle('rgba(56,31,23,0.82)');
    [[235, 598], [285, 608], [345, 593]].forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 13, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.setFillStyle('rgba(255,248,235,0.62)');
    roundedRect(48, 720, 504, 175, 14);
    ctx.fill();
    ctx.setStrokeStyle('rgba(116,67,39,0.28)');
    ctx.setLineWidth(1);
    ctx.stroke();
    ctx.setFillStyle('#A35532');
    ctx.setFontSize(15);
    ctx.fillText('秋  日  签', 300, 760);
    ctx.setFillStyle('#4C3022');
    ctx.setFontSize(23);
    const text = this.data.blessing || FORTUNES[0];
    const firstLine = text.length > 17 ? text.slice(0, 17) : text;
    const secondLine = text.length > 17 ? text.slice(17) : '';
    ctx.fillText(`“${firstLine}`, 300, 810);
    ctx.fillText(`${secondLine}”`, 300, 846);
    ctx.setFillStyle('#8D624B');
    ctx.setFontSize(14);
    ctx.fillText(`— 你的 ${tea.name}`, 300, 875);

    ctx.setFillStyle('#6F4935');
    ctx.setFontSize(15);
    ctx.fillText('一杯奶茶的时间，刚好用来拥抱秋天', 300, 952);

    ctx.draw(false, () => {
      setTimeout(() => {
        wx.canvasToTempFilePath({
          canvasId: 'autumnPoster',
          width: 600,
          height: 1000,
          destWidth: 1200,
          destHeight: 2000,
          fileType: 'png',
          quality: 1,
          success: ({ tempFilePath }) => {
            this.setData({ posterPath: tempFilePath, posterVisible: true, posterLoading: false });
          },
          fail: () => {
            this.setData({ posterLoading: false });
            wx.showToast({ title: '海报生成失败，请重试', icon: 'none' });
          }
        }, this);
      }, 120);
    });
  },

  closePoster() {
    this.setData({ posterVisible: false });
  },

  preventClose() {},

  savePoster() {
    if (!this.data.posterPath) return;
    wx.saveImageToPhotosAlbum({
      filePath: this.data.posterPath,
      success: () => wx.showToast({ title: '已保存到相册', icon: 'success' }),
      fail: (error) => {
        if (error.errMsg && error.errMsg.includes('auth deny')) {
          wx.showModal({
            title: '需要相册权限',
            content: '请在设置中允许保存图片到相册。',
            confirmText: '去设置',
            success: ({ confirm }) => confirm && wx.openSetting()
          });
          return;
        }
        wx.showToast({ title: '保存失败，请重试', icon: 'none' });
      }
    });
  },

  onShareAppMessage() {
    const tea = TEAS[this.data.teaIndex];
    return {
      title: `送你秋天的第一杯${tea.name}`,
      path: '/pages/autumnMilkTea/autumnMilkTea'
    };
  }
});
