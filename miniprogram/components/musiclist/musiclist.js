Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tracks: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    playingId: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goToTrack(event) {
      const musicId = event.currentTarget.dataset.musicid
      const idx = event.currentTarget.dataset.index
      console.log(musicId)
      this.setData({
        playingId: musicId
      })
      wx.navigateTo({
        url: `../../pages/player/player?musicid=${musicId}&musicidx=${idx}`,
      })
    }
  }
})