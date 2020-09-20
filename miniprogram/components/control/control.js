const backgroundAudioManager = wx.getBackgroundAudioManager()
let currentsec = -1
let isMoving = false
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    music: Object,
  },

  /**
   * 组件的初始数据
   */
  data: {
    time: {
      currentTime: '00:00',
      totalTime: '00:00'
    },
    progress: 0,
    totalT: 0,
    movableViewDist: 0,
    rpxRadio: 0,
    newTime: 0
  },

  lifetimes: {
    ready() {
      this.setData({
        ["time.totalTime"]: this._formatTime(this.data.totalTime)
      })
      this._bindMusicEvent()
      wx.getSystemInfo({
        success: (result) => {
          console.log(result.pixelRatio)
          this.setData({
            rpxRadio: result.pixelRatio
          })
        },
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _bindMusicEvent(){
      backgroundAudioManager.onPlay(()=>{
        console.log("onPlay")
        isMoving = false
      })
      backgroundAudioManager.onStop(()=>{
        console.log("onStop")
      })
      backgroundAudioManager.onPause(()=>{
        console.log("onPause")
      })
      backgroundAudioManager.onTimeUpdate(()=>{
        console.log("onTimeUpdata")
        if(!isMoving && (currentsec != Math.floor(backgroundAudioManager.currentTime))){
          this.setData({
            ["time.currentTime"]: this._formatTime(backgroundAudioManager.currentTime),
            progress: backgroundAudioManager.currentTime / this.data.totalT * 100,
            movableViewDist: (455-36)/this.data.rpxRadio * this.data.progress / 100
          })
          currentsec = Math.floor(backgroundAudioManager.currentTime)
        }
        
      })
      backgroundAudioManager.onCanplay(()=>{
        console.log("onCanplay")
        if(backgroundAudioManager.duration === undefined){
          setTimeout(()=>{
            this.setData({
              ["time.totalTime"]: this._formatTime(backgroundAudioManager.duration),
              totalT: backgroundAudioManager.duration
            })
          }, 1000)
        }else{
          this.setData({
            ["time.totalTime"]: this._formatTime(backgroundAudioManager.duration),
            totalT: backgroundAudioManager.duration,
          })
        }
        
      })
      backgroundAudioManager.onWaiting(()=>{
        console.log("onWaiting")
      })
      backgroundAudioManager.onEnded(()=>{
        console.log("onEnded")
        this.triggerEvent("musicEnd")
      })
    },

    onChange(event){
      if(event.detail.source == 'touch'){
        let newtime = event.detail.x * this.data.rpxRadio / (455-36) * this.data.totalT
        this.data.newTime = newtime
        this.data.movableViewDist = (455-36)/this.data.rpxRadio * newtime / this.data.totalT 
        isMoving = true
      }
    },

    onTouchEnd(event){
      console.log(this.data.newTime)
      this.setData({
        newTime: this.data.newTime,
        progress: this.data.newTime / this.data.totalT * 100,
        movableViewDist: this.data.movableViewDist
      })
      backgroundAudioManager.seek(this.data.newTime)
      isMoving = false
    },

    _formatTime(time) {
      let min = Math.floor(time / 60)
      let sec = Math.floor(time % 60)
      return (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec)
    }
  }
})
