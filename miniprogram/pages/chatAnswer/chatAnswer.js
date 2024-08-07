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
    indexShow:false,
    showResult: false,
    returnResult:'',
    imgUrl:"https://p26-passport.byteacctimg.com/img/user-avatar/74c6c6c1d6e7dca73f0e27064f8e9ebd~300x300.image",
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
    let json = {id:9999,message:searchText,messageMarkdown:message,type:1};
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
            data[i].messageMarkdown = app.towxml(data[i].message,'markdown',{theme:"light-no-background2"});
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

  copyResult(event) {
    const message = event.currentTarget.dataset.message;
    const encodedMarkdownText = encodeURIComponent(message);
    var resultText;
    wx.request({
      url: app.globalData.httptype + app.globalData.url + "/holiday/markdownToStr?markdownStr="+encodedMarkdownText,
      method:'POST',
      success:function(res) {
        resultText = res.data;
        wx.setClipboardData({
          data: resultText,
          success (res) {
          }
        }) 
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
  },  



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const accountInfo = wx.getAccountInfoSync();
    console.log(accountInfo.miniProgram.envVersion) // 小程序 appId
    
    var that = this;
    wx.request({
      url: app.globalData.httptype + app.globalData.url + "/holiday/getShow",
      success:function(res){
        let status = res.statusCode;
        if(status == 200) {
          let data = res.data;
          that.setData({
            indexShow:data
          })
        } 
        
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
    var stop = "******【stop】******";
    wx.onSocketMessage((res) => {
      console.log(res.data);
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
        chatArray[length-1].messageMarkdown = result;
        chatArray[length-1].message = resultText;
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