//index.js
//获取应用实例
const app = getApp()
import regeneratorRuntime from '../../../regenerator-runtime/runtime.js';
var util = require('../../../utils/util.js');
Page({
  data: {
    img_path: null,
    title: null,
    left: null,
    right: null,
    loading: false
  },
  onLoad: function () {

  },
  onChangeFace: function (e) {
    console.log(e.detail)
    this.data.title = e.detail
  },
  onChangeLeft: function (e) {
    console.log(e.detail)
    this.data.left = e.detail
  },
  onChangeRight: function (e) {
    console.log(e.detail)
    this.data.right = e.detail
  },
  submit:  async function(){
    if(this.data.loading)return
    if(!this.data.img_path){
      wx.showToast({
        title: '提交广场必须要有一张图片哦o(╯□╰)o',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if (!this.data.title) {
      wx.showToast({
        title: '请输入卡牌正面⊙﹏⊙∥∣°',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if (!this.data.left) {
      wx.showToast({
        title: '请输入左滑答案⊙﹏⊙∥∣°',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if (!this.data.right) {
      wx.showToast({
        title: '请输入右滑答案⊙﹏⊙∥∣°',
        icon: 'none',
        duration: 1000
      })
      return
    }
    this.setData({
      loading: true
    })
    var col=wx.cloud.database().collection("submit")
    var path = 'submit/' + util.formatTime2(new Date) + app.globalData.openid + '.' + this.data.img_path.split('.').pop().toLowerCase()
    console.log("上传的路径",path)
    console.log("本地的路径", this.data.img_path)
    var cloud_id = null
    new Promise((resolve, reject)=>{ 
      wx.cloud.uploadFile({
        cloudPath: path, // 上传至云端的路径
        filePath: this.data.img_path, 
        success: res => {
          console.log(res.fileID)
          cloud_id=res.fileID
          resolve()
        },
        fail: console.error
      })
      
    }).then(()=>{
      console.log("上传完成")
      col.add({
        data: {
          title: this.data.title,
          left: this.data.left,
          right: this.data.right,
          img_id: cloud_id
        }
      }).then(() => {
        wx.showToast({
          title: '感谢您的上传',
          duration: 800
        })
        setTimeout(() => {
          wx.navigateBack({

          })
        }, 1300)
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
