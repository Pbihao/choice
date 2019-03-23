// miniprogram/pages/mine/feedback/feedback.js
const forbidden = require('../../../utils/forbidden.js')
const app = getApp()
import regeneratorRuntime from '../../../regenerator-runtime/runtime.js';
var util = require('../../../utils/util.js');
Page({
  data: {
    img_path: null,
    detail: null,
    loading: false
  },
  onLoad: function () {

  },
  onChangeFace: function (e) {
    console.log(e.detail)
    this.data.detail = e.detail
  },
  submit: async function () {
    if (this.data.loading) return
    var that = this
    if (!that.data.detail) {
      wx.showToast({
        title: '请输入问题⊙﹏⊙∥∣°',
        icon: 'none',
        duration: 1000
      })
      return
    }
    that.setData({
      loading: true
    })

    var col = wx.cloud.database().collection("feedback")
    var path = that.data.img_path
    if (that.data.img_path) {
      path = 'feedback/' + util.formatTime2(new Date) + app.globalData.openid + '.' + that.data.img_path.split('.').pop().toLowerCase()
    }

    console.log("上传的路径", path)
    console.log("本地的路径", that.data.img_path)
    var cloud_id = null
    new Promise((resolve, reject) => {
      if (path) {
        wx.cloud.uploadFile({
          cloudPath: path, // 上传至云端的路径
          filePath: that.data.img_path,
          success: res => {
            console.log(res.fileID)
            cloud_id = res.fileID
            resolve()
          },
          fail: console.error
        })
      }
      else { resolve() }
    }).then(() => {
      console.log("上传完成")
      console.log(app.globalData.userInfo.nickName)
      console.log(app.globalData.userInfo.avatarUrl)
      col.add({
        data: {
          avatar_name: app.globalData.userInfo.nickName,
          avatar_url: app.globalData.userInfo.avatarUrl,
          date: util.formatTime(new Date),
          detail: forbidden.replaceForbiddenWords(that.data.detail),
          img_path: cloud_id,
          used: []
        }
      }).then(() => {
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1];   //当前页面
        var prevPage = pages[pages.length - 2];  //上一个页面
        prevPage.setData({
          refresh: true
        })
        wx.showToast({
          title: '上传成功',
          duration: 700
        })
        setTimeout(() => {
          wx.navigateBack({})
        }, 700)
      })
    })
  },
  //用户选择一张图片上传
  chooseImage: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          img_path: res.tempFilePaths[0]
        })
        console.log("图片的位置", that.data.img_path)
      }
    })
  }
})