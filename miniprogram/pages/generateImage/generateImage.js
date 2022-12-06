// pages/generateImage/generateImage.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchText:"",
    showResult:false,
    imgSrc:"",
  },

  changeText: function (e){
    this.setData({
      searchText: e.detail.value
    })
  },

  generateImage() {
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
      title: '正在生成图片',
    })
    wx.request({
      url: app.globalData.httptype + app.globalData.url + "/holiday/generate-image",
      data: {
         msg:searchText
      },
      success (res){
        wx.hideLoading();
        var url = res.data.data[0].url;
        console.log(url);
        that.setData({
          imgSrc:url,
          showResult:true
        })
        
      },
      fail (res) {
        wx.hideLoading();
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