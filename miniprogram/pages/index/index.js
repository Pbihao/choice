const app = getApp()
import regeneratorRuntime from '../../regenerator-runtime/runtime.js';
var util = require('../../utils/util.js');
Page({
  data: {
    scrollHeight: null,
    myChoices: [],
    deleteDisabled: false,
    createLoading: false,
    date: '',
    has_card: false
  },
  //跳转到创建卡牌界面
  to_create: function () {
    wx.navigateTo({
      url: '../luck/create/create',
    })
  }
  ,
  //跳转到我的界面
  to_mine: function () {
    wx.navigateTo({
      url: '../mine/mine',
    })
  },
  //跳转到问问界面
  to_ask: function () {
    wx.navigateTo({
      url: '../ask/ask',
    })
  },
  to_choose: function () {
    wx.navigateTo({
      url: '../square/square',
    })
  },
  to_number: function () {
    console.log("跳转到随机数")
  },
  to_default: function () {
    wx.navigateTo({
      url: '../luck/default/default',
    })
  },
  onLoad: function () {
    let scrollHeight = wx.getSystemInfoSync().windowHeight;
    this.setData({
      scrollHeight: scrollHeight,
    });
    console.log(this.data.scrollHeight)
    //加载用户在服务器储存的所有的卡牌的前20
    this.setData({
      date: util.formatTime(new Date())
    })
    var that = this
    app.getOpenid().then(async () => {
      //console.log(app.globalData.openid)
      const collection = await wx.cloud.database()
        .collection('user_cards')
      const countResult = await collection.where({
        _openid: app.globalData.openid
      }).count()
      const total = countResult.total
      var cards = []

      var promise = null
      promise = collection.where({
        _openid: app.globalData.openid
      }).limit(20).get()
      cards.push(promise)
      
      var a = {}
      console.log("toltle:", total)
      if (total >= 1) {
        a = (await Promise.all(cards)).reduce((acc, cur) => ({
          data: acc.data.concat(cur.data),
          errMsg: acc.errMsg,
        }))
        that.setData({
          has_card: true
        })
      } else {
        a.data = []
      }
      that.setData({
        myChoices: a.data
      })
      wx.setStorageSync('myChoices_list', a.data)
      console.log(that.data.myChoices)
    })
  },
  /**
   * 保存卡牌组到本地
   */
  save: function () {
    wx.setStorageSync('myChoices_list', this.data.myChoices)
  },
  /**
   * 用于加载用户自己的卡片
   */
  load: function () {
    var myChoices = wx.getStorageSync('myChoices_list')
    wx.setStorageSync('example', 0)
    this.setData({
      deleteDisabled: false,
      createLoading: false
    })
    if (myChoices) {
      this.setData({
        myChoices: myChoices
      })
      console.log("load:",myChoices)
    }
  },
  onShow: function () {
    this.load()
  },
  //用户删除一张卡片
  ondelete: async function (e) {
    if(this.data.deleteDisabled)return
    if (!this.data.deleteDisabled) {
      this.setData({
        deleteDisabled: true
      })
      let index = e.currentTarget.dataset.index;
      var that = this
      console.log("用户删除一张卡片",that.data.myChoices[index])
      const collection = await wx.cloud.database().collection('user_cards')
      collection.doc(that.data.myChoices[index]._id).remove().then(() => {
        that.data.myChoices.splice(index, 1)
        wx.setStorageSync('myChoices_list', that.data.myChoices)
        console.log("删除成功")
        this.setData({
          deleteDisabled: false
        })
        that.load()
      }).catch((res) => {
        console.log(res)
        wx.showToast({
          title: '删除失败请重试',
          duration: 1000,
          icon: 'none'
        })
      })
    }
    setTimeout(() => {
      this.setData({
        deleteDisabled: false
      })
    }, 2000)
  },
  edit: function (e) {
    let index = e.currentTarget.dataset.index;
    wx.setStorageSync('edit', index)
    wx.navigateTo({
      url: '/pages/luck/create/create',
    })
  },
})
