// components/bottom-modal/bottom-modal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    modalShow: Boolean
  },
  
  options:{
    multipleSlots: true,
    styleIsolation: 'apply-shared',
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
    cancel(){
      this.setData({
        modalShow: false
      })
    }
  }
})
