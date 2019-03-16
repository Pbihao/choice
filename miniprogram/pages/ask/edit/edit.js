// miniprogram/pages/ask/edit/edit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    question:[],
    have_image:false,
    image_path:''

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

  // 从相册选择照片或拍摄照片
  add_image() {
    let that = this;

    wx.chooseImage({
      count: 1,  // 最多选9张
      sizeType: ['origin', 'compressed'],
      sourceType: ['album', 'camera'],

      success: (res) => {
        this.setData({ 
          have_image: true ,
          image_path: res.tempFilePaths
        });
        //this.showLoading('图片处理中...');
        console.log(res.tempFilePaths)
      }
    })
  },
  //writeContent(res) {
    //let question = this.data.question
    //res.tempFilePaths.forEach((element, index, array) => {
      // TODO 内容上传至服务器
      //diary.list.push(this.makeContent(type, element, ''))
    //});

  //}

})