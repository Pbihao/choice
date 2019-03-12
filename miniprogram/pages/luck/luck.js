// pages/luck/luck.js
import regeneratorRuntime from '../../regenerator-runtime/runtime.js';
var app = getApp()
Page({
  data: {
    timecardtableID: 40682,
    myChoices: []
  },
  save: function () {
    wx.setStorageSync('myChoices_list', this.data.myChoices)
  },
  /**
   * 用于加载用户自己的卡片
   */
  load: function () {
    var myChoices = wx.getStorageSync('myChoices_list')
    if (myChoices) {
      this.setData({ myChoices: myChoices})
      console.log(myChoices)
    }
  },

  //第一次调用的时候会从云服务器跟新我们的卡牌
  onLoad: function (options) {
    var that = this
    app.getOpenid().then(async ()=>{
      //console.log(app.globalData.openid)
      const collection = await wx.cloud.database()
                            .collection('user_cards')
      const countResult = await collection.where({
        _openid: app.globalData.openid
      }).count()
      const total = countResult.total
      const batchTimes = Math.ceil(total / 2)
      var cards = []
      for (let i = 0; i < batchTimes; i++) {
          const promise = collection.where({
                        _openid: app.globalData.openid
                        }).skip(i * 2).limit(2).get()
          cards.push(promise)
      }
      var a = (await Promise.all(cards)).reduce((acc, cur) => ({
        data: acc.data.concat(cur.data),
        errMsg: acc.errMsg,
      }))
      that.setData({
        myChoices: a.data
      })
      wx.setStorageSync('myChoices_list', a.data)
      console.log(that.data.myChoices)
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
    this.load()
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

  //跳转添加choice页面
  //如果没有获取openid就提示没有登陆
  creatChoice: function () {
    wx.navigateTo({
      url: '/pages/luck/create/create'
    })
  },
  choose: function() {
    wx.navigateTo({
      url: '/pages/luck/choose/choose',
    })   
  },
  edit: function() {
    wx.navigateTo({
      url: '/pages/luck/edit/edit',
    })
  }
})