//app.js
App({
  // 引入`towxml3.0`解析方法
  towxml:require('/towxml/index'),
  onLaunch: function () {
    this.initUpdateManager();
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

      // pro 环境
      httptype: "https://",
      url: "www.jeremy7.cn",
      wstype:"wss://",


      // dev 环境  
      // httptype: "http://",
      // url: "127.0.0.1:8080",
      // wstype:"ws://",

      openid: "",
      
    }
  
  },
  initUpdateManager: function() {
    // 旧版客户端不支持更新管理器时，继续正常启动。
    if (typeof wx.getUpdateManager !== 'function') return;

    const updateManager = wx.getUpdateManager();
    // 微信自动检查并下载新版本，下载完成后再提示重启。
    updateManager.onUpdateReady(() => {
      wx.showModal({
        title: '更新提示',
        content: '新版本已准备好，是否立即重启小程序？',
        confirmText: '立即更新',
        cancelText: '稍后再说',
        success: (res) => {
          if (res.confirm) {
            updateManager.applyUpdate();
          }
        }
      });
    });

    updateManager.onUpdateFailed(() => {
      wx.showModal({
        title: '更新未完成',
        content: '新版本下载失败,请稍后重试。',
        showCancel: false,
        confirmText: '知道了'
      });
    });
  },
  request: function(options = {}) {
    var that = this;
    return wx.request({
      url: that.globalData.httptype + that.globalData.url + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      // 统一请求头
      header: {
        'Content-Type': 'application/json',
        'X-Custom-Header': 'jeremy63982945'
      },
      success: options.success,
      fail: options.fail,
      complete: options.complete
    });
  },
  login: function() {
    var that = this;
    wx.login({
      success: (res) => {
        if (res.code) {
          that.request({
            url: "/wechat/login",
            data: {
              code:res.code
            },
            success(res) {
              that.globalData.openid = res.data;
              that.wxConnect();
            }
          })
        }
      },
    })
  },
  wxConnect: function() {
    var that = this;
    var openId = that.globalData.openid;
    wx.connectSocket({
      url: that.globalData.wstype + that.globalData.url + "/ws/message/"+openId,
      success:function(res) {
        console.log('websocket 已连接...');
      }
    })
    
    wx.onSocketOpen((result) => {
      console.log('websocket 已打开...');
    });

    

    
  }

})
