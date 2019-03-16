//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    hidden: true,
    avatar_url: 'https://wx.qlogo.cn/mmopen/vi_32/1urhm5wsUW1pSQDlxm16pufu8jWeWyn154ibFHbRNRC2YGd8lqhjJ3ZnpfXOicKyU1iayre0ENDproibgVziciajyMUQ/132',
    content: [{
      detail: "打发撒旦发",
      img_path: '../../images/answer.png',
      is_loading: false,
      used: false,
      yes: 100,
      left_txt: '同意',
      right_txt: '反对',
      no: 100,
      avatar_url: 'https://wx.qlogo.cn/mmopen/vi_32/1urhm5wsUW1pSQDlxm16pufu8jWeWyn154ibFHbRNRC2YGd8lqhjJ3ZnpfXOicKyU1iayre0ENDproibgVziciajyMUQ/132',
      avatar_name: '蓄山羊胡的猫的猫',
      unique: '0'
    },

    {
      detail: "打发撒旦发",
      img_path: '../../images/top.png',
      yes: 100,
      used: false,
      is_loading: false,
      left_txt: '同意',
      right_txt: '反对',
      no: 100,
      avatar_url: 'https://wx.qlogo.cn/mmopen/vi_32/1urhm5wsUW1pSQDlxm16pufu8jWeWyn154ibFHbRNRC2YGd8lqhjJ3ZnpfXOicKyU1iayre0ENDproibgVziciajyMUQ/132',
      avatar_name: '蓄山羊胡的猫的猫',
      unique: '1'
    },
    {
      detail: "这天我阿斯顿法定，撒地方大师傅。阿迪斯发士大夫；撒打发士大夫‘士大夫大师傅。",
      img_path: null,
      used: false,
      is_loading: false,
      left_txt: '同意',
      right_txt: '反对',
      yes: 100,
      no: 100,
      avatar_url: 'https://wx.qlogo.cn/mmopen/vi_32/ibBw943icKfs1GrzhwUTl9Cq7Ig5YtTJsGGwAxvtGp5gRhIPyurhyCUMibjnxIeAjdI9RHnpCEAiaFqk60d1iaiawwyw/132',
      avatar_name: '蓄山羊胡的猫',
      unique: '2',

    },
    {
      detail: "我喜欢上了你",
      is_loading: false,
      left_txt: '同意',
      right_txt: '反对',
      used: false,
      img_path: null,
      yes: 100,
      no: 100,
      avatar_url: 'https://wx.qlogo.cn/mmopen/vi_32/1urhm5wsUW1pSQDlxm16pufu8jWeWyn154ibFHbRNRC2YGd8lqhjJ3ZnpfXOicKyU1iayre0ENDproibgVziciajyMUQ/132',
      avatar_name: '蓄山羊胡的猫',
      unique: '3'
    },
    ]
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
    /*
    setTimeout(()=>{
      that.data.content[id].is_loading = false
      that.data.content[id].left_txt = that.data.content[id].yes + 1;
      that.data.content[id].left_txt = that.data.content[id].yes + 1;
    }, 1000)
    */

  },
  //点击了卡片跳转
  click_card: function () {
    console.log("跳转")
  },
  see_img: function () {

    console.log("查看图片")
    wx.previewImage({
      urls: ['https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552673412258&di=1bcaadf104d8169057922342a847e95f&imgtype=0&src=http%3A%2F%2Fwww.jituwang.com%2Fuploads%2Fallimg%2F151015%2F258177-15101516094080.jpg']
    })
  },
  onLoad: function () {
    this.data.content[0].is_loading = true
  }
})
