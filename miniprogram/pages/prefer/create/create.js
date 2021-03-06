// pages/luck/create/create.js
var util = require('../../../utils/util.js');
import regeneratorRuntime from '../../../regenerator-runtime/runtime.js';
const app = getApp()
Page({
  data: {
    input: '',
    choices: [],
    weight: [],
    leftCount: 0,
    title: '',  
    problems: [],
    edit:0,
    saveLoading:false,
    alpha:"ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    inputDisabled:false,
    example: [],
    disabled : false
  },

  //保存一个新的卡组同时跟新云服务器中的卡组
  save: async function () {
    this.setData({
      saveLoading:true
    })
    if(this.data.leftCount<2){
      wx.showToast({
        title: '偏好选择至少需要两个选项',
        icon: 'none',
        duration: 1500
      })
      this.setData({
        saveLoading: false
      })
      return
    }
    if(this.data.title!='') {
      if (!this.data.weight) {
        console.log(this.data.choices)
        wx.setStorageSync("prefer_index", this.data.choices)
        wx.redirectTo({
          url: '../index/index?title=' + this.data.title + '&edit=' + this.data.edit
        })
        return
      }
    //  wx.setStorageSync('choices_list', this.data.choices)
      var problems = this.data.problems
      var card = {
        title: this.data.title,
        choices: this.data.choices,
        weight: this.data.weight,
        nOfCards: this.data.leftCount,
        date: util.formatTime(new Date()),
      }
      const db = wx.cloud.database()
      if(this.data.edit ) {
        var index = this.data.edit - 1
        console.log(card)
        var _id = problems[index]._id
        await db.collection('prefer_cards').doc(problems[index]._id).set({
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
        problems[this.data.edit-1] = card
      }
      else {
        await db.collection('prefer_cards').add({
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
    }else{
      wx.showToast({
        title: '请输入题目',
        duration: 1000,
        icon: 'none'
      })
    }
    setTimeout(() => {
      this.setData({
        saveLoading: false
      })
    }, 500);
  },
 

  onLoad: function (e) {
    app.getOpenid()
    if (wx.getStorageSync('myChoices_list_prefer') && e.data != 1) {
      var problems = wx.getStorageSync('myChoices_list_prefer')
      this.setData({
        problems: problems
      })
    }
    if (wx.getStorageSync('edit') && e.data != 1) {
      this.setData({
        edit: wx.getStorageSync('edit'),
        choices: this.data.problems[wx.getStorageSync('edit')-1].choices,
        title: this.data.problems[wx.getStorageSync('edit')-1].title,
        leftCount: this.data.problems[wx.getStorageSync('edit')-1].nOfCards,
        weight: this.data.problems[wx.getStorageSync('edit') - 1].weight
      })
    }
    if (this.data.leftCount >= 26) {
      this.setData({
        inputDisabled: true
      })
    }

  },
  
  onShow: function () {

  },

  inputChangeHandle: function (e) {
    this.setData({ input: e.detail.value })
  },

  addchoiceHandle: function (e) {
    if (!this.data.input || !this.data.input.trim()) return
    this.data.weight = null
    var choices = this.data.choices
    choices.push(this.data.input)
    this.setData({
      input: '',
      choices: choices,
      leftCount: this.data.leftCount + 1
    })
    if (this.data.leftCount >= 26) {
      this.setData({
        inputDisabled: true
      })
    }
  },


  removechoiceHandle: function (e) {
    this.data.weight = null
    var index = e.currentTarget.dataset.index
    var choices = this.data.choices
    var remove = choices.splice(index, 1)[0]
    this.setData({
      choices: choices,
      leftCount: this.data.leftCount - 1
    })
    if (this.data.leftCount < 26) {
      this.setData({
        inputDisabled: false
      })
    }
    //this.save()
  },
  
  onChange(event) {
    // event.detail 为当前输入的值
    this.setData({title : event.detail})
  },

  begin: function (){
    if(this.data.leftCount<2){
      wx.showToast({
        title: '偏好选择至少需要两个选项',
        duration: 1500,
        icon: 'none'
      })
      return
    }
    if (!this.data.weight) {
      wx.setStorageSync("prefer_index", this.data.choices)
      wx.redirectTo({
        url: '../index/index?begin=1',
      })
      return
    }
    wx.redirectTo({
      url: '/pages/luck/choose/choose?msg=' + this.getMsg()
    })
  },
  getMsg: function(){
    var sum = 0
    var i
    for(i of this.data.weight){
      sum+=i
    }
    var ans =  Math.random() * sum
    for(i=0; i<this.data.leftCount;i++){
      ans-=this.data.weight[i]
      if(ans<=0)return this.data.choices[i]
    }
  }
})
