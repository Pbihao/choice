// miniprogram/pages/luck/default/default.js
const db = wx.cloud.database()
const default_cards = db.collection('default_cards')
var cards = []

Page({
  data: {

  },
  getDefaultCards: function () {
    var that = this
    var len = cards.length
    len = 0
    default_cards
      .skip(len)
      .limit(6)
      .get()
      .then((res) => {
        var i
        for (i of res.data) {
          cards.push(i)
        }
        that.setData({
          cards
        })
        console.log(that.data.cards)
      })
      .catch((err) => {
        console.error
      })
  },
})