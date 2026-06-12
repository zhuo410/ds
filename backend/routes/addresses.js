import { Router } from 'express'
import { collection } from '../services/tcb.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()
router.use(authMiddleware)

// List addresses
router.get('/', async (req, res) => {
  try {
    const addrs = await collection('addresses')
    const { data } = await addrs.where({ userId: req.user.userId }).get()
    res.json({ code: 0, message: 'ok', data })
  } catch (e) {
    res.status(500).json({ code: 500, message: e.message })
  }
})

// Create address
router.post('/', async (req, res) => {
  try {
    const addrs = await collection('addresses')
    const { name, phone, province, city, district, detail, isDefault } = req.body

    // If setting as default, unset others
    if (isDefault) {
      const { data: existing } = await addrs.where({ userId: req.user.userId }).get()
      for (const addr of existing) {
        await addrs.doc(addr._id).update({ isDefault: false })
      }
    }

    await addrs.add({
      userId: req.user.userId,
      name, phone, province, city, district, detail,
      isDefault: !!isDefault
    })

    res.json({ code: 0, message: '添加成功' })
  } catch (e) {
    res.status(500).json({ code: 500, message: e.message })
  }
})

// Update address
router.put('/:id', async (req, res) => {
  try {
    const addrs = await collection('addresses')
    const { data } = await addrs.doc(req.params.id).get()
    if (!data || data.length === 0) {
      return res.status(404).json({ code: 404, message: '地址不存在' })
    }

    const { isDefault } = req.body
    if (isDefault) {
      const { data: all } = await addrs.where({ userId: req.user.userId }).get()
      for (const addr of all) {
        if (addr._id !== req.params.id) {
          await addrs.doc(addr._id).update({ isDefault: false })
        }
      }
    }

    await addrs.doc(req.params.id).update(req.body)
    res.json({ code: 0, message: '更新成功' })
  } catch (e) {
    res.status(500).json({ code: 500, message: e.message })
  }
})

// Delete address
router.delete('/:id', async (req, res) => {
  try {
    const addrs = await collection('addresses')
    await addrs.doc(req.params.id).remove()
    res.json({ code: 0, message: '已删除' })
  } catch (e) {
    res.status(500).json({ code: 500, message: e.message })
  }
})

export default router
