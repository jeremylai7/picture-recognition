// pages/holiday/holiday.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowTime:"",
    date:"",
    month:"",
    intervalTime:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.updateTime();
    setInterval(this.updateTime,1000);
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
    this.setData({
      nowTime:time,
      month:month,
      date:date,
      intervalTime:intervalTime
    })
    
  },

  fillZero(time){
    return time < 10 ? 0 + time : time;
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

  }
  
})