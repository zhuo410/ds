import { Router } from 'express'
import { collection } from '../services/tcb.js'

const router = Router()

// List products
router.get('/', async (req, res) => {
  try {
    const { category, sort, keyword, page, pageSize } = req.query
    const p = parseInt(page) || 1
    const ps = Math.min(parseInt(pageSize) || 20, 50)

    const products = await collection('products')
    let query = products.where({ status: 'active' })

    if (category) {
      query = products.where({ categoryId: category, status: 'active' })
    }

    if (keyword) {
      query = products.where({ name: { $regex: keyword }, status: 'active' })
    }

    // Apply sorting
    const sortMap = {
      sales: ['sales', 'desc'],
      price_asc: ['price', 'asc'],
      price_desc: ['price', 'desc'],
      newest: ['createdAt', 'desc']
    }
    const [sortField, sortDir] = sortMap[sort] || ['createdAt', 'desc']
    query = query.orderBy(sortField, sortDir)

    const { data } = await query
      .skip((p - 1) * ps)
      .limit(ps)
      .get()

    res.json({
      code: 0,
      message: 'ok',
      data: { list: data, page: p, pageSize: ps }
    })
  } catch (e) {
    res.status(500).json({ code: 500, message: e.message })
  }
})

// Product detail
router.get('/:id', async (req, res) => {
  try {
    const products = await collection('products')
    const { data } = await products.doc(req.params.id).get()
    if (!data || data.length === 0) {
      return res.status(404).json({ code: 404, message: '商品不存在' })
    }
    res.json({ code: 0, message: 'ok', data: data[0] })
  } catch (e) {
    res.status(500).json({ code: 500, message: e.message })
  }
})

export default router
