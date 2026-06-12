import { Router } from 'express'
import { collection } from '../services/tcb.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const cats = await collection('categories')
    const { data } = await cats.orderBy('sortOrder', 'asc').get()
    res.json({ code: 0, message: 'ok', data })
  } catch (e) {
    res.status(500).json({ code: 500, message: e.message })
  }
})

export default router
