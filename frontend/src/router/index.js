import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/customer/Home.vue'),
    meta: { title: '精选商城', showTabBar: true, largeTitle: true }
  },
  {
    path: '/category',
    name: 'category',
    component: () => import('@/views/customer/ProductList.vue'),
    meta: { title: '分类', showTabBar: true }
  },
  {
    path: '/product/:id',
    name: 'product-detail',
    component: () => import('@/views/customer/ProductDetail.vue'),
    meta: { title: '商品详情', showTabBar: false, transparentNav: true }
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('@/views/customer/Cart.vue'),
    meta: { title: '购物车', showTabBar: true }
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('@/views/customer/Checkout.vue'),
    meta: { title: '确认订单', showTabBar: false }
  },
  {
    path: '/orders',
    name: 'orders',
    component: () => import('@/views/customer/OrderList.vue'),
    meta: { title: '我的订单', showTabBar: true, tabBarTab: 'profile', largeTitle: true }
  },
  {
    path: '/order/:id',
    name: 'order-detail',
    component: () => import('@/views/customer/OrderDetail.vue'),
    meta: { title: '订单详情', showTabBar: false }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/customer/Profile.vue'),
    meta: { title: '我的', showTabBar: true, tabBarTab: 'profile', largeTitle: true }
  },
  {
    path: '/addresses',
    name: 'addresses',
    component: () => import('@/views/customer/AddressList.vue'),
    meta: { title: '收货地址', showTabBar: false }
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/customer/Search.vue'),
    meta: { title: '搜索', showTabBar: false }
  },
  {
    path: '/admin/login',
    name: 'admin-login',
    component: () => import('@/views/admin/Login.vue'),
    meta: { title: '管理登录', showTabBar: false }
  },
  {
    path: '/admin',
    name: 'admin-dashboard',
    component: () => import('@/views/admin/Dashboard.vue'),
    meta: { title: '管理后台', showTabBar: false, requiresAdmin: true }
  },
  {
    path: '/admin/products',
    name: 'admin-products',
    component: () => import('@/views/admin/Products.vue'),
    meta: { title: '商品管理', showTabBar: false, requiresAdmin: true }
  },
  {
    path: '/admin/orders',
    name: 'admin-orders',
    component: () => import('@/views/admin/Orders.vue'),
    meta: { title: '订单管理', showTabBar: false, requiresAdmin: true }
  },
  {
    path: '/admin/categories',
    name: 'admin-categories',
    component: () => import('@/views/admin/Categories.vue'),
    meta: { title: '分类管理', showTabBar: false, requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
