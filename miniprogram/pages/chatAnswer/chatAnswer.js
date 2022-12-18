// pages/chatAnswer/chatAnswer.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchText:"",
    showResult:false,
    resultText:"",
    article:{},
  },

  changeText: function (e){
    this.setData({
      searchText: e.detail.value
    })
  },

  chatAnswer() {
    var that =  this;
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
        that.setData({
          resultText:url,
          article:result,
          showResult:true
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

  }
})