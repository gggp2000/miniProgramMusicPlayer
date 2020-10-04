Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalShow: false,
    userInfo: {},
  },

  pinglun() {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting["scope.userInfo"]) {
          wx.getUserInfo({
            success: (res) => {
              console.log(res.userInfo)
              this.setData({
                userInfo: res.userInfo
              })
            }
          })
          wx.navigateTo({
            url: '../blogedit/blogedit',
          })
        } else {
          this.setData({
            modalShow: true
          })
        }
      }
    })
  },

  AuthSuccess(event) {
    console.log(event.detail)
    this.setData({
      userInfo: event.detail
    })
    wx.navigateTo({
      url: '../blogedit/blogedit',
    })
  },

  AuthFail(){
    console.log("用户未同意授权。")
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})