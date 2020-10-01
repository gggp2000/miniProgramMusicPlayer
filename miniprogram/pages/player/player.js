const backgroundAudioManager = wx.getBackgroundAudioManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    idx: 0,
    musiclist: Array,
    music: Object,
    isPlaying: true,
    lyric: String,
    isLyricHidden: true
  },
  playPauseMusic() {
    if (this.data.isPlaying) {
      backgroundAudioManager.pause()
    } else {
      backgroundAudioManager.play()
    }
    this.setData({
      isPlaying: !this.data.isPlaying
    })
  },

  next() {
    let index = this.data.idx
    index++
    if (index >= this.data.musiclist.length) {
      index = 0
    }
    this.setData({
      idx: index,
      music: this.data.musiclist[index],
      isPlaying: true
    })
    this._loadMusic()
  },

  prev() {
    let index = this.data.idx
    index--
    if (index < 0) {
      index = this.data.musiclist.length - 1
    }
    this.setData({
      idx: index,
      music: this.data.musiclist[index],
      isPlaying: true
    })
    this._loadMusic()
  },

  _loadMusic() {
    //console.log(this.data.music)
    wx.setNavigationBarTitle({
      title: this.data.music.name,
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: 'track',
        musicid: this.data.music.id
      }
    }).then((res) => {
      console.log(res.result)
      backgroundAudioManager.autoplay = this.data.isPlaying
      backgroundAudioManager.src = res.result.data[0].url
      backgroundAudioManager.title = this.data.music.name
      backgroundAudioManager.coverImgUrl = this.data.music.al.picUrl
      backgroundAudioManager.singer = this.data.music.ar[0].name
      backgroundAudioManager.epname = this.data.music.al.name
    }).catch((err) => {
      console.error(err)
    })
    this._loadLyric()
  },

  _loadLyric(){
    wx.cloud.callFunction({
      name:'music',
      data:{
        $url: 'lyric',
        musicid: this.data.music.id
      }
    }).then((res)=>{
      let lyric = "暂无歌词"
      const lrc = res.result.lrc
      if(lrc){
        lyric = lrc.lyric
      }
      this.setData({
        lyric: lyric
      })
      // console.log(this.data.lyric)
    })
  },

  switchLyric(){
    this.setData({
      isLyricHidden: !this.data.isLyricHidden
    })
  },

  timeUpdate2Lyric(event){
    this.selectComponent('.lyric').update(event.detail.currentTime)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      idx: options.musicidx,
      musiclist: wx.getStorageSync('tracks'),
      music: (wx.getStorageSync('tracks'))[options.musicidx]
    })
    console.log(this.data)
    this._loadMusic()
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