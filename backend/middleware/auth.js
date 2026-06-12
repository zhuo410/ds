import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'retail-platform-secret-key-dev'

export function generateToken(payload, expiresIn = '7d') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn })
}

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ code: 401, message: '未登录' })
  }
  try {
    const token = header.split(' ')[1]
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch (e) {
    return res.status(401).json({ code: 401, message: '登录已过期' })
  }
}

export function adminMiddleware(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ code: 401, message: '未登录' })
  }
  try {
    const token = header.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)
    if (!decoded.isAdmin) {
      return res.status(403).json({ code: 403, message: '无权限' })
    }
    req.admin = decoded
    next()
  } catch (e) {
    return res.status(401).json({ code: 401, message: '登录已过期' })
  }
}
