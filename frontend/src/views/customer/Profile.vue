<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const user = useUserStore()
const cart = useCartStore()

const menuItems = [
  { label: '我的订单', icon: 'list', path: '/orders', badge: '' },
  { label: '收货地址', icon: 'location', path: '/addresses', badge: '' },
  { label: '购物车', icon: 'cart-alt', path: '/cart', badge: () => cart.count },
  { label: '客服中心', icon: 'chat', path: '', badge: '' },
]

function goTo(item) {
  if (item.path) router.push(item.path)
}

function handleLogin() {
  // Simulate WeChat login in mini-program
  user.setUser({
    token: 'demo-token-' + Date.now(),
    user: { nickname: '微信用户', avatar: '', phone: '' }
  })
}
</script>

<template>
  <div>
    <!-- User profile card -->
    <div class="mx-4 mt-3">
      <div class="bg-gradient-to-br from-ios-accent to-blue-600 rounded-[16px] p-5 text-white">
        <div v-if="user.isLoggedIn" class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-[28px] font-semibold">
            {{ (user.userInfo?.nickname || 'U')[0] }}
          </div>
          <div>
            <p class="text-[20px] font-bold">{{ user.userInfo?.nickname || '用户' }}</p>
            <p class="text-[14px] opacity-80 mt-1">{{ user.userInfo?.phone || '未绑定手机号' }}</p>
          </div>
        </div>
        <div v-else class="flex items-center gap-4" @click="handleLogin">
          <div class="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5">
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
          <div>
            <p class="text-[18px] font-semibold">点击登录</p>
            <p class="text-[13px] opacity-80 mt-0.5">登录后享受完整体验</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Order stats -->
    <div class="mx-4 mt-3">
      <div class="ios-card p-3">
        <div class="flex justify-around">
          <div class="flex flex-col items-center ios-touch cursor-pointer" @click="router.push('/orders')">
            <span class="text-[16px] font-bold">0</span>
            <span class="text-[11px] text-ios-text-secondary mt-0.5">待付款</span>
          </div>
          <div class="flex flex-col items-center ios-touch cursor-pointer" @click="router.push('/orders')">
            <span class="text-[16px] font-bold">0</span>
            <span class="text-[11px] text-ios-text-secondary mt-0.5">待发货</span>
          </div>
          <div class="flex flex-col items-center ios-touch cursor-pointer" @click="router.push('/orders')">
            <span class="text-[16px] font-bold">0</span>
            <span class="text-[11px] text-ios-text-secondary mt-0.5">待收货</span>
          </div>
          <div class="flex flex-col items-center ios-touch cursor-pointer" @click="router.push('/orders')">
            <span class="text-[16px] font-bold">0</span>
            <span class="text-[11px] text-ios-text-secondary mt-0.5">已完成</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Menu list (iOS settings style) -->
    <div class="mx-4 mt-3 mb-24">
      <div class="ios-card overflow-hidden divide-y divide-ios-separator">
        <div v-for="item in menuItems" :key="item.label"
             @click="goTo(item)"
             class="flex items-center justify-between px-4 py-3.5 ios-list-item cursor-pointer">
          <div class="flex items-center gap-3">
            <svg v-if="item.icon === 'list'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#007AFF" stroke-width="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            <svg v-else-if="item.icon === 'location'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34C759" stroke-width="1.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
            <svg v-else-if="item.icon === 'cart-alt'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF9500" stroke-width="1.5"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/></svg>
            <svg v-else-if="item.icon === 'chat'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5856D6" stroke-width="1.5"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
            <span class="text-[15px]">{{ item.label }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span v-if="typeof item.badge === 'function' && item.badge() > 0"
                  class="bg-ios-destructive text-white text-[11px] font-semibold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
              {{ item.badge() > 99 ? '99+' : item.badge() }}
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C7C7CC" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
          </div>
        </div>
      </div>

      <!-- Admin entry -->
      <div class="mt-6 text-center">
        <button @click="router.push('/admin/login')"
                class="text-[13px] text-ios-text-secondary/50 ios-touch">
          管理员入口
        </button>
      </div>
    </div>
  </div>
</template>
