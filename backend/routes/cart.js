import { Router } from 'express'
import { collection } from '../services/tcb.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

router.use(authMiddleware)

// Get user's cart
router.get('/', async (req, res) => {
  try {
    const cart = await collection('cart')
    const { data } = await cart.where({ userId: req.user.userId }).get()
    res.json({ code: 0, message: 'ok', data })
  } catch (e) {
    res.status(500).json({ code: 500, message: e.message })
  }
})

// Add to cart
router.post('/', async (req, res) => {
  try {
    const { productId, name, image, price, spec, quantity } = req.body
    const cart = await collection('cart')

    // Check if item already exists
    const { data: existing } = await cart.where({ userId: req.user.userId, productId }).get()
    if (existing.length > 0) {
      const item = existing[0]
      await cart.doc(item._id).update({ quantity: item.quantity + (quantity || 1) })
      return res.json({ code: 0, message: '已更新数量', data: item })
    }

    await cart.add({
      userId: req.user.userId,
      productId,
      name,
      image,
      price: parseFloat(price),
      spec: spec || '',
      quantity: quantity || 1,
      selected: true
    })

    res.json({ code: 0, message: '已加入购物车' })
  } catch (e) {
    res.status(500).json({ code: 500, message: e.message })
  }
})

// Update cart item
router.put('/:id', async (req, res) => {
  try {
    const cart = await collection('cart')
    await cart.doc(req.params.id).update(req.body)
    res.json({ code: 0, message: '已更新' })
  } catch (e) {
    res.status(500).json({ code: 500, message: e.message })
  }
})

// Remove from cart
router.delete('/:id', async (req, res) => {
  try {
    const cart = await collection('cart')
    await cart.doc(req.params.id).remove()
    res.json({ code: 0, message: '已删除' })
  } catch (e) {
    res.status(500).json({ code: 500, message: e.message })
  }
})

export default router
