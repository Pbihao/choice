const app=getApp()
Page({
  data: {
    choices: ["选项一", "选项二", "选项三", "选项四"],//记录用户设定的选择
    weight:[],//对于每一个选择的额外权重
    show:[],

    leftCount: 0,
    title: '',
    scrollHeight: null,
    now: 0,
    begin: false
  },
  onLoad: function(e){
    console.log(e)
    if(e.begin=='1'){
      this.data.begin=true
    }
    this.data.choices=wx.getStorageSync("prefer_index")
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
      this.data.weight.push(0)
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

  top: function(){
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
          if (res.confirm) {
            console.log('用户点击确定')
            return
          }
        }
      })
    }

    this.setData({
      now: now + 1
    })
  },
  bottom: function(){
    console.log("点击了下面的图片")
    var now = this.data.now
    this.data.weight[this.data.show[now].bottom_id] += 1

    if(now==this.data.show.length-1){
      console.log(this.data.weight)
      wx.showModal({
        title: '提示',
        content: '我们将根据您刚才的选择调整选项被选中的概率',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
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
  }
})