import bcrypt from 'bcryptjs'
import { Router } from 'express'
import { collection } from '../services/tcb.js'
import { generateToken } from '../middleware/auth.js'

const router = Router()

// WeChat login (simulated for development)
router.post('/wechat-login', async (req, res) => {
  try {
    const { code } = req.body
    if (!code) {
      return res.status(400).json({ code: 400, message: '缺少 code' })
    }

    // In production, call jscode2session with the code
    // const wxRes = await fetch(`https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=${SECRET}&js_code=${code}&grant_type=authorization_code`)
    // const { openid, session_key } = await wxRes.json()

    // Simulated: use code as openid for dev
    const openid = code || 'demo_openid_' + Date.now()
    const users = await collection('users')
    const { data: existing } = await users.where({ openid }).get()
    let user = existing[0]

    if (!user) {
      const res2 = await users.add({
        openid,
        nickname: '微信用户',
        avatar: '',
        phone: ''
      })
      const { data: newUsers } = await users.where({ openid }).get()
      user = newUsers[0]
    }

    const token = generateToken({
      userId: user._id,
      openid: user.openid,
      isAdmin: false
    })

    res.json({
      code: 0,
      message: 'ok',
      data: {
        token,
        user: {
          id: user._id,
          nickname: user.nickname,
          avatar: user.avatar,
          phone: user.phone
        }
      }
    })
  } catch (e) {
    res.status(500).json({ code: 500, message: e.message })
  }
})

// Admin login
router.post('/admin-login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ code: 400, message: '请输入账号和密码' })
    }

    const admins = await collection('admins')
    const { data: adminList } = await admins.where({ username }).get()
    const admin = adminList[0]

    if (admin && bcrypt.compareSync(password, admin.password)) {
      const token = generateToken({
        username: admin.username,
        isAdmin: true,
        role: admin.role || 'superadmin'
      })
      return res.json({
        code: 0,
        message: 'ok',
        data: { token }
      })
    }

    res.status(401).json({ code: 401, message: '账号或密码错误' })
  } catch (e) {
    res.status(500).json({ code: 500, message: e.message })
  }
})


export default router
