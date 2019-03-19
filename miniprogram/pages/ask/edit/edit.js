// miniprogram/pages/ask/edit/edit.js
//index.js
//获取应用实例
const app = getApp()
import regeneratorRuntime from '../../../regenerator-runtime/runtime.js';
var util = require('../../../utils/util.js');
Page({
  data: {
    img_path: null,
    detail: null,
    left: null,
    right: null,
    loading: false
  },
  onLoad: function () {

  },
  onChangeFace: function (e) {
    console.log(e.detail)
    this.data.detail = e.detail
  },
  onChangeLeft: function (e) {
    console.log(e.detail)
    this.data.left = e.detail
  },
  onChangeRight: function (e) {
    console.log(e.detail)
    this.data.right = e.detail
  },
  submit: async function () {
    if (this.data.loading) return
    /*
    if (!this.data.img_path) {
      wx.showToast({
        title: '提交广场必须要有一张图片哦o(╯□╰)o',
        icon: 'none',
        duration: 1000
      })
      return
    }*/
    if (!this.data.detail) {
      wx.showToast({
        title: '请输入问题⊙﹏⊙∥∣°',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if (!this.data.left) {
      wx.showToast({
        title: '请输入选项A⊙﹏⊙∥∣°',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if (!this.data.right) {
      wx.showToast({
        title: '请输入选项B⊙﹏⊙∥∣°',
        icon: 'none',
        duration: 1000
      })
      return
    }
    this.setData({
      loading: true
    })
    new Promise((resolve,reject)=>{
      if(this.data.img_path){
        wx.compressImage({
          src: this.data.img_path, // 图片路径
          quality: 60, // 压缩质量
          success: res => {
            this.data.img_path = res.tempFilePath
            console.log(this.data.img_path)
            resolve()
          }
        })
      }else{
        resolve()
      }
      
    }).then(()=>{
    var col = wx.cloud.database().collection("questions")
    var path = this.data.img_path
    if (this.data.img_path){
      path = 'ask_img/' + util.formatTime2(new Date) + '.' + this.data.img_path.split('.').pop().toLowerCase()
    }
    
    console.log("上传的路径", path)
    console.log("本地的路径", this.data.img_path)
    var cloud_id = null
    new Promise((resolve, reject) => {
      if(path){
      wx.cloud.uploadFile({
        cloudPath: path, // 上传至云端的路径
        filePath: this.data.img_path,
        success: res => {
          console.log(res.fileID)
          cloud_id = res.fileID
          resolve()
        },
        fail: console.error
      })}
      else {resolve()}
    }).then(() => {
      console.log("上传完成")
      console.log(app.globalData.userInfo.nickName)
      console.log(app.globalData.userInfo.avatarUrl)
      col.add({
        data: {
          avatar_name: app.globalData.userInfo.nickName,
          avatar_url: app.globalData.userInfo.avatarUrl,
          comment:[],
          comment_number:0,
          date: util.formatTime(new Date),
          detail: this.data.detail,
          img_path: cloud_id,
          left: 0,
          left_txt: this.data.left,
          right: 0,
          right_txt: this.data.right,
          used:[]
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