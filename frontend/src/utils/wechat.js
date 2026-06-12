/**
 * WeChat Mini-Program Integration Utilities
 *
 * This file provides helpers for WeChat JS-SDK integration.
 * These functions are called from within the mini-program web-view context
 * (i.e., when wx.miniProgram is available).
 */

// Check if running inside WeChat mini-program
export function isInMiniProgram() {
  return typeof window !== 'undefined' &&
    (window.__wxjs_environment === 'miniprogram' ||
     /miniProgram/i.test(navigator.userAgent))
}

// Navigate to mini-program page
export function navigateToMiniProgram(path) {
  if (window.wx?.miniProgram) {
    window.wx.miniProgram.navigateTo({ url: path })
  }
}

// Get WeChat login code
export function getWechatCode() {
  return new Promise((resolve, reject) => {
    if (!isInMiniProgram()) {
      // Dev fallback: return a mock code
      resolve('dev_code_' + Date.now())
      return
    }
    window.wx?.miniProgram?.navigateTo({
      url: '/pages/login/login',
      success: () => {
        // Listen for code from mini-program
        window.addEventListener('message', (event) => {
          if (event.data?.type === 'wechat_code') {
            resolve(event.data.code)
          }
        })
      },
      fail: reject
    })
  })
}

// Request WeChat payment
export function requestWechatPayment(paymentParams) {
  return new Promise((resolve, reject) => {
    if (!window.wx) {
      // Dev fallback: simulate payment
      setTimeout(resolve, 1000)
      return
    }
    window.wx.requestPayment({
      timeStamp: paymentParams.timeStamp,
      nonceStr: paymentParams.nonceStr,
      package: paymentParams.package,
      signType: 'MD5',
      paySign: paymentParams.paySign,
      success: resolve,
      fail: reject
    })
  })
}

// Setup WeChat share
export function setupShare(title, path, imageUrl) {
  if (!window.wx) return

  // Mini-program web-view share
  window.wx.miniProgram?.postMessage({
    data: {
      type: 'share',
      title,
      path: path || window.location.hash,
      imageUrl
    }
  })

  // H5 share via JS-SDK
  window.wx.updateTimelineShareData?.({
    title,
    link: window.location.href,
    imgUrl: imageUrl
  })
  window.wx.updateAppMessageShareData?.({
    title,
    desc: '精选好物，品质生活',
    link: window.location.href,
    imgUrl: imageUrl
  })
}

// Subscribe message
export function requestSubscribeMessage(templateIds) {
  return new Promise((resolve, reject) => {
    if (!window.wx) {
      resolve()
      return
    }
    window.wx.requestSubscribeMessage?.({
      tmplIds: templateIds,
      success: resolve,
      fail: reject
    })
  })
}

// Open customer service chat
export function openCustomerService() {
  if (window.wx?.openCustomerServiceChat) {
    window.wx.openCustomerServiceChat({
      extInfo: { url: '' },
      success: () => {}
    })
  } else {
    // Fallback: open a contact page or phone
    window.location.href = 'tel:400-000-0000'
  }
}
