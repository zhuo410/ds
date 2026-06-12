/**
 * WeChat Mini-Program Integration Utilities
 *
 * H5 页面在小程序 web-view 中运行时，通过 postMessage 与小程序通信。
 * 小程序将登录 code 通过 URL 参数传递进来（/#/?code=xxx）。
 */

// 从 URL 中获取小程序传递的参数（兼容 hash 路由）
function getParamFromUrl(key) {
  // hash 路由下，?code=xxx 跟在 #/ 后面
  // window.location.href = https://domain/#/?code=xxx
  const hash = window.location.hash  // "#/?code=xxx"
  const searchIndex = hash.indexOf('?')
  if (searchIndex !== -1) {
    const search = hash.substring(searchIndex)
    const params = new URLSearchParams(search)
    if (params.has(key)) return params.get(key)
  }
  // 兜底：从完整 URL 中匹配
  const match = window.location.href.match(new RegExp('[?&]' + key + '=([^&]+)'))
  return match ? decodeURIComponent(match[1]) : ''
}

// 检查是否运行在小程序 web-view 中
export function isInMiniProgram() {
  return (
    typeof window !== 'undefined' &&
    (window.__wxjs_environment === 'miniprogram' ||
     navigator.userAgent.includes('miniProgram') ||
     navigator.userAgent.includes('MicroMessenger'))
  )
}

// 向小程序发送消息
function postMessage(data) {
  try {
    if (window.wx?.miniProgram) {
      window.wx.miniProgram.postMessage({ data })
    }
  } catch (e) {
    console.warn('[WeChat] postMessage failed:', e)
  }
}

// 获取登录 code
export function getWechatCode() {
  return new Promise((resolve) => {
    if (!isInMiniProgram()) {
      resolve('dev_code_' + Date.now())
      return
    }

    // 优先从 URL 参数获取
    const code = getParamFromUrl('code')
    if (code) {
      resolve(code)
      return
    }

    // 降级：请求小程序提供 code
    postMessage({ type: 'wechat_code' })

    const handler = (event) => {
      const msg = event.data
      if (msg?.type === 'wechat_code' && msg?.data?.code) {
        window.removeEventListener('message', handler)
        resolve(msg.data.code)
      }
    }
    window.addEventListener('message', handler)

    setTimeout(() => {
      window.removeEventListener('message', handler)
      resolve('timeout_code_' + Date.now())
    }, 10000)
  })
}

// 请求微信支付
export function requestWechatPayment(paymentParams) {
  return new Promise((resolve, reject) => {
    if (!isInMiniProgram()) {
      console.log('[WeChat] Dev mode: simulating payment')
      setTimeout(() => resolve({ success: true }), 1000)
      return
    }

    postMessage({ type: 'payment', data: paymentParams })

    const handler = (event) => {
      const msg = event.data
      if (msg?.type === 'payment_result') {
        window.removeEventListener('message', handler)
        if (msg.data?.success) {
          resolve(msg.data)
        } else {
          reject(new Error(msg.data?.error || '支付失败'))
        }
      }
    }
    window.addEventListener('message', handler)

    setTimeout(() => {
      window.removeEventListener('message', handler)
      reject(new Error('支付超时'))
    }, 30000)
  })
}

// 设置分享
export function setupShare(title, path, imageUrl) {
  if (!isInMiniProgram()) return

  postMessage({
    type: 'share',
    data: {
      title: title || '精选好物，品质生活',
      path: path || window.location.hash,
      imageUrl: imageUrl || ''
    }
  })
}

// 订阅消息
export function requestSubscribeMessage(templateIds) {
  return new Promise((resolve) => {
    if (!isInMiniProgram()) {
      resolve({})
      return
    }

    postMessage({ type: 'subscribe', data: { templateIds } })

    const handler = (event) => {
      const msg = event.data
      if (msg?.type === 'subscribe_result') {
        window.removeEventListener('message', handler)
        resolve(msg.data)
      }
    }
    window.addEventListener('message', handler)
  })
}

// 打开客服
export function openCustomerService() {
  if (isInMiniProgram()) {
    postMessage({ type: 'customer_service' })
  }
}
