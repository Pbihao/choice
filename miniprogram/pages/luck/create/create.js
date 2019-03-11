// pages/luck/create/create.js
Page({
  data: {
    input: '',
    choices: [],
    leftCount: 0,
    title: '',
    problems: []
  },

  save: function () {
    if(this.data.title!='') {
    //  wx.setStorageSync('choices_list', this.data.choices)
      var problems = this.data.problems
      problems.push({
        title: this.data.title,
        choices: this.data.choices,
        nOfCards: this.data.leftCount
      })
      wx.setStorageSync('myChoices_list', problems)
      wx.navigateBack()
    }

    /*
    var myChoices = this.data.myChoices
    myChoices.push(Choice)
    this.setData({
      myChoices: myChoices
    })
    this.save()
    */
  },

  load: function () {
    //var choices = wx.getStorageSync('choices_list')
    if (wx.getStorageSync('myChoices_list')!="") {
      var problems = wx.getStorageSync('myChoices_list')
      this.setData({
        //choices: choices, 
        problems: problems
      })
    }

  },

  onLoad: function () {
    
  },
  
  onShow: function () {
    this.load()
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
      leftCount: this.data.leftCount
    })
    //this.save()
  },


  clearHandle: function (e) {
    var choices = this.data.choices
    var remains = []
    this.setData({ choices: remains})
    this.save()
  }, 
  
  onChange(event) {
    // event.detail 为当前输入的值
    this.setData({title : event.detail})
    console.log(event.detail)
  }

})
