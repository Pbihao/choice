const app = getApp()
Page({
  data: {
    now: 0,
    begin: 0,
    end: 100,
    u: 0,
    max: 15,
    scrollHeight: null
  },
  onChangebg: function (e) {
    console.log(e.detail)
    this.setData({
      begin: e.detail
    })
  },
  onChangeed: function (e) {
    console.log(e.detail)
    this.setData({
      end: e.detail
    })
  },
  onLoad: function () {
    let scrollHeight = wx.getSystemInfoSync().windowHeight;
    this.setData({
      scrollHeight: scrollHeight,
    });
    console.log(scrollHeight)
  },
  change: function () {
    this.data.u = 0
    console.log("开始")
    this.dfs()

  },
  dfs: function () {
    if (this.data.u >= this.data.max) return
    this.setData({
      now: this.bt(this.data.begin, this.data.end)
    })
    this.data.u += 1
    console.log(this.data.now)
    setTimeout(this.dfs, 100)
  },

  bt: (a, b) => {
    a = Math.floor(a)
    b = Math.floor(b)
    return Math.floor(a + Math.random() * (b - a + 1))
  }
})
