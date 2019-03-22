const app = getApp()
import regeneratorRuntime from '../../regenerator-runtime/runtime.js';
Page({
  data: {
    hidden: false,
    content: [],
    length: 0,
    total: null,
    last_date: null,
    begin: null,
    allin: false,//数据库中所有的卡片都已经被加载了
    now_unique: -1,
    refresh: false,
    first_log: true
  },
  //点击加入新的问问
  add_new_ask: function () {
    if(!app.globalData.userInfo){
      setTimeout(()=>{
        wx.showToast({
          title: "未登陆",
          icon: "none",
          duration: 300
        })
      }, 1000)
      wx.navigateTo({
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

  /*
  //加载新的卡片,每次十张
  load_card: function(){
    if(this.data.allin)return
    var lt = 10,
        begin = this.data.begin,
        that = this
    begin -= lt
    if(begin < 0){
      this.data.allin=true
      lt += begin
      begin = 0
    }
    this.data.begin=begin
    const col = wx.cloud.database().collection('questions')
    console.log("从哪里开始",begin)
    console.log("加载多少个",lt)
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
          if(that.data.first_log){
            that.data.first_log=false
            that.setData({
              first_log: false,
              hidden: true
            })
          }
        }).catch(err=>{
          console.error("获取记录失败：", err)
        })
  },
  */
//加载卡片 一次十张
load_card: function () {
  var lt = 10,
      that = this
  const col = wx.cloud.database().collection('questions')
  var that=this
  new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name: 'get_cards_number',
      data: {},
      success: res => {
        console.log("数据库中的记录个数：", res.result.total)
        that.data.last_total=that.data.total
        that.data.total = res.result.total
        resolve()
      },
      fail: err => {
        console.error("调用失败:", err)
      }
    })
  }).then(res=>{
    var begin=that.data.begin
    begin+=that.data.total- that.data.last_total
    console.log("从哪里开始", begin)
    console.log("上一次的总数", that.data.last_total)
    console.log("这一次的总数", that.data.total)
    if(begin>=that.data.total)return
    col.skip(begin)
      .limit(lt)
      .orderBy('date', 'desc')
      .get()
      .then(res => {
        console.log(res.data)
        var cont = that.data.content,i
        for (i of res.data) {
          that.data.now_unique += 1
          i.unique = that.data.now_unique
          //加载的时候之前就已经投过票了
          if (i.used.includes(app.globalData.openid)) {
            i.left_txt = i.left + '票'
            i.right_txt = i.right + '票'
            i.hased = true;
          } else {
            i.hased = false
          }
          cont.push(i)
        }
        that.setData({
          content: cont
        })
        if (that.data.first_log) {
          that.data.first_log = false
          that.setData({
            first_log: false,
            hidden: true
          })
        }
      }).catch(err => {
        console.error("获取记录失败：", err)
      })
      that.data.begin+=lt
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
          begin: 0
        })
        this.load_card()
      },
      fail: err=>{
        console.error("调用失败:", err)
      }
    })
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
            last_total: res.result.total,
            begin: 0
          })
          that.load_card()
        },
        fail: err => {
          console.error("调用失败:", err)
        }
      })
    }
  },
  //点击了卡片跳转
  comment: function(e) {
    wx.setStorageSync('ask', e.currentTarget.dataset.ask)
    wx.navigateTo({
      url: '/pages/ask/watch/watch',
    })
  },
  onPullDownRefresh: function () {
    this.onLoad
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.onLoad
  }
})
