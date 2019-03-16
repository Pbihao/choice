const app = getApp()

Page({
  data: {
    hidden: true,
    content: [{
      detail: "打发撒旦发",
      img_path: null,
      is_loading: false,
      used: false,
      yes: 100,
      left_txt: '同意',
      right_txt: '反对',
      no: 100,
      avatar_url: 'https://wx.qlogo.cn/mmopen/vi_32/1urhm5wsUW1pSQDlxm16pufu8jWeWyn154ibFHbRNRC2YGd8lqhjJ3ZnpfXOicKyU1iayre0ENDproibgVziciajyMUQ/132',
      avatar_name: '蓄山羊胡的猫的猫',
      unique: '0'
    }],
    length: 0
  },
  //点击加入新的问问
  add_new_ask: function () {

  },
  //点击左边的按钮
  click_left: function (e) {
    console.log(e.currentTarget.dataset.index)
  },
  //点击右边的按钮
  click_right: function (e) {
    var that = this
    var id = e.currentTarget.dataset.index
    var mcontent = this.data.content
    mcontent[id].right_txt = that.data.content[id].right_txt + ':' + (that.data.content[id].no + 1)
    mcontent[id].left_txt = that.data.content[id].left_txt + ':' + that.data.content.yes
    mcontent[id].used = true
    console.log(mcontent[id].left_txt)
    console.log(mcontent[id].right_txt)

    this.setData({
      content: mcontent
    })

  },
  //点击了卡片跳转
  click_card: function () {
    console.log("跳转")
  },
  //点击了查看图片
  see_img: function () {
    console.log("查看图片")
    wx.previewImage({
      urls: ['../../images/top.png']
    })
  },
  //加载新的卡片,每次十张
  load_card: function(){
    
  },
  onLoad: function () {
    let scrollHeight = wx.getSystemInfoSync().windowHeight;
    this.setData({
      scrollHeight: scrollHeight,

    });
    this.load_card();
  }
})
