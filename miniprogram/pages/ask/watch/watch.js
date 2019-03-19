const app = getApp()
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ask:[],
    comment_detail:"",
    comment_date:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      ask:wx.getStorageSync('ask')
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  comment_detail: function (e) {
    console.log(e.detail)
    this.setData({ 
      comment_detail: e.detail
      })
  },
  submit: function () {
    this.data.ask.comment.push({
      date: util.formatTime(new Date()),
      detail: this.data.comment_detail,
      user_name: app.globalData.nickName,
      user_avatar: app.globalData.avatarUrl
    })
    
    console.log(this.data.ask)
  }, 
    see_img: function () {
    wx.previewImage({
      urls: [this.data.ask.img_path]
    })
  },
})