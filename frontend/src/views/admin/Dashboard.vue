<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { adminAPI } from '@/api'

const router = useRouter()
const user = useUserStore()
const stats = ref({ orderCount: 0, productCount: 0, revenue: 0, pendingOrders: 0 })
const loading = ref(true)

onMounted(async () => {
  if (!user.isAdmin) {
    router.push('/admin/login')
    return
  }
  try {
    const res = await adminAPI.dashboard()
    stats.value = res.data || stats.value
  } catch (e) { /* use defaults */ }
  finally { loading.value = false }
})

function logout() {
  user.logout()
  router.push('/')
}

const navItems = [
  { label: '商品管理', path: '/admin/products', icon: 'box', color: '#007AFF' },
  { label: '订单管理', path: '/admin/orders', icon: 'list', color: '#34C759' },
  { label: '分类管理', path: '/admin/categories', icon: 'grid', color: '#FF9500' },
]
</script>

<template>
  <div class="p-4 bg-ios-bg min-h-screen">
    <!-- Admin header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-[28px] font-bold">管理后台</h1>
        <p class="text-[14px] text-ios-text-secondary">欢迎回来，管理员</p>
      </div>
      <button @click="logout"
              class="px-4 py-2 bg-gray-100 rounded-[10px] text-[14px] font-medium text-ios-text-secondary ios-touch">
        退出
      </button>
    </div>

    <!-- Stats cards -->
    <div v-if="loading" class="grid grid-cols-2 gap-3 mb-6">
      <div v-for="i in 4" :key="i" class="ios-card p-4 animate-pulse">
        <div class="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div class="h-6 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
    <div v-else class="grid grid-cols-2 gap-3 mb-6">
      <div class="ios-card p-4">
        <p class="text-[13px] text-ios-text-secondary">订单总数</p>
        <p class="text-[24px] font-bold mt-1">{{ stats.orderCount }}</p>
      </div>
      <div class="ios-card p-4">
        <p class="text-[13px] text-ios-text-secondary">商品总数</p>
        <p class="text-[24px] font-bold mt-1">{{ stats.productCount }}</p>
      </div>
      <div class="ios-card p-4">
        <p class="text-[13px] text-ios-text-secondary">总收入</p>
        <p class="text-[24px] font-bold mt-1 text-ios-destructive">¥{{ stats.revenue }}</p>
      </div>
      <div class="ios-card p-4">
        <p class="text-[13px] text-ios-text-secondary">待处理订单</p>
        <p class="text-[24px] font-bold mt-1 text-ios-accent">{{ stats.pendingOrders }}</p>
      </div>
    </div>

    <!-- Quick nav -->
    <p class="text-[15px] font-semibold mb-3">快捷操作</p>
    <div class="space-y-3">
      <div v-for="item in navItems" :key="item.path"
           @click="router.push(item.path)"
           class="ios-card p-4 flex items-center gap-4 ios-touch cursor-pointer">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center"
             :style="{ backgroundColor: item.color + '15' }">
          <svg v-if="item.icon === 'box'" width="20" height="20" viewBox="0 0 24 24" fill="none" :stroke="item.color" stroke-width="1.5">
            <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
          </svg>
          <svg v-else-if="item.icon === 'list'" width="20" height="20" viewBox="0 0 24 24" fill="none" :stroke="item.color" stroke-width="1.5">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          <svg v-else-if="item.icon === 'grid'" width="20" height="20" viewBox="0 0 24 24" fill="none" :stroke="item.color" stroke-width="1.5">
            <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
        </div>
        <span class="text-[15px] font-medium flex-1">{{ item.label }}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C7C7CC" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
      </div>
    </div>

    <button @click="router.push('/')" class="mt-6 text-[14px] text-ios-accent font-medium">
      ← 返回前台
    </button>
  </div>
</template>
