// pages/holiday/holiday.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowTime:"",
    date:"",
    month:"",
    intervalTime:"",
    week:"",
    weekArray:["日","一","二","三","四","五","六"],
    hlidayDistance: "距离【text】还有：day天",
    DomArray:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.updateTime();
    setInterval(this.updateTime,1000);
    this.getHolidayDistince();
  },

  updateTime(){
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const hour = now.getHours();
    const minutes = now.getMinutes();
    const second = now.getSeconds();
    const time = year + "年" + month + "月" + date + "日 " + this.fillZero(hour) + ":" + this.fillZero(minutes) + ":" + this.fillZero(second); 
    const intervalTime = this.getDateInterval(hour);
    const day = now.getDay();
    var weekStr = this.data.weekArray[day];
    this.setData({
      nowTime:time,
      month:month,
      date:date,
      intervalTime:intervalTime,
      week:weekStr,
    })
    
  },

  fillZero(time){
    return time < 10 ? 0 + time : time;
  },
  getHolidayDistince() {
    var that =  this;
    wx.request({
      url: app.globalData.httptype + app.globalData.url + "/holiday/all",
      success:function(res) {
        if(res.statusCode == 200) {
          that.buildHolidayItem(res.data);
        }
      }
    })
  },

  buildHolidayItem(data) {
    this.setData({
      DomArray:data
    })

  },

  getDateInterval(time) {
    var intervalTime;
    if(time >= 0 && time <= 6) {
      intervalTime = "凌晨";
    } else if(time > 6 && time < 12) {
      intervalTime = "上午";
    } else if(time == 12) {
      intervalTime = "中午";
    } else if(time > 12 && time <= 18) {
      intervalTime = "下午";
    } else {
      intervalTime = "晚上";
    }
    return intervalTime;
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
    return {
      title: "【摸鱼办】提醒您,上班要摸鱼",
      path:"/page/holiday"
    }

  }
  
})