// pages/luck/create/create.js
const app = getApp()
Page({
  data: {
    input: '',
    choices: [],
    leftCount: 0,
    title: '',
    problems: [],
    edit:0
  },

  //保存一个新的卡组同时跟新云服务器中的卡组
  save: function () {
    if(this.data.title!='') {
    //  wx.setStorageSync('choices_list', this.data.choices)
      var problems = this.data.problems
      var card = {
        title: this.data.title,
        choices: this.data.choices,
        nOfCards: this.data.leftCount,
        date: new Date,
      }
      if(this.data.edit) {
        problems[this.data.edit-1] = card
      }
      else {
        problems.push(card)
      }
      wx.setStorageSync('myChoices_list', problems)

      const db = wx.cloud.database()
      db.collection('user_cards').add({
        data: card
      }).then(()=>{
        console.log('数据上传成功')
      }).catch(() => {
        wx.showToast({
          title: '卡片上传失败',
          duration: 1000,
          icon: 'loading'
        })
      })
      wx.navigateBack()
    }else{
      wx.showToast({
        title: '请输入题目',
        duration: 1000,
        icon: 'none'
      })
    }
  },

 

  onLoad: function () {
    if (wx.getStorageSync('myChoices_list') != "") {
      var problems = wx.getStorageSync('myChoices_list')
      this.setData({
        problems: problems
      })
    }
    if (this.data.edit = wx.getStorageSync('edit')) {
      this.setData({
        choices: this.data.problems[this.data.edit-1].choices,
        title: this.data.problems[this.data.edit-1].title
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
    choices.push({ name: this.data.input })
    this.setData({
      input: '',
      choices: choices,
      leftCount: this.data.leftCount + 1
    })
    //this.save()
  },


  removechoiceHandle: function (e) {
    var index = e.currentTarget.dataset.index
    var choices = this.data.choices
    var remove = choices.splice(index, 1)[0]
    this.setData({
      choices: choices,
      leftCount: this.data.leftCount - 1
    })
    //this.save()
  },
  
  onChange(event) {
    // event.detail 为当前输入的值
    this.setData({title : event.detail})
  },

  begin: function (){

  }
})
