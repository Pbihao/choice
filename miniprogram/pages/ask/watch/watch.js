const forbidden = require('../../../utils/forbidden.js')
import regeneratorRuntime from '../../../regenerator-runtime/runtime.js';
var util = require('../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:'',
    avatar_name:'',
    date:null,
    avatar_url:'',
    comment:null,
    comment_number:0,
    comment_detail: '',
    _id:null,
    img_path: null,
    submit:false,
    index:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      index: options.index
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
    var ask = wx.getStorageSync('ask')

    this.setData({
      comment: ask.comment,
      comment_number: ask.comment.length,
      avatar_name: ask.avatar_name,
      avatar_url: ask.avatar_url,
      date: ask.date,
      detail: ask.detail,
      _id: ask._id,
      img_path: ask.img_path
    })
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
    if (this.data.comment_detail === '') {
      wx.showToast({
        title: '请输入评论',
        duration: 1000,
        icon: 'none'
      })
      return
    }
    if (!app.globalData.userInfo) {
      wx.showToast({
        title: '评论前先登录哦~',
        duration: 1000,
        icon: 'none'
      })
      return
    }
    var detail = forbidden.replaceForbiddenWords(this.data.comment_detail)
    var comment={
      date: util.formatTime(new Date()),
      detail: detail,
      user_avatar: app.globalData.avatarUrl,
      user_name: app.globalData.nickName
    }
    this.data.comment.push(comment)
    this.setData({
      comment: this.data.comment,
      comment_number: this.data.comment_number + 1
    })
    wx.cloud.callFunction({
      name: 'update_comment',
      data: {
        id: this.data._id,
        comment: comment
      },
      success: res => {
        console.log("更改数据库成功", res)
      },
      fail: err => {
        console.error("更改数据失败", err)
      }
    })
    setTimeout(() => {
      this.setData({
        comment_detail: ''
      })
    }, 500)
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    var update = "content[" + this.data.index +"].comment"
    prevPage.setData({
      [update]: this.data.comment
    })
  },
  see_img: function () {
    wx.previewImage({
      urls: [this.data.img_path]
    })
  },
  onGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      app.globalData.avatarUrl = e.detail.userInfo.avatarUrl
      app.globalData.nickName = e.detail.userInfo.nickName
      app.globalData.loged = true
    }
    console.log(app.globalData)
  }
})