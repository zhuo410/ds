import express from 'express'
import fs from 'fs'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'
import categoryRoutes from './routes/categories.js'
import cartRoutes from './routes/cart.js'
import orderRoutes from './routes/orders.js'
import paymentRoutes from './routes/payment.js'
import addressRoutes from './routes/addresses.js'
import adminRoutes from './routes/admin.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`)
  next()
})

// Health check endpoint (required by WeChat Cloud Hosting)
app.get("/api/health", (req, res) => {
  res.json({
    code: 0,
    message: "ok",
    data: {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }
  })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/addresses', addressRoutes)
app.use('/api/admin', adminRoutes)

// Serve static frontend in production
const staticDir = path.join(__dirname, 'frontend', 'dist')
if (fs.existsSync(staticDir)) {
  console.log(`[Server] Serving static frontend from: ${staticDir}`)
  app.use(express.static(staticDir))

  // SPA fallback — serve index.html for any non-API route
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(staticDir, 'index.html'))
    }
  })
} else {
  console.log(`[Server] Static frontend not found at ${staticDir}, API only mode`)
}

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ code: 500, message: '服务器内部错误' })
})

app.listen(PORT, () => {
  console.log(`[Server] Running on http://localhost:${PORT}`)
  console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`[Server] TCB_ENV_ID: ${process.env.TCB_ENV_ID || 'not set (using in-memory)'}`)
})

export default app
