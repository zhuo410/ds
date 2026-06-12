<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const router = useRouter()
const cart = useCartStore()

const tabs = [
  { key: 'home', label: '首页', icon: 'house', path: '/' },
  { key: 'category', label: '分类', icon: 'square.grid.2x2', path: '/category' },
  { key: 'cart', label: '购物车', icon: 'cart', path: '/cart', badge: () => cart.count },
  { key: 'profile', label: '我的', icon: 'person', path: '/profile' },
]

const activeTab = computed(() => {
  const tab = tabs.find(t => route.path === t.path || route.meta.tabBarTab === t.key)
  return tab?.key || 'home'
})

function switchTab(tab) {
  router.push(tab.path)
}
</script>

<template>
  <!-- iOS-style floating tab bar with frosted glass -->
  <nav class="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-safe-bottom pointer-events-none">
    <div class="ios-blur ios-card pointer-events-auto mx-4 mb-3 px-2 py-1 flex items-center justify-around"
         style="max-width: 400px; width: calc(100% - 32px); border-radius: 22px;">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="switchTab(tab)"
        class="flex flex-col items-center justify-center py-1.5 px-3 ios-touch transition-all duration-200 relative"
        style="min-width: 60px;"
      >
        <!-- SVG icon -->
        <svg v-if="tab.icon === 'house'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
             :class="activeTab === tab.key ? 'text-ios-accent' : 'text-ios-text-secondary'">
          <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
        <svg v-else-if="tab.icon === 'square.grid.2x2'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
             :class="activeTab === tab.key ? 'text-ios-accent' : 'text-ios-text-secondary'">
          <rect x="3" y="3" width="7" height="7" rx="1.5"/>
          <rect x="14" y="3" width="7" height="7" rx="1.5"/>
          <rect x="3" y="14" width="7" height="7" rx="1.5"/>
          <rect x="14" y="14" width="7" height="7" rx="1.5"/>
        </svg>
        <svg v-else-if="tab.icon === 'cart'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
             :class="activeTab === tab.key ? 'text-ios-accent' : 'text-ios-text-secondary'">
          <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/>
        </svg>
        <svg v-else-if="tab.icon === 'person'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
             :class="activeTab === tab.key ? 'text-ios-accent' : 'text-ios-text-secondary'">
          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>

        <!-- Label -->
        <span class="text-[10px] font-medium mt-0.5 transition-colors duration-200"
              :class="activeTab === tab.key ? 'text-ios-accent' : 'text-ios-text-secondary'">
          {{ tab.label }}
        </span>

        <!-- Badge dot (for cart) -->
        <span v-if="tab.badge && tab.badge() > 0"
              class="absolute -top-0.5 right-1 bg-ios-destructive text-white text-[10px] font-semibold
                     min-w-[16px] h-4 flex items-center justify-center rounded-full px-1">
          {{ tab.badge() > 99 ? '99+' : tab.badge() }}
        </span>
      </button>
    </div>
  </nav>
</template>
