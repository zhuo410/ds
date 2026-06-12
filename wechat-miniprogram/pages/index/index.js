const app = getApp()

Page({
  data: {
    webviewSrc: '',
    isLoading: true,
    errorMsg: ''
  },

  onLoad() {
    this.getLoginCodeAndLoadUrl()
  },

  onShow() {
    const token = wx.getStorageSync('token') || ''
    app.globalData.token = token
  },

  // 获取登录 code 并加载 web-view
  getLoginCodeAndLoadUrl() {
    const baseUrl = app.globalData.cloudHostingUrl

    if (!baseUrl || baseUrl === 'https://YOUR-SERVICE-URL') {
      this.setData({
        isLoading: false,
        errorMsg: '请先在 app.js 中配置云托管服务地址'
      })
      return
    }

    this.setData({ isLoading: true, errorMsg: '' })

    // 先获取微信登录 code
    wx.login({
      success: (res) => {
        if (res.code) {
          app.globalData.wxCode = res.code
          this.setWebviewUrl(baseUrl, res.code)
        } else {
          this.setWebviewUrl(baseUrl)
        }
      },
      fail: () => {
        this.setWebviewUrl(baseUrl)
      }
    })
  },

  // 拼接 web-view URL
  // 注意：Vue 使用 hash 路由 (#/)，所以 URL 必须以 /#/ 结尾
  setWebviewUrl(baseUrl, code) {
    // 去除 baseUrl 末尾的斜杠
    const cleanUrl = baseUrl.replace(/\/+$/, '')
    const token = wx.getStorageSync('token') || ''

    // 构建 URL：使用 hash 路由格式
    // 参数通过 URL 的 search 部分传递，Vue App.vue 会从 URL search 读取
    let src = cleanUrl + '/#/'

    const params = []
    if (code) params.push('code=' + encodeURIComponent(code))
    if (token) params.push('token=' + encodeURIComponent(token))
    params.push('from=miniprogram')

    src += '?' + params.join('&')

    console.log('[MP] Loading URL:', src)

    this.setData({
      webviewSrc: src,
      isLoading: false,
      errorMsg: ''
    })
  },

  // web-view 加载成功
  onWebviewLoad() {
    console.log('[MP] Webview loaded successfully')
    this.setData({ isLoading: false })
  },

  // web-view 加载失败
  onWebviewError(e) {
    console.error('[MP] Webview error:', JSON.stringify(e.detail))
    this.setData({
      isLoading: false,
      errorMsg: '页面加载失败\n请检查云托管是否已部署成功'
    })
  },

  // 重新加载
  retryLoad() {
    this.setData({ errorMsg: '', isLoading: true })
    this.getLoginCodeAndLoadUrl()
  },

  // 接收 H5 端通过 wx.miniProgram.postMessage 发送的消息
  onWebviewMessage(e) {
    const msgs = e.detail?.data
    const msg = Array.isArray(msgs) ? msgs[0] : msgs
    if (!msg?.type) return

    console.log('[MP] Received:', msg.type)

    switch (msg.type) {
      case 'wechat_code':
        this.handleWechatLogin()
        break
      case 'payment':
        this.handlePayment(msg.data)
        break
      case 'share':
        this.handleShare(msg.data)
        break
      case 'subscribe':
        this.handleSubscribe(msg.data)
        break
      default:
        console.log('[MP] Unknown:', msg.type)
    }
  },

  // 微信登录 - 获取 code 并回传
  handleWechatLogin() {
    wx.login({
      success: (res) => {
        if (res.code) {
          this.sendToWebview({
            type: 'wechat_code',
            data: { code: res.code }
          })
        }
      },
      fail: () => {
        wx.showToast({ title: '登录失败', icon: 'none' })
      }
    })
  },

  // 微信支付
  handlePayment(data) {
    if (!data) return

    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.package,
      signType: data.signType || 'MD5',
      paySign: data.paySign,
      success: () => {
        this.sendToWebview({
          type: 'payment_result',
          data: { success: true }
        })
      },
      fail: (err) => {
        this.sendToWebview({
          type: 'payment_result',
          data: { success: false, error: err.errMsg || '支付取消' }
        })
      }
    })
  },

  // 设置分享
  handleShare(data) {
    if (!data) return

    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })

    app.globalData.shareData = {
      title: data.title || '精选好物，品质生活',
      path: '/pages/index/index',
      imageUrl: data.imageUrl || ''
    }
  },

  // 订阅消息
  handleSubscribe(data) {
    if (!data?.templateIds?.length) return

    wx.requestSubscribeMessage({
      tmplIds: data.templateIds,
      success: (res) => {
        this.sendToWebview({
          type: 'subscribe_result',
          data: res
        })
      }
    })
  },

  // 向 web-view 发消息
  sendToWebview(msg) {
    try {
      const ctx = wx.createWebViewContext('webview')
      ctx.postMessage(msg)
    } catch (e) {
      console.warn('[MP] sendToWebview failed:', e.message)
    }
  },

  onShareAppMessage() {
    const d = app.globalData.shareData || {}
    return {
      title: d.title || '精选好物，品质生活',
      path: d.path || '/pages/index/index',
      imageUrl: d.imageUrl || ''
    }
  },

  onShareTimeline() {
    const d = app.globalData.shareData || {}
    return {
      title: d.title || '精选好物，品质生活',
      query: ''
    }
  }
})
