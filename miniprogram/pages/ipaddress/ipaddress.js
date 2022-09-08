// pages/ipaddress/ipaddress.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
     localIp: "---",
     localAddress: "---", 
     searchIp:"",
     resultIp:"",
     resultAddress:"",
     showResult:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getIpAddress();
  },

  getIpAddress() {
    var that =  this;
    wx.request({
      url: app.globalData.httptype + app.globalData.url + "/holiday/ip-address",
      success (res){
        var data = res.data;
        that.setData({
          localAddress:data.address,
          localIp:data.ip
        })
      }
    })
  },

  findAddress() {
    var that =  this;
    var searchIp = this.data.searchIp;
    console.log(searchIp);
    var valid = that.isValidIP(searchIp);
    if(!valid) {
      wx.showToast({
        title: "请填写正确 IP",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    that.searchAddress(searchIp);
  },

  searchAddress(searchIp) {
    var that =  this;
    wx.request({
      url: app.globalData.httptype + app.globalData.url + "/holiday/ip-address",
      data: {
         ip:searchIp
      },
      success (res){
        var data = res.data;
        var data = res.data;
        that.setData({
          resultAddress:data.address,
          resultIp:data.ip,
          showResult:true
        })
        
      }
    })
  },

  // 验证 IP 规格合法
  isValidIP(ip) {
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    return reg.test(ip);
  }, 

  changeIp: function (e){
    this.setData({
      searchIp: e.detail.value
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

  }
})