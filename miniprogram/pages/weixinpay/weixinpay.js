// pages/weixinpay/weixinpay.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
     price:"0.01",
     buyQuantity:"1"
  },

  changeprice: function (e){
    this.setData({
      price: e.detail.value
    })
  },

  changebuyQuantity: function (e) {
    this.setData({
      buyQuantity: e.detail.value
    })
  },


  checkprice: function(){},

  wxPay:function(e){
    var that =  this;
    var price = this.data.price;
    if (price == "0" || price == "") {
      wx.showToast({
        title: "请正确金额",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    wx.showLoading({
      title: '请求中..',
    })
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: app.globalData.httptype + app.globalData.url + '/weixinpay/prepay',
            data: {
              wxcode: res.code,
              money: price * 100,
            },
            success: function (res) {
              wx.hideLoading();
              if (res.data.code == "0"){
                var data = res.data.data;
                wx.requestPayment({
                  appId: data.appId,
                  timeStamp: data.timeStamp,
                  nonceStr: data.nonceStr,
                  package: data.package,
                  signType: 'MD5',
                  paySign: data.paySign,
                  success: function (res) {
                    that.payresult(1,res);
                  },
                  fail: function(res){
                    that.payresult(2, res);
                  }
                })
              }else{
                wx.showToast({
                  title: res.data,
                  duration: 2000
                });
              }
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }  
    })

  },
  wxVirtualPay:function(e) {
    var buyQuantity = this.data.buyQuantity;
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.request({
            url: app.globalData.httptype + app.globalData.url + '/weixin/virtual/pay/prepay',
            method:'POST',
            data: {
              buyQuantity:buyQuantity,
              env:1,
              wxCode: res.code,
            },
            success: function (res) {
              if (res.statusCode == 200){
                var data = res.data;
                wx.requestVirtualPayment({
                  // short_series_goods	道具直购
                  //short_series_coin	代币充值
                  mode:"short_series_coin",
                  signData: data.signData,
                  // 支付签名
                  paySig:data.paySig,
                  // 用户态签名
                  signature:data.signature,
                  success(res) {
                    console.log('虚拟支付调用成功', res)
                    wx.showToast({
                      title: '支付成功',
                      icon: 'success'
                    })
                  },
                  fail(error) {
                    console.error(
                      '虚拟支付失败',
                      error.errCode,
                      error.errMsg
                    )
                    wx.showToast({
                      title: error.errMsg || '支付失败',
                      icon: 'none'
                    })
                  },
                })
              }
            }
          });
        }
      },
    })
  },
  
  payresult:function(code,res){
    if(code ==1){
        msg = "成功"
    }else{
      msg = "失败" + res.errMsg;
    }
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