const { requestCloud } = require('../../utils/request')
// pages/user/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: false,
    userInfo: {},
    edit: false,
    showTimePicker: false,
    timeType: '',
    currentDate: new Date().getTime(),
    minDate: new Date(1920, 1, 1).getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      }
      if (type === 'month') {
        return `${value}月`;
      }
      if (type === 'day') {
        return `${value}日`;
      }
      return value;
    },
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
    this.initUserInfo();
  },
  initUserInfo() {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
        hasUserInfo: true
      })
    }
  },
  setUserInfo() {
    wx.setStorageSync('userInfo', this.data.userInfo)
  },
  onEdit() {
    this.setData({ edit: true })
  },
  async onSave() {
    this.setData({ edit: false })
    this.setUserInfo()
    try {
      const res = await requestCloud('studyAbroadAssistant', {
        type: 'updateUserInfo',
        userInfo: this.data.userInfo
      })
      console.log(res)
    } catch (error) {
      console.error(error)
    }
  },
  onShowTimePicker(e) {
    const type = e.currentTarget.dataset.type
    this.setData({showTimePicker: true, timeType: type})
  },
  onTimePickerConfirm(event) {
    this.setData({
      showTimePicker: false,
      currentDate: event.detail,
    });
    if (this.data.timeType === 'birthday') {
      this.setData({
        ['userInfo.birthday']: event.detail,
      });
    } else if (this.data.timeType === 'graduateTime') {
      this.setData({
        ['userInfo.graduateTime']: event.detail,
      });
    }
  },
  onLogout() {
    this.setData({
      userInfo: {},
      hasUserInfo: false
    })
    wx.removeStorageSync('userInfo')
    wx.reLaunch({
      url: '../login/index'
    })
  },
  jumpToEdit(e) {
    const type = e.currentTarget.dataset.type
    const { userInfo} = this.data
    wx.navigateTo({
      url: '/page/edit/index',
      success: res => {
        // 这里给要打开的页面传递数据.  第一个参数:方法key, 第二个参数:需要传递的数据
        res.eventChannel.emit('setUserInfoAndType', {
          type,
          userInfo
        })
      }
    })
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})