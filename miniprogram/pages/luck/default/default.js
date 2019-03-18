// miniprogram/pages/luck/default/default.js
const db = wx.cloud.database()
const default_cards = db.collection('default_cards')
var cards = []

Page({
  data: {
    default_cards:[]
  },
  getDefaultCards: function () {
    var that = this
    var len = 0
    default_cards
      .limit(20)
      .get()
      .then((res) => {
        var i
        cards=[]
        for (i of res.data) {
          cards.push(i)
        }
        that.setData({
          default_cards: cards
        })
        
      })
      .catch((err) => {
        console.error
      })
  },
  onLoad: function () {
    this.getDefaultCards()
  },
  edit: function (e) {
    let index = e.currentTarget.dataset.index;
    wx.setStorageSync('defualt_cards', this.data.default_cards[index-1])
    wx.setStorageSync('example', 1)
    wx.setStorageSync('edit', 0)
    wx.navigateTo({
      url: '/pages/luck/create/create',
    })
  },
})