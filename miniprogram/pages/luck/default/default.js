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
        for (i of res.data) {
          cards.push(i)
        }
        that.setData({
          default_cards: cards
        })
        console.log(that.data.default_cards)
      })
      .catch((err) => {
        console.error
      })
  },
  onLoad: function () {
    this.getDefaultCards()
  }
})