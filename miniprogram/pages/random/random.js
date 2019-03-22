// miniprogram/pages/random/random.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    min:0,
    max:0,
    random_result:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
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

  input_min: function (e) {
    this.setData({
      min: parseInt(e.detail.value)
    })
  }, 
  input_max: function (e) {
    this.setData({
      max: parseInt(e.detail.value)
    })
  },
  generate_random: function () {
    var result = Math.floor(Math.random() * (this.data.max - this.data.min)) + this.data.min
    this.setData({
      random_result: result
    })
  }
})