// pages/luck/luck.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timecardtableID: 40682,
    myChoices: []
  },

  save: function () {
    wx.setStorageSync('myChoices_list', this.data.myChoices)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  load: function () {
    var myChoices = wx.getStorageSync('myChoices_list')
    if (myChoices) {
      this.setData({ myChoices: myChoices})
      console.log(myChoices)
    }
  },
  onLoad: function (options) {
    
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
  // 跳转添加choice页面
  creatChoice: function () {
    wx.navigateTo({
      url: '/pages/luck/create/create',
    })
    /*
    var Choice = {
      title: "吃饭",
      color:this.data.color,
      nOfCards: 10
    }
    var myChoices = this.data.myChoices
    myChoices.push(Choice)
    this.setData({
      myChoices:myChoices
    })*/
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