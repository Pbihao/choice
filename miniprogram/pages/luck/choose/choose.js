Page({
  data: {
    animationData: {}
  },
  onShow: function () {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-in-out',
    })

    this.animation = animation


    this.setData({
      animationData: animation.export()
    })
    var n = 0;
    //连续动画需要添加定时器,所传参数每次+1就行
    setInterval(function () {
      n = n + 1;
      console.log(n);
      this.animation.rotate(180 * (n)).step()
      this.setData({
        animationData: this.animation.export()
      })
    }.bind(this), 1000)
  },

})