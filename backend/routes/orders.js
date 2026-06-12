import { Router } from 'express'
import { collection } from '../services/tcb.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

router.use(authMiddleware)

function generateOrderNo() {
  const now = new Date()
  const date = now.toISOString().slice(0, 10).replace(/-/g, '')
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `ORD${date}${rand}`
}

// Create order
router.post('/', async (req, res) => {
  try {
    const { items, addressId, paymentMethod } = req.body
    if (!items || !items.length) {
      return res.status(400).json({ code: 400, message: '订单商品为空' })
    }

    const totalFee = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const orders = await collection('orders')

    const res2 = await orders.add({
      orderNo: generateOrderNo(),
      userId: req.user.userId,
      items,
      totalFee,
      status: 'pending_payment',
      addressId,
      paymentMethod: paymentMethod || 'wechat',
      address: null,
      payment: null,
      createdAt: new Date().toISOString()
    })

    const { data } = await orders.doc(res2.id).get()
    res.json({ code: 0, message: '下单成功', data: data[0] || { _id: res2.id } })
  } catch (e) {
    res.status(500).json({ code: 500, message: e.message })
  }
})

// List user orders
router.get('/', async (req, res) => {
  try {
    const { status, page, pageSize } = req.query
    const p = parseInt(page) || 1
    const ps = Math.min(parseInt(pageSize) || 20, 50)

    const orders = await collection('orders')
    let query = orders.where({ userId: req.user.userId })
    if (status) {
      query = orders.where({ userId: req.user.userId, status })
    }

    const { data } = await query
      .orderBy('createdAt', 'desc')
      .skip((p - 1) * ps)
      .limit(ps)
      .get()

    res.json({ code: 0, message: 'ok', data: { list: data, page: p, pageSize: ps } })
  } catch (e) {
    res.status(500).json({ code: 500, message: e.message })
  }
})

// Order detail
router.get('/:id', async (req, res) => {
  try {
    const orders = await collection('orders')
    const { data } = await orders.doc(req.params.id).get()
    if (!data || data.length === 0) {
      return res.status(404).json({ code: 404, message: '订单不存在' })
    }
    res.json({ code: 0, message: 'ok', data: data[0] })
  } catch (e) {
    res.status(500).json({ code: 500, message: e.message })
  }
})

// Cancel order
router.put('/:id/cancel', async (req, res) => {
  try {
    const orders = await collection('orders')
    const { data } = await orders.doc(req.params.id).get()
    if (!data || data.length === 0) {
      return res.status(404).json({ code: 404, message: '订单不存在' })
    }
    if (data[0].status !== 'pending_payment') {
      return res.status(400).json({ code: 400, message: '当前订单状态不可取消' })
    }
    await orders.doc(req.params.id).update({ status: 'cancelled' })
    res.json({ code: 0, message: '已取消' })
  } catch (e) {
    res.status(500).json({ code: 500, message: e.message })
  }
})

export default router
