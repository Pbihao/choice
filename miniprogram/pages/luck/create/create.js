// pages/luck/create/create.js
var util = require('../../../utils/util.js');
import regeneratorRuntime from '../../../regenerator-runtime/runtime.js';
const app = getApp()
Page({
  data: {
    input: '',
    choices: [],
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
    if(this.data.title!='') {
    //  wx.setStorageSync('choices_list', this.data.choices)
      var problems = this.data.problems
      var card = {
        title: this.data.title,
        choices: this.data.choices,
        nOfCards: this.data.leftCount,
        date: util.formatTime(new Date()),
      }
      const db = wx.cloud.database()
      if(this.data.edit ) {
        var index = this.data.edit - 1
        console.log(card)
        var _id = problems[index]._id
        await db.collection('user_cards').doc(problems[index]._id).set({
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
        await db.collection('user_cards').add({
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
      wx.setStorageSync('myChoices_list', problems)
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
    if (wx.getStorageSync('myChoices_list')) {
      var problems = wx.getStorageSync('myChoices_list')
      this.setData({
        problems: problems
      })
    }
    if (wx.getStorageSync('edit')) {
      this.setData({
        edit: wx.getStorageSync('edit'),
        choices: this.data.problems[wx.getStorageSync('edit')-1].choices,
        title: this.data.problems[wx.getStorageSync('edit')-1].title,
        leftCount: this.data.problems[wx.getStorageSync('edit')-1].nOfCards
      })
    }
    if (wx.getStorageSync('example')||e.data==1) {
      var example = wx.getStorageSync('defualt_cards')
      console.log(example)
      console.log(wx.getStorageSync('example'))
      this.setData({
        edit:1,
        example: example,
        choices: example.choices,
        title: example.title,
        leftCount: example.choices.length,
        disabled: true
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
    var id = Math.floor(Math.random() * this.data.leftCount)
    var msg = this.data.choices[id]
    wx.redirectTo({
      url: '/pages/luck/choose/choose?msg=' + msg
    })
  }
})
