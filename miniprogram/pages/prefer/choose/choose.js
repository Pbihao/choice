//index.js
//获取应用实例
var app = getApp();
Page({
  data: {
    ok: true,
    size: 15,
    animationData: {},
    cardInfoList: [{
      cardUrl: '../../../images/card_back.png',
      cardInfo: {
        cardTitle: '「 幸 · 运 」',
        cardInfoMes: ['向上滑动卡片', '得到你想要的答案', '----愿你所选，如你所愿']
      }
    }, {
        cardUrl: '../../../images/answer.png',
      cardInfo: {
        cardTitle: '「 答 · 案 」',
        cardInfoMes: ['出错了']
      }
    }]
  },
  //事件处理函数
  //！！！！！！！！！！！！！！！！！！！！！！！
  //现在只能翻转一次，之后可能优化
  slidethis: function(e) {
    if(!this.data.ok)return
    this.data.ok = false
    this.data.size = 30
    console.log(e);
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'cubic-bezier(.8,.2,.1,0.8)',
    });
    var self = this;
    this.animation= animation;
    this.animation.translateY(-420).rotate(-5).translateX(0).step();
    this.animation.translateY(62).translateX(25).rotate(0).step();
    this.setData({
      animationData: this.animation.export()
    });
    setTimeout(function() {
      var cardInfoList = self.data.cardInfoList;
      var slidethis = self.data.cardInfoList.shift();
      self.data.cardInfoList.push(slidethis);
      self.setData({
        cardInfoList: self.data.cardInfoList,
        animationData: {}
      });
    }, 350);
  },

  onLoad: function (options) {
    console.log(this.data.cardInfoList[1].cardInfoMes)
    this.data.cardInfoList[1].cardInfo.cardInfoMes[0]=options.msg
    setTimeout(()=>{},350)
  }
})
