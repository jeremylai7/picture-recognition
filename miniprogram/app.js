//app.js
App({
  // 引入`towxml3.0`解析方法
  towxml:require('/towxml/index'),
  onLaunch: function () {
    var that = this;
    that.login();
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }

    this.globalData = {
      //httptype: "https://",
      //url: "www.jeremy7.cn/springboot-schedule",
      httptype: "http://",
      url: "127.0.0.1:8080",
      openid: "",
    }
  
  },
  login: function() {
    var that = this;
    wx.login({
      success: (res) => {
        if (res.code) {
          wx.request({
            url: that.globalData.httptype + that.globalData.url + "/wechat/login",
            data: {
              code:res.code
            },
            success(res) {
              that.globalData.openid = res.data;
            }
          })
        }
      },
    })
  }

})
