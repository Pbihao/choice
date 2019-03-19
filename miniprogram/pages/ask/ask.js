const app = getApp()
import regeneratorRuntime from '../../regenerator-runtime/runtime.js';
Page({
  data: {
    hidden: true,
    content: [],
    length: 0,
    total: null,
    begin: null,
    allin: false,//数据库中所有的卡片都已经被加载了
    now_unique: -1,
    refresh: false
  },
  //点击加入新的问问
  add_new_ask: function () {
    if(!app.globalData.userInfo){
      wx.showToast({
        title: "未登陆",
        duration: 1000
      })
      wx.switchTab({
        url: '../mine/mine',
      })
      return
    }else{
      console.log("用户信息", app.globalData.userInfo)
    }
    console.log("发布新的问问")
    wx.navigateTo({
      url: './edit/edit',
    })
  },
  //点击左边的按钮
  click_left: function (e) {
    var that = this
    var id = e.currentTarget.dataset.index
    console.log("点击了左边的按钮",this.data.content[id])
    if (this.data.content[id].hased) return
    this.data.content[id].hased = true
    var mcontent = this.data.content
    mcontent[id].right_txt = that.data.content[id].right + '票'
    mcontent[id].left_txt = that.data.content[id].left + 1 + '票'
    this.setData({
      content: mcontent
    })
    wx.cloud.callFunction({
      name: 'update_card',
      data: {
        openid: app.globalData.openid,
        id: this.data.content[id]._id,
        left: 1,
        right: 0
      },
      success: res => {
        console.log("更改数据库成功", res)
      },
      fail: err => {
        consol.error("更改数据失败", err)
      }
    })
  },
  //点击右边的按钮
  click_right: function (e) {
    var that = this
    var id = e.currentTarget.dataset.index
    console.log(this.data.content[id])
    if(this.data.content[id].hased)return
    this.data.content[id].hased = true
    var mcontent = this.data.content
    mcontent[id].right_txt = that.data.content[id].right + 1 + '票'
    mcontent[id].left_txt = that.data.content[id].left +  '票'
    this.setData({
      content: mcontent
    })
    wx.cloud.callFunction({
      name: 'update_card',
      data:{
        openid: app.globalData.openid,
        id: this.data.content[id]._id,
        left: 0,
        right: 1
      },
      success: res=>{
        console.log("更改数据库成功", res)
      },
      fail: err=>{
        consol.error("更改数据失败", err)
      }
    })
  },
  //点击了查看图片
  see_img: function (e) {
    var that=this
    var id = e.currentTarget.dataset.index
    console.log("查看图片",id)
    wx.previewImage({
      urls: [that.data.content[id].img_path]
    })
  },
  //加载新的卡片,每次十张
  load_card: function(){
    if(this.data.allin)return
    console.log("从哪里开始",this.data.begin)
    var lt = 10,
        begin = this.data.begin,
        that = this
    begin -= 10
    if(begin < 0){
      this.data.allin=true
      lt += begin
      begin = 0
    }
    const col = wx.cloud.database().collection('questions')
    col.skip(begin)
       .limit(lt)
       .orderBy('date', 'desc')
        .get()
        .then(res=>{
          console.log(res.data)
          var cont = that.data.content,
              i
          for(i of res.data){
            that.data.now_unique+=1
            i.unique=that.data.now_unique
            //加载的时候之前就已经投过票了
            if(i.used.includes(app.globalData.openid)){
              i.left_txt = i.left + '票'
              i.right_txt = i.right + '票'
              i.hased=true;
            }else{
              i.hased=false
            }
            cont.push(i)
          }
          that.setData({
            content: cont
          })
        }).catch(err=>{
          console.error("获取记录失败：", err)
        })
  },
  //第一次打开界面 获得加载问问的起点
  onLoad: async function () {
    let scrollHeight = wx.getSystemInfoSync().windowHeight;
    this.setData({
      scrollHeight: scrollHeight,
    });
    await wx.cloud.callFunction({
      name: 'get_cards_number',
      data:{},
      success: res=>{
        console.log("数据库中的记录个数：", res.result.total)
        this.setData({
          total: res.result.total,
          begin: res.result.total
        })
        this.load_card()
      },
      fail: err=>{
        console.error("调用失败:", err)
      }
    })
    if(!app.globalData.openid){
      await app.getOpenid()
    }
  },
  onShow: async function(){
    var that=this
    if (that.data.refresh){
      that.data.refresh=false
      that.data.hidden = true
      that.data.length = 0
      that.data.allin = false
      that.data.now_unique = -1
      that.data.content=[]
      await wx.cloud.callFunction({
        name: 'get_cards_number',
        data: {},
        success: res => {
          console.log("数据库中的记录个数：", res.result.total)
          that.setData({
            total: res.result.total,
            begin: res.result.total
          })
          that.load_card()
        },
        fail: err => {
          console.error("调用失败:", err)
        }
      })
      if (!app.globalData.openid) {
        await app.getOpenid()
      }
    }
  },
  //点击了卡片跳转
  comment: function(e) {
    console.log(e.currentTarget.dataset.ask)
    wx.setStorageSync('ask', e.currentTarget.dataset.ask)
    wx.navigateTo({
      url: '/pages/ask/watch/watch',
    })
  }
})
