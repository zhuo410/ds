/**
 * TCB Database Service
 * Wraps CloudBase (TCB) database operations.
 * Falls back to in-memory storage for local development.
 */
import cloudbase from '@cloudbase/node-sdk'

const TCB_ENV_ID = process.env.TCB_ENV_ID
let db = null
let isTCB = false

// In-memory fallback store for local development
const store = {
  products: [
    { _id: 'p1', name: '无线降噪耳机 Pro', description: '高品质主动降噪，30小时续航，舒适佩戴体验。支持蓝牙5.3，低延迟游戏模式。', price: 599, comparePrice: 899, images: [], categoryId: 'cat1', stock: 200, sales: 1523, specs: [{name:'白色'},{name:'黑色'}], status: 'active', createdAt: new Date().toISOString() },
    { _id: 'p2', name: '有机面膜礼盒', description: '天然植物萃取，温和不刺激。含5片补水精华面膜，适合所有肤质。', price: 129, comparePrice: 199, images: [], categoryId: 'cat3', stock: 500, sales: 3210, specs: [{name:'5片装'},{name:'10片装'}], status: 'active', createdAt: new Date().toISOString() },
    { _id: 'p3', name: '极简商务双肩包', description: '防泼水面料，大容量设计。独立电脑仓，USB充电口，出行必备。', price: 299, comparePrice: 499, images: [], categoryId: 'cat2', stock: 150, sales: 876, specs: [{name:'灰色'},{name:'黑色'}], status: 'active', createdAt: new Date().toISOString() },
    { _id: 'p4', name: '智能手表 S3', description: '全天候心率监测，血氧检测，100+运动模式。14天超长续航。', price: 899, comparePrice: 1299, images: [], categoryId: 'cat1', stock: 80, sales: 2341, specs: [{name:'午夜黑'},{name:'星光银'}], status: 'active', createdAt: new Date().toISOString() },
    { _id: 'p5', name: '日式陶瓷餐具套装', description: '16件套，含碗碟杯勺。北欧简约风格，微波炉洗碗机可用。', price: 199, comparePrice: 359, images: [], categoryId: 'cat5', stock: 300, sales: 654, specs: [{name:'16件套'}], status: 'active', createdAt: new Date().toISOString() },
    { _id: 'p6', name: '有机即食燕麦片', description: '澳洲进口燕麦，高膳食纤维，非转基因。即冲即食，健康早餐首选。', price: 49.9, comparePrice: 69.9, images: [], categoryId: 'cat4', stock: 1000, sales: 5432, specs: [{name:'原味1kg'},{name:'水果味1kg'}], status: 'active', createdAt: new Date().toISOString() },
    { _id: 'p7', name: '运动速干T恤', description: '专业运动面料，四向弹力，速干透气。无缝编织工艺，零摩擦体感。', price: 159, comparePrice: 259, images: [], categoryId: 'cat6', stock: 400, sales: 1876, specs: [{name:'S'},{name:'M'},{name:'L'},{name:'XL'}], status: 'active', createdAt: new Date().toISOString() },
    { _id: 'p8', name: '智能台灯 Pro', description: '国AA级护眼，无频闪。支持色温亮度无级调节，智能感应自动调光。', price: 399, comparePrice: 599, images: [], categoryId: 'cat5', stock: 120, sales: 987, specs: [{name:'白色'},{name:'灰色'}], status: 'active', createdAt: new Date().toISOString() },
  ],
  categories: [
    { _id: 'cat1', name: '数码', icon: '📱', sortOrder: 1 },
    { _id: 'cat2', name: '服饰', icon: '👔', sortOrder: 2 },
    { _id: 'cat3', name: '美妆', icon: '💄', sortOrder: 3 },
    { _id: 'cat4', name: '食品', icon: '🍜', sortOrder: 4 },
    { _id: 'cat5', name: '家居', icon: '🏠', sortOrder: 5 },
    { _id: 'cat6', name: '运动', icon: '⚽', sortOrder: 6 },
  ],
  users: [],
  admins: [
    { _id: 'admin1', username: 'admin', password: '$2a$10$vfgiCZitxUtigFghBbviduwMVmLE6bxOzyca4jQLFls9wsjm0Q30q', role: 'superadmin' }
  ],
  orders: [],
  cart: [],
  addresses: []
}

// Initialize TCB if env is set
try {
  if (TCB_ENV_ID) {
    const app = cloudbase.init({
      env: TCB_ENV_ID,
      secretId: process.env.TCB_SECRET_ID,
      secretKey: process.env.TCB_SECRET_KEY
    })
    db = app.database()
    isTCB = true
    console.log(`[TCB] Connected to env: ${TCB_ENV_ID}`)
  } else {
    console.log('[TCB] No TCB_ENV_ID set, using in-memory store for development')
  }
} catch (e) {
  console.warn('[TCB] Failed to initialize TCB, using in-memory fallback:', e.message)
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function makeQueryMethods(items, store, name) {
  return {
    orderBy(field, dir) {
      const sorted = [...items].sort((a, b) => {
        const va = a[field] ?? 0, vb = b[field] ?? 0
        return dir === 'desc' ? vb - va : va - vb
      })
      return makeQueryMethods(sorted, store, name)
    },
    skip(n) {
      return makeQueryMethods(items.slice(n), store, name)
    },
    limit(n) {
      return makeQueryMethods(items.slice(0, n), store, name)
    },
    async get() {
      return { data: items }
    },
    async update(data) {
      items.forEach(item => Object.assign(item, data))
      return { updated: items.length }
    },
    async remove() {
      const ids = new Set(items.map(i => i._id))
      store[name] = (store[name] || []).filter(i => !ids.has(i._id))
      return { deleted: items.length }
    },
    doc(id) {
      const doc = items.find(i => i._id === id)
      return {
        async get() { return { data: doc ? [doc] : [] } },
        async update(data) {
          if (doc) Object.assign(doc, data)
          return { updated: doc ? 1 : 0 }
        },
        async remove() {
          if (doc) store[name] = (store[name] || []).filter(i => i._id !== id)
          return { deleted: doc ? 1 : 0 }
        }
      }
    },
    where(query) {
      let filtered = [...items]
      if (query) {
        Object.entries(query).forEach(([key, value]) => {
          if (typeof value === 'object' && value.$regex) {
            filtered = filtered.filter(i => new RegExp(value.$regex, 'i').test(i[key]))
          } else {
            filtered = filtered.filter(i => i[key] === value)
          }
        })
      }
      return makeQueryMethods(filtered, store, name)
    }
  }
}

function collection(name) {
  if (isTCB) {
    return db.collection(name)
  }
  const items = store[name] || []
  const q = makeQueryMethods(items, store, name)
  // Add `add` at collection level
  return {
    ...q,
    async add(data) {
      const doc = { _id: genId(), ...data, createdAt: new Date().toISOString() }
      store[name] = store[name] || []
      store[name].push(doc)
      return { id: doc._id }
    }
  }
}

export async function getCollection(name) {
  return collection(name)
}

export { isTCB, collection }
