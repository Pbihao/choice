// pages/mine/mine.js
const db = wx.cloud.database()
const default_cards = db.collection('default_cards')
var cards = []
var app = getApp()
Page({
  data: {
    cards:[],
    avatarUrl: app.globalData.avatarUrl
  },

  onTest: function(){
    var that = this
    var len = cards.length
    len = 0
    default_cards
      .skip(len)
      .limit(6)
      .get()
      .then((res) => {
        var i
        for (i of res.data) {
          cards.push(i)
        }
        that.setData({
          cards
        })
        console.log(that.data.cards)
      })
      .catch((err) => {
        console.error
      })
  },

  onGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      console.log(e.detail.userInfo.avatarUrl)
      this.setData({
        avatarUrl: e.detail.userInfo.avatarUrl
      })
      app.globalData.userInfo = e.detail.userInfo
      app.globalData.avatarUrl = e.detail.avatarUrl
      app.globalData.loged = true
    }
  },

  onGetOpenid: function () {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
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

  }
})