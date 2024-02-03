// pages/chatAnswer/chatAnswer.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchText:"",
    showResult:true,
    demoShow:true,
    resultText:"",
    scrollTop:0,
    article:{},
    videoAd:null,
    videoCount:0,
    loading:false,
    welcomeTextInit:"",
    animationData: {},
    chatCount:0,
    chatArray:[],
    index:0,
    headScrollTop:9999,
  },
  onButtonClick() {
    var chatArray = this.data.chatArray;
    console.log(chatArray);
    var index = this.data.index;
    var type = index%2 == 0 ? 1 : 2;
    let result = app.towxml("哈哈哈",'markdown',{theme:"light-no-background2"});
    let json = {id:99,message:result,type:type};
    chatArray.push(json);



    this.setData({
      index:index+1,
      chatArray:chatArray,
      chatCount:chatArray.length
    })
    
    

    
    

  },

  changeText: function (e){
    this.setData({
      searchText: e.detail.value
    })
  },
  // 回车确认
  onConfirm() {
    this.chatAnswer();
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
    that.answerChat();
  },

  answerChat() {
    var that =  this;
    var searchText = that.data.searchText;
    var openid = app.globalData.openid;
    var chatArray = this.data.chatArray;
    let message = app.towxml(searchText,'markdown',{theme:"light-no-background2"});
    let json = {id:99,message:message,type:1};
    chatArray.push(json);
    that.setData({
      chatArray:chatArray,
      chatCount:chatArray.length
    })
    wx.request({
      url: app.globalData.httptype + app.globalData.url + "/holiday/chat-answer",
      data: {
         msg:searchText,
         openid:openid
      },
      success (res){
        chatArray = that.data.chatArray;
        let resultMsg = "正在生成回答，请稍后....";
        let mdResultMessage = app.towxml(resultMsg,'markdown',{theme:"light-no-background2"});
        let json = {id:99,message:mdResultMessage,type:2};
        chatArray.push(json);
        that.setData({
          chatArray:chatArray,
          chatCount:chatArray.length,
          resultText:resultMsg,
          searchText:"",
          showResult:true,
          demoShow:false,
          loading:false
        })
        
      },
      fail (res) {
        wx.hideLoading();
      }
      
    })
  },

  initAnimation: function () {
    const animation = wx.createAnimation({
      duration: 2000, // 动画持续时间
      timingFunction: 'ease', // 缓动函数，可以根据需要修改
    });
    this.setData({
      animationData: animation,
    });
  },

  welcomeInit() {
    var that = this;
    var openid = getApp().globalData.openid;
    wx.request({
      url: app.globalData.httptype + app.globalData.url + "/holiday/getMessagesSize",
      data: {
         openid:openid
      },
      success (res){
        var data = res.data;
        var size = data.length;
        if(size > 0) {
          for (var i = 0; i < data.length; i++) {
            data[i].message = app.towxml(data[i].message,'markdown',{theme:"light-no-background2"});
          }
          that.setData({
            chatCount:size,
            chatArray:data
          })
        }
      }
    })
  },

  copyDemo(e){
    this.setData({
      searchText: e.currentTarget.dataset.text
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
    wx.request({
      url: 'https://www.jeremy7.cn/bootstrap/index/getTableData?limit=10&offset=0&search=&order=asc',
      success:function(res){
        //console.log(res);
      }
    })
    var that = this;
    let intervalId = setInterval(function() {
        var openid = getApp().globalData.openid;
        if(openid != "") {
         that.welcomeInit();
          clearInterval(intervalId);
        }
    }, 500);
    wx.onSocketMessage((res) => {
      console.log(res.data);
      var stop = "【stop】------";
      if(res.data == stop) {
        return;
      }
      var resultText = that.data.resultText;
      if(resultText == "正在生成回答，请稍后....") {
        resultText = "";
        that.setData({
          resultText:"",
        })
      }
      resultText = resultText + res.data;
      let result = app.towxml(resultText,'markdown',{theme:"light-no-background2"});
      var chatArray = that.data.chatArray;
      var length = chatArray.length;
      if(length > 0) {
        chatArray[length-1].message = result;
        that.setData({
          resultText:resultText,
          chatArray:chatArray,
          headScrollTop:9999,
        })
      }
      const query = wx.createSelectorQuery()
      query.select('.chat-frame').boundingClientRect()
      query.select('.chat-content').boundingClientRect()
      query.exec((res) => {
          const resultCar = res[0].height;
          const contentInfo = res[1].height;
      })


      // const query = wx.createSelectorQuery()
      // query.select('.result-card').boundingClientRect()
      // query.select('.content-info').boundingClientRect()
      // query.exec((res) => {
      //     const resultCar = res[0].height;
      //     const contentInfo = res[1].height;
      //     if(contentInfo > resultCar) {
      //       const differ = contentInfo - resultCar;
      //       that.setData({
      //         scrollTop:differ + 100
      //       })
      //     }
      // })  
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