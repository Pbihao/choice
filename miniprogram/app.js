//app.js
App({
  onLaunch: function () {
    var that = this
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              that.setglo
              that.globalData.userInfo = res.userInfo
              that.avatarUrl = res.userInfo.avatarUrl
            }
          })
        }
      }
    })
  },

  globalData: {
    userInfo: null,
    openid: null,
    avatarUrl: "/images/user-unlogin.png"
  },

  getOpenid: function () {
    var that = this
    return new Promise((resolve, reject) => {
      if(that.globalData.openid){
        resolve()
      }else{
        wx.cloud.callFunction({
          name: 'login',
          data: {},
          success: res => {
            that.globalData.openid = res.result.openid
            resolve()
          },
          fail: err => {
            console.error('[云函数] [login] 调用失败', err)
            reject()
          }
        })
      }
    })
  }
})