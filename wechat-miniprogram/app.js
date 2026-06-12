App({
  onLaunch() {
    const token = wx.getStorageSync('token')
    if (token) {
      this.globalData.token = token
    }
  },
  globalData: {
    token: '',
    // 部署后替换为云托管真实地址
    cloudHostingUrl: 'https://ds-269783-9-1300592693.sh.run.tcloudbase.com'
  }
})
