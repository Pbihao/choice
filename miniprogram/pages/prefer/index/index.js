var util = require('../../../utils/util.js');
import regeneratorRuntime from '../../../regenerator-runtime/runtime.js';
const app = getApp()
Page({
  data: {
    choices: ["选项一", "选项二", "选项三", "选项四"],//记录用户设定的选择
    weight:[],//对于每一个选择的额外权重
    show:[],
    title: null,
    leftCount: 0,
    title: '',
    scrollHeight: null,
    now: 0,
    begin: false,
    edit: 0
  },
  /**
   * 初始设置
   */
  onLoad: function(e){
    console.log(e)
    if(e.begin=='1'){
      this.data.begin=true
    }
    this.data.choices = wx.getStorageSync("prefer_index")
    this.data.leftCount=this.data.choices.length
    console.log(this.data.nOfCards)
    this.data.title=e.title
    this.data.edit =parseInt(e.edit)
    console.log("选择偏好的数组", this.data.choices)
    let Height = wx.getSystemInfoSync().windowHeight
    this.setData({
      scrollHeight: Height
    })
    var length = this.data.choices.length
    var show = []
    for(var i = 0; i < length; i++){
      var p=null
      if(i < length-1){
        p = {
          top: this.data.choices[i],
          top_id: i,
          bottom: this.data.choices[i + 1],
          bottom_id: i + 1
        }
      }else{
        p={
          top: this.data.choices[i],
          top_id: i,
          bottom: this.data.choices[0],
          bottom_id: 0
        }
      }
      show.push(p)
      this.data.weight.push(2)
    }

  if(length>=3){
    var p = null
    for (var i = 0; i < length; i++) {
      if (i < length - 2) {
        p = {
          top: this.data.choices[i],
          top_id: i,
          bottom: this.data.choices[i + 1],
          bottom_id: i + 1
        }
      } else if(i == length - 2){
        p = {
          top: this.data.choices[i],
          top_id: i,
          bottom: this.data.choices[0],
          bottom_id: 0
        }
      } else if (i == length - 1) {
        p = {
          top: this.data.choices[i],
          top_id: i,
          bottom: this.data.choices[1],
          bottom_id: 1
        }
      }
      show.push(p)
    }
  }
    show.sort(this.randomSort)
    console.log(show)
    this.setData({
      show: show
    })
  },
  /**
   * 保存偏好设置
   */
  save: function(){
    if (this.data.title != '') {
      //  wx.setStorageSync('choices_list', this.data.choices)
      var problems = wx.getStorageSync('myChoices_list_prefer')
      var card = {
        title: this.data.title,
        choices: this.data.choices,
        weight: this.data.weight,
        nOfCards: this.data.leftCount,
        date: util.formatTime(new Date()),
      }
      const db = wx.cloud.database()
      console.log(this.data.edit)
      console.log('题目列表是', problems)
      if (this.data.edit) {
        var index = this.data.edit - 1
        console.log(card)
        var _id = problems[index]._id
        console.log("要更改的id是",_id)
        db.collection('prefer_cards').doc(problems[index]._id).set({
          data: card
        }).then(() => {
          console.log("数据更改成功")
        }).catch((res) => {
          console.log(res)
          wx.showToast({
            title: '卡片更改失败',
            duration: 1000,
            icon: 'loading'
          })
        })
        card._id = _id
        problems[this.data.edit - 1] = card
      }
      else {
        db.collection('prefer_cards').add({
          data: card
        }).then((res) => {
          card._id = res._id
          console.log("数据的id  " + card._id)
        }).catch(() => {
          wx.showToast({
            title: '卡片上传失败',
            duration: 1000,
            icon: 'loading'
          })
        })
        problems.push(card)
      }
      wx.setStorageSync('myChoices_list_prefer', problems)
      wx.navigateBack()
    }
    setTimeout(() => {
      this.setData({
        saveLoading: false
      })
    }, 500);
  },
  /**
   * 点击了上面的图片
   */
  top: function(){
    var that=this
    console.log("点击了上面的图片")
    var now = this.data.now
    this.data.weight[this.data.show[now].top_id]+=1

    if (now == this.data.show.length - 1) {
      console.log(this.data.weight)
      wx.showModal({
        title: '提示',
        content: '我们将根据您刚才的选择调整选项被选中的概率',
        showCancel: false,
        success(res) {
          if (that.data.begin) {
            wx.redirectTo({
              url: '/pages/luck/choose/choose?msg=' + that.getMsg()
            })
            return
          }
          if (res.confirm) {
            console.log('用户点击确定')
            that.save()
            return
          }
        }
      })
    }

    this.setData({
      now: now + 1
    })
  },
  /**
   * 点击了下面的图片
   */
  bottom: function(){
    console.log("点击了下面的图片")
    var now = this.data.now
    var that=this
    this.data.weight[this.data.show[now].bottom_id] += 1

    if(now==this.data.show.length-1){
      console.log(this.data.weight)
      wx.showModal({
        title: '提示',
        content: '我们将根据您刚才的选择调整选项被选中的概率',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            if(that.data.begin){
              wx.redirectTo({
                url: '/pages/luck/choose/choose?msg=' + that.getMsg()
              })
              return
            }
            console.log('用户点击确定')
            that.save()
            return
          }
        }
      })
    }

    this.setData({
      now: now + 1
    })
  },
  //用于打乱数组的时候使用
  randomSort: function(a,b){
    return Math.random() > .5 ? -1 : 1
  },
  getMsg: function(){
    var sum = 0
    var i
    for (i of this.data.weight) {
      sum += i
    }
    var ans = Math.random() * sum
    for (i = 0; i < this.data.leftCount; i++) {
      ans -= this.data.weight[i]
      if (ans <= 0) return this.data.choices[i]
    }
  }
})