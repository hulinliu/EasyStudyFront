// miniprogram/pages/noteWordAndImage/noteWordAndImage.js
const time = require("../../utils/time.js");
const uuid = require("../../utils/uuid.js")
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    images:[],
    head: "",
    content: "",
    imageType:[],
    imagesId: []
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

  },

  //获取文本框的值(标题)
  listenerPhoneInput: function (e) {
    this.setData({
      head: e.detail.value
    })
    //console.log(words);
  },
  //获取文本框的值(内容)
  listenercontent: function (e) {
    this.setData({
      content: e.detail.value
    })
    //console.log(words);
  },
  //发布笔记
  publish() {
    wx.showLoading({
      title: '正在发布',
    })
    var that = this
    console.log(this.data.head);
    var ttime = time.formatTime(new Date);
    var uid = uuid.guid();
    //console.log(this.data.images)
    //开始上传图片
    for (let i = 0; i < this.data.images.length; i++) {
      //图片base64编码
      wx.getFileSystemManager().readFile({
        filePath: that.data.images[i], //选择图片返回的相对路径
        encoding: 'base64', //编码格式
        success: res => { //成功的回调
          //console.log(res.data)
          //调用云函数上传图片
          wx.cloud.callFunction({
            // 云函数名称
            name: 'uploadFile',
            // 传给云函数的参数
            data: {
              data: res.data,
              name: uid + i + "." + that.data.imageType[i],
            },
            success(res) {
              console.log(res);
              that.data.imagesId.push(res.result.fileID);
            },
            fail: console.error
          });
        }
      })
    }
    setTimeout(function () {
      //console.log(app.globalData.id)
      console.log(that.data.imagesId)
      wx.cloud.callFunction({
        // 云函数名称
        name: 'addNote',
        // 传给云函数的参数
        data: {
          id: app.globalData.id,
          content: that.data.content,
          type: 4,//图文
          fileId: that.data.imagesId,
          head: that.data.head,
          time: ttime
        },
        success(res) {
          wx.hideLoading();
          wx.showToast({
            title: '发布成功',
            icon: 'success',
          });
          setTimeout(function () {
            wx.navigateTo({
              url: '../note/note',
            })
          }, 1500)
        },
        fail: console.error
      });
    }, this.data.images.length==1?3000:this.data.images.length * 1500)
  },
  //选择图片
  chooseImage(e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        //console.log(res)
        wx.getImageInfo({
          src: res.tempFilePaths[0],
          success(res) {
            that.data.imageType.push(res.type)
          }
        })
        const images = that.data.images.concat(res.tempFilePaths[0])
        // 限制最多只能留下6张照片
        //that.data.images = images.length <= 6 ? images : images.slice(0, 6)
        that.setData({
          images: images.length <= 6 ? images : images.slice(0, 6),
          imageType: that.data.imageType.length <= 6 ? that.data.imageType : that.data.imageType.slice(0, 6)
        })
      }
    })
  },
  //移除图片
  removeImage(e) {
    const idx = e.target.dataset.idx
    this.data.images.splice(idx, 1);
    const timages = this.data.images;
    //console.log(timages)
    this.setData({
      images: timages
    })
  },
  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.images
    wx.previewImage({
      current: images[idx], //当前预览的图片
      urls: images, //所有要预览的图片
    })
  },
})