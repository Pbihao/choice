//index.js
//获取应用实例
var util = require('../../utils/util.js');
const app = getApp()
import regeneratorRuntime from '../../regenerator-runtime/runtime.js';
Page({
  data: {
    image: '../../images/no.png',
    used: false,
    //0右滑 2左滑
    detail: [
      '',
      '稍等片刻。。。',
      ''
    ],
    choose: null,
    now: 1,
    left: true,
    hidden: false
  },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY
    })
  },
  //滑动事件处理
  //0: 右滑的答案    1: 题目      2：左滑的答案
  touchmove: function (e) {
    let startX = this.data.startX,
      startY = this.data.startY,
      touchMoveX = e.changedTouches[0].clientX,
      touchMoveY = e.changedTouches[0].clientY,
      angle = this.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    if (Math.abs(angle) > 45) return;

    var n = this.data.now,
      c = this.data.choose
    //向右滑动
    if (touchMoveX > startX) {
      if (n == 1 && c == 2) {
        return
      }
      if (n == 0) return
      this.setData({
        now: n - 1,
        left: true
      })
      if (this.data.choose == null){
        this.data.choose = 0
        this.opera_cloud(0)
      } 
    } else {
      if (n == 1 && c == 0) {
        return
      }
      if (n == 2) return
      console.log(n)
      this.setData({
        now: n + 1,
        left: false
      })
      if (this.data.choose == null){
        this.data.choose = 2
        this.opera_cloud(2)
      } 
    }
  },
  /*计算滑动角度*/
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI)
  },

  opera_cloud: async function(pos){
    var date = new Date()
    date = util.format(date)
    var col = wx.cloud.database().collection('choosed');
    var that=this
    //查询是否在这一天已经选择过了
    if(!app.globalData.openid){
      await app.getOpenid()
    }
    var log = null
    await col.where({
      _openid: app.globalData.openid
    }).get().then(res => {
      console.log(res.data)
      log = res.data[0]
    })
    if(pos==1){
      if(!log)return
      if(log.date == date)this.data.choose=log.choose
    }else {
      console.log("得到的记录",log)
      if(!log){
        col.add({
          data:{
            date: date,
            choose: pos
          }
        })
      }else{
        col.doc(log._id).update({
          data:{
            date: date,
            choose: pos
          }
        })
      }
    }
    
  }

  ,
  onLoad: function () {
    var date = new Date()
    date=util.format(date)
    console.log("当日时间",date)
    var db = wx.cloud.database();
    var that = this
    this.opera_cloud(1)
    
    db.collection('square').limit(1).get().then((res)=>{
      var data=res.data[0]
      console.log(data)
      that.setData({
        image: data.img,
        detail: data.detail,
        hidden: true
      })
      wx.setStorageSync("square", {
        image: data.img,
        detail: data.detail
      })
    })
  }
})
