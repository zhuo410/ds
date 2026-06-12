import { Router } from 'express'
import { collection } from '../services/tcb.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

router.use(authMiddleware)

// Create payment (simulated — returns mock prepay data)
router.post('/create', async (req, res) => {
  try {
    const { orderId } = req.body
    if (!orderId) {
      return res.status(400).json({ code: 400, message: '缺少订单ID' })
    }

    const orders = await collection('orders')
    const { data } = await orders.doc(orderId).get()

    if (!data || data.length === 0) {
      return res.status(404).json({ code: 404, message: '订单不存在' })
    }

    const order = data[0]
    if (order.status !== 'pending_payment') {
      return res.status(400).json({ code: 400, message: '订单状态异常' })
    }

    // Simulate WeChat Pay unified order
    const prepayId = 'wx' + Date.now().toString(36).toUpperCase()

    // Mark order as paid (simulated)
    await orders.doc(orderId).update({
      status: 'pending_shipment',
      payment: { prepayId, paidAt: new Date().toISOString() }
    })

    res.json({
      code: 0,
      message: 'ok',
      data: {
        prepayId,
        // For real WeChat Pay, return: appId, timeStamp, nonceStr, package, signType, paySign
        simulated: true,
        message: '模拟支付成功（开发环境）'
      }
    })
  } catch (e) {
    res.status(500).json({ code: 500, message: e.message })
  }
})

// Payment notify (WeChat Pay callback)
router.post('/notify', async (req, res) => {
  // In production, verify WeChat Pay signature here
  const { outTradeNo, transactionId } = req.body
  if (outTradeNo) {
    const orders = await collection('orders')
    const { data } = await orders.where({ orderNo: outTradeNo }).get()
    if (data.length > 0) {
      await orders.doc(data[0]._id).update({
        status: 'pending_shipment',
        payment: { transactionId, paidAt: new Date().toISOString() }
      })
    }
  }
  // Return success to WeChat
  res.set('Content-Type', 'application/xml')
  res.send('<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>')
})

export default router
