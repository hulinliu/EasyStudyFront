//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    /**
        * 页面配置
        */
    winWidth: 0,
    winHeight: 0,
    // tab切换
    currentTab: 0,
    time: '',
    image: '',
    engword: '',
    chnword: '',
    myword: '',
    voide: ''
  },
  onLoad: function () {
    var that = this;

    /**
     * 获取系统信息
     */
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });
  },
  /**
     * 滑动切换tab
     */
  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });

  },
  /**
   * 点击tab切换
   */
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
      if (e.target.dataset.current==0){
        that.get();
      }
    }
  },
  get() {
    var that = this;
    var url = "http://open.iciba.com/dsapi/";
    wx.cloud.callFunction({
      // 云函数名称
      name: 'http',
      // 传给云函数的参数
      data: {
        url: url
      },
      success(res) {
        console.log(res.result);
        that.setData({
          time: res.result.dateline,
          engword: res.result.content,
          chnword: res.result.note,
          image: res.result.picture2,
          voide: res.result.tts,
          myword: res.result.translation
        })
      },
      fail: console.error
    });
  },
  play: function () {
    this.innerAudioContext = wx.createInnerAudioContext();
    this.innerAudioContext.onError((res) => {
      // 播放音频失败的回调
    })
    this.innerAudioContext.src = this.data.voide;  // 这里可以是录音的临时路径
    this.innerAudioContext.play()
  },
})