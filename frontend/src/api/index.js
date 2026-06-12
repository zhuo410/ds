import http from './http'

export const authAPI = {
  wechatLogin: (code) => http.post('/auth/wechat-login', { code }),
  adminLogin: (username, password) => http.post('/auth/admin-login', { username, password }),
}

export const productAPI = {
  list: (params) => http.get('/products', { params }),
  detail: (id) => http.get(`/products/${id}`),
}

export const categoryAPI = {
  list: () => http.get('/categories'),
}

export const cartAPI = {
  get: () => http.get('/cart'),
  add: (data) => http.post('/cart', data),
  update: (itemId, data) => http.put(`/cart/${itemId}`, data),
  remove: (itemId) => http.delete(`/cart/${itemId}`),
}

export const orderAPI = {
  create: (data) => http.post('/orders', data),
  list: (params) => http.get('/orders', { params }),
  detail: (id) => http.get(`/orders/${id}`),
  cancel: (id) => http.put(`/orders/${id}/cancel`),
}

export const paymentAPI = {
  create: (orderId) => http.post('/payment/create', { orderId }),
}

export const addressAPI = {
  list: () => http.get('/addresses'),
  create: (data) => http.post('/addresses', data),
  update: (id, data) => http.put(`/addresses/${id}`, data),
  delete: (id) => http.delete(`/addresses/${id}`),
}

export const adminAPI = {
  dashboard: () => http.get('/admin/dashboard'),
  products: {
    list: (params) => http.get('/admin/products', { params }),
    create: (data) => http.post('/admin/products', data),
    update: (id, data) => http.put(`/admin/products/${id}`, data),
    delete: (id) => http.delete(`/admin/products/${id}`),
  },
  categories: {
    list: () => http.get('/admin/categories'),
    create: (data) => http.post('/admin/categories', data),
    update: (id, data) => http.put(`/admin/categories/${id}`, data),
    delete: (id) => http.delete(`/admin/categories/${id}`),
  },
  orders: {
    list: (params) => http.get('/admin/orders', { params }),
    updateStatus: (id, status, trackingNo) => http.put(`/admin/orders/${id}/status`, { status, trackingNo }),
  },
}
