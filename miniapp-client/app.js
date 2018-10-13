wx.cloud.init({ traceUser: true })
var db = wx.cloud.database()

//app.js
App({
  onLaunch: function () {
    
  },
  globalData: {
    userInfo: null
  }
})