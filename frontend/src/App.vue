<script setup>
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { isInMiniProgram, setupShare } from '@/utils/wechat'
import AppTabBar from '@/components/ui/AppTabBar.vue'
import AppNavbar from '@/components/ui/AppNavbar.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// Set document title from route meta
watch(() => route.meta.title, (title) => {
  if (title) document.title = title
}, { immediate: true })

// App initialization
onMounted(async () => {
  // 1. 小程序的 web-view 环境：自动从 URL 读取 code 做微信登录
  if (isInMiniProgram()) {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')

    if (code && !userStore.isLoggedIn) {
      try {
        await userStore.loginWithWechat(code)
        console.log('[App] WeChat login success')
      } catch (e) {
        console.warn('[App] WeChat login failed:', e)
      }
    }

    // 2. 设置页面分享（小程序分享）
    setupShare(
      route.meta.title || '精选好物，品质生活',
      window.location.hash,
      ''
    )
  }
})
</script>

<template>
  <div class="app-container min-h-screen bg-ios-bg max-w-lg mx-auto relative">
    <AppNavbar
      v-if="!route.meta.transparentNav"
      :title="route.meta.title"
      :large-title="route.meta.largeTitle"
      :show-back="route.meta.showTabBar === false && route.path !== '/' && route.path !== '/admin/login'"
    />

    <main
      class="pb-safe"
      :class="{
        'pt-12': !route.meta.transparentNav && !route.meta.largeTitle,
        'pt-20': !route.meta.transparentNav && route.meta.largeTitle,
        'pb-24': route.meta.showTabBar,
        'pb-6': !route.meta.showTabBar
      }"
    >
      <router-view />
    </main>

    <AppTabBar v-if="route.meta.showTabBar" />
  </div>
</template>

<style scoped>
.app-container {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
}

.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
</style>
