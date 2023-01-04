const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showResult: false,
    returnResult:'',
    imgUrl:"https://p26-passport.byteacctimg.com/img/user-avatar/74c6c6c1d6e7dca73f0e27064f8e9ebd~300x300.image",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 定义插屏广告
    let interstitialAd = null
    // 插屏广告
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-549f6950b0cf582c'
      })
      interstitialAd.onLoad(() => {})
      interstitialAd.onError((err) => {})
      interstitialAd.onClose(() => {})
    }
    // 展示插屏广告 
    if (interstitialAd) {
      interstitialAd.show().catch((err) => {
        console.error(err)
      })
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 保存图片
   */
  saveImage : function() {
    var that = this;
    wx.downloadFile({
      url: that.data.imgUrl,
      success: function(res) {
        if (res.statusCode === 200) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function(data) {
              wx.showToast({
                title: '保存成功',
                icon:'success',
              })
            }
          })
        }
      }
    })
  },  

  // 上传手写图片
  doUploadHandwriting : function() {
    // 选择图片
    const that = this;
    that.cleanText();
    wx.chooseMedia({
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.showLoading({
          title: '上传中',
        })
        that.cleanText();
        var tempFilePaths = res.tempFilePaths;
        that.uploadFile(tempFilePaths,tempFilePaths.length,0,"picture-handwriting");
      }
    })
  
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    const that = this;
    wx.chooseMedia({
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.showLoading({
          title: '上传中',
        })
        that.cleanText();
        var tempFilePaths = res.tempFiles;
        that.uploadFile(tempFilePaths,tempFilePaths.length,0,"picture-reconize");
      }
    })
  },
  uploadFile:function(tempFilePaths,length,index,path) {
    if(index >= length) {
      wx.hideLoading();
      return;
    }
    var that = this;
    var openid = app.globalData.openid;
    wx.uploadFile({
      url: app.globalData.httptype + app.globalData.url + "/" + path,
      filePath: tempFilePaths[index].tempFilePath,
      name: 'multipartFile',
      formData: {
        openid: openid
      },
      success (res){
        that.setData({
          returnResult:  that.data.returnResult + res.data,
          showResult:true,
        })
        that.uploadFile(tempFilePaths,tempFilePaths.length,index + 1,path);
      }
    })
  },
  cleanText:function() {
    this.setData({
      returnResult:""
    })
  }      
})