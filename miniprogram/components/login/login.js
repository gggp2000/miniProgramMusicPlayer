Component({
  /**
   * 组件的属性列表
   */
  properties: {
    modalShow: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onGetUserInfo(event){
      console.log(event)
      const userInfo = event.detail.userInfo
      // 判断是否已经获得用户授权
      if(userInfo){
        this.setData({
          modalShow: false
        })
        this.triggerEvent("userInfoSuccess", userInfo)
      }else{
        wx.showModal({
          title: '只有同意授权才能发布信息。',
        })
        this.triggerEvent("userInfoFail")
      }
    }
  }
})
