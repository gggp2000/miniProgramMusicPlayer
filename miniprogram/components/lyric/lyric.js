let ratio = 0
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    lyric: String,
    isLyricHidden: {
      type: Boolean,
      value: false,
    }
  },

  lifetimes: {
    ready() {
      wx.getSystemInfo({
        success(res) {
          ratio = res.screenWidth / 750
          // console.log(ratio)
        }
      })
    }
  },

  observers: {
    lyric(lrc) {
      this._parseLyric(lrc)
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    lyricList: [],
    currentIndex: -1,
    scrollTop: 0,
  },



  /**
   * 组件的方法列表
   */
  methods: {
    update(currentTime) {
      // console.log(currentTime)
      if (this.data.lyricList.length == 0) {
        console.log("暂无歌词")
        return
      }
      if ((currentTime > this.data.lyricList[this.data.lyricList.length-1].time) && (this.data.currentIndex != -1)){
        this.setData({
          currentIndex: this.data.lyricList.length-1,
          scrollTop: this.data.lyricList.length * 64 * ratio
        })
      }
        for (let i = 0, len = this.data.lyricList.length; i < len; i++) {
          if (currentTime < this.data.lyricList[i].time) {
            this.setData({
              currentIndex: i - 1,
              scrollTop: (i - 1) * 64 * ratio
            })
            break
          }
        }
    },

    _parseLyric(sLyric) {
      let line = sLyric.split('\n')
      console.log(line)
      let _lrcList = []
      line.forEach((elem) => {
        let time = elem.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)
        if (time != null) {
          let lrc = elem.split(time)[1]
          // console.log(lrc)
          let timeReg = time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)
          // console.log(timeReg)
          let time2Seconds = parseInt(timeReg[1]) * 60 + parseInt(timeReg[2]) + parseInt(timeReg[3]) / 1000
          _lrcList.push({
            lrc,
            time: time2Seconds
          })
        }
      })
      this.setData({
        lyricList: _lrcList
      })
      console.log(this.data.lyricList)
    }
  }
})