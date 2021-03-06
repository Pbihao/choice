// pages/luck/luck.js
const jinrishici = require('../../utils/jinrishici.js')
import regeneratorRuntime from '../../regenerator-runtime/runtime.js';
var util = require('../../utils/util.js');
var app = getApp()
Page({
  data: {
    myChoices: [],
    deleteDisabled: false,
    createLoading: false,
    date:'',
    jinrishici:""
  },
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
      console.log(myChoices)
    }
    jinrishici.load(result => {
      // 下面是处理逻辑示例
      this.setData({ "jinrishici": result.data.content })
    })
  },

  //第一次调用的时候会从云服务器跟新我们的卡牌
  onLoad: function (options) {
    this.setData({
      date: util.formatTime(new Date())
    })
    var that = this
    app.getOpenid().then(async ()=>{
      //console.log(app.globalData.openid)
      const collection = await wx.cloud.database()
                            .collection('user_cards')
      const countResult = await collection.where({
        _openid: app.globalData.openid
      }).count()
      const total = countResult.total
      const batchTimes = Math.ceil(total / 20)
      var cards = []
      for (let i = 0; i < batchTimes; i++) {
        var promise = null
        if(i!=0){
          promise = collection.where({
            _openid: app.globalData.openid
          }).skip(i * 20).limit(20).get()
        }else{
          promise = collection.where({
            _openid: app.globalData.openid
          }).limit(20).get()
        }
        cards.push(promise)
      }
      var a = {}
      if(batchTimes >= 1){
        a = (await Promise.all(cards)).reduce((acc, cur) => ({
          data: acc.data.concat(cur.data),
          errMsg: acc.errMsg,
        }))
      }else {
        a.data = []
      }
      that.setData({
        myChoices: a.data
      })
      wx.setStorageSync('myChoices_list', a.data)
      console.log(that.data.myChoices)
    })
  },


  onShow: function () {
    this.load()
  },

  //用户删除一张卡片
  ondelete: async function(e){
    if(!this.data.deleteDisabled)
    {
      this.setData({
        deleteDisabled: true
      })
    let index = e.currentTarget.dataset.index;
    var that = this
    console.log(that.data.myChoices[index])
    const collection = await wx.cloud.database().collection('user_cards')
    collection.doc(that.data.myChoices[index]._id).remove().then(() => {
      that.data.myChoices.splice(index, 1)
      wx.setStorageSync('myChoices_list', that.data.myChoices)
      console.log("删除成功")
      this.setData({
        deleteDisabled: false
      })
      that.load()
    }).catch((res)=>{
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

  //跳转添加choice页面
  //如果没有获取openid就提示没有登陆
  createChoice: function () {
    this.setData({
      createLoading:true
    })
    wx.setStorageSync('edit', 0)
    app.getOpenid().then(() => {
      wx.navigateTo({
        url: '/pages/luck/create/create'
      })
    }).catch(() => {
      wx.showToast({
        title: '未登陆',
        icon: 'loading',
        duration: 1000
      })
    })
  },

  choose: function() {
    wx.navigateTo({
      url: '/pages/luck/choose/choose',
    })   
  },


  edit: function(e) {
    let index = e.currentTarget.dataset.index;
    wx.setStorageSync('edit',index)
    wx.navigateTo({
      url: '/pages/luck/create/create',
    })
  },
  toDefault: function () {
    wx.navigateTo({
      url: '/pages/luck/default/default',
    })

  }
})