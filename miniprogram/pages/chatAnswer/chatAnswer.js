// pages/chatAnswer/chatAnswer.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchText:"",
    showResult:false,
    demoShow:true,
    resultText:"",
    article:{},
    videoAd:null,
    videoCount:0,
  },

  changeText: function (e){
    this.setData({
      searchText: e.detail.value
    })
  },

  chatAnswer() {
    var that =  this;
    if(that.data.videoCount > 0) {
      that.answerVideo();
    }
    var searchText = this.data.searchText;
    if(searchText == "") {
      wx.showToast({
        title: "请输入文字",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    wx.showLoading({
      title: '请稍等',
    })
    that.answerChat();
  },

  answerVideo() {
    var videoAd = this.data.videoAd;
    // 用户触发广告后，显示激励视频广告
    if (videoAd) {
      videoAd.show().catch(() => {
        // 失败重试
        videoAd.load()
          .then(() => videoAd.show())
          .catch(err => {
            console.log('激励视频 广告显示失败')
          })
      })
    }
  },

  answerChat() {
    var that =  this;
    var searchText = that.data.searchText;
    var openid = app.globalData.openid;
    wx.request({
      url: app.globalData.httptype + app.globalData.url + "/holiday/chat-answer",
      data: {
         msg:searchText,
         openid:openid
      },
      success (res){
        wx.hideLoading();
        var url = res.data;
        console.log(url);
        //随意写一个主题，就不会引用背景色
        let result = app.towxml(url,'markdown',{theme:"light-no-background2"});
        var videoCount = that.data.videoCount + 1;
        that.setData({
          resultText:url,
          article:result,
          showResult:true,
          demoShow:false,
          videoCount:videoCount,
        })
        
      },
      fail (res) {
        wx.hideLoading();
      }
      
    })
  },

  copyResult() {
    var resultText = this.data.resultText;
    wx.setClipboardData({
      data: resultText,
      success (res) {
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
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

    let videoAd = null
    // 创建激励视频广告实例
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-b58e6827e03f56b7'
      })
      videoAd.onLoad(() => {})
      videoAd.onError((err) => {})
      videoAd.onClose((res) => {})
    }
    that.setData({
      videoAd:videoAd
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    console.log(2222);
  },
  share() {
    console.log(1111);
    
  }
})