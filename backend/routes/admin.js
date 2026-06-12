import { Router } from 'express'
import { collection } from '../services/tcb.js'
import { adminMiddleware } from '../middleware/auth.js'

const router = Router()
router.use(adminMiddleware)

// Dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const prods = await collection('products')
    const ords = await collection('orders')
    const { data: products } = await prods.get()
    const { data: orders } = await ords.get()

    const orderCount = orders.length
    const productCount = products.length
    const revenue = orders
      .filter(o => o.status === 'completed' || o.status === 'shipped')
      .reduce((sum, o) => sum + (o.totalFee || 0), 0)
    const pendingOrders = orders.filter(o => o.status === 'pending_shipment').length

    res.json({
      code: 0,
      message: 'ok',
      data: { orderCount, productCount, revenue, pendingOrders }
    })
  } catch (e) {
    res.status(500).json({ code: 500, message: e.message })
  }
})

// --- Products CRUD ---
router.get('/products', async (req, res) => {
  try {
    const prods = await collection('products')
    const { data } = await prods.orderBy('createdAt', 'desc').get()
    res.json({ code: 0, message: 'ok', data: { list: data } })
  } catch (e) {
    res.status(500).json({ code: 500, message: e.message })
  }
})

router.post('/products', async (req, res) => {
  try {
    const prods = await collection('products')
    const data = {
      ...req.body,
      price: parseFloat(req.body.price),
      comparePrice: req.body.comparePrice ? parseFloat(req.body.comparePrice) : null,
      stock: parseInt(req.body.stock) || 0,
      sales: 0,
      status: 'active',
      specs: req.body.specs || []
    }
    const result = await prods.add(data)
    res.json({ code: 0, message: '添加成功', data: { id: result.id } })
  } catch (e) {
    res.status(500).json({ code: 500, message: e.message })
  }
})

router.put('/products/:id', async (req, res) => {
  try {
    const prods = await collection('products')
    await prods.doc(req.params.id).update(req.body)
    res.json({ code: 0, message: '更新成功' })
  } catch (e) {
    res.status(500).json({ code: 500, message: e.message })
  }
})

router.delete('/products/:id', async (req, res) => {
  try {
    const prods = await collection('products')
    await prods.doc(req.params.id).remove()
    res.json({ code: 0, message: '已删除' })
  } catch (e) {
    res.status(500).json({ code: 500, message: e.message })
  }
})

// --- Categories CRUD ---
router.get('/categories', async (req, res) => {
  try {
    const cats = await collection('categories')
    const { data } = await cats.orderBy('sortOrder', 'asc').get()
    res.json({ code: 0, message: 'ok', data })
  } catch (e) {
    res.status(500).json({ code: 500, message: e.message })
  }
})

router.post('/categories', async (req, res) => {
  try {
    const cats = await collection('categories')
    await cats.add(req.body)
    res.json({ code: 0, message: '添加成功' })
  } catch (e) {
    res.status(500).json({ code: 500, message: e.message })
  }
})

router.put('/categories/:id', async (req, res) => {
  try {
    const cats = await collection('categories')
    await cats.doc(req.params.id).update(req.body)
    res.json({ code: 0, message: '更新成功' })
  } catch (e) {
    res.status(500).json({ code: 500, message: e.message })
  }
})

router.delete('/categories/:id', async (req, res) => {
  try {
    const cats = await collection('categories')
    await cats.doc(req.params.id).remove()
    res.json({ code: 0, message: '已删除' })
  } catch (e) {
    res.status(500).json({ code: 500, message: e.message })
  }
})

// --- Orders ---
router.get('/orders', async (req, res) => {
  try {
    const { status, page, pageSize } = req.query
    const p = parseInt(page) || 1
    const ps = Math.min(parseInt(pageSize) || 50, 100)
    const orders = await collection('orders')

    let query
    if (status) {
      query = orders.where({ status })
    } else {
      query = orders.where({})
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

router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status, trackingNo } = req.body
    const orders = await collection('orders')
    await orders.doc(req.params.id).update({
      status,
      ...(trackingNo ? { trackingNo } : {}),
      ...(status === 'shipped' ? { shippedAt: new Date().toISOString() } : {}),
      ...(status === 'completed' ? { completedAt: new Date().toISOString() } : {})
    })
    res.json({ code: 0, message: '状态已更新' })
  } catch (e) {
    res.status(500).json({ code: 500, message: e.message })
  }
})

export default router
