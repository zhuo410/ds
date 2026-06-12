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
  if (isInMiniProgram()) {
    // 小程序 web-view 环境：从 route.query 读取 code 做微信登录
    // 注意：因为 hash 路由，#/?code=xxx 的查询参数在 route.query 中
    const code = route.query.code
    const from = route.query.from

    if (code && !userStore.isLoggedIn) {
      try {
        await userStore.loginWithWechat(code)
        console.log('[App] WeChat login success')
      } catch (e) {
        console.warn('[App] WeChat login failed:', e)
      }
    }

    // 设置分享
    setupShare(
      route.meta.title || '精选好物，品质生活',
      window.location.hash,
      ''
    )
  }
})

// 监听路由变化，如果 URL 中有 code 参数则自动登录
watch(() => route.query.code, async (newCode) => {
  if (newCode && isInMiniProgram() && !userStore.isLoggedIn) {
    try {
      await userStore.loginWithWechat(newCode)
      console.log('[App] WeChat login success via route watch')
    } catch (e) {
      console.warn('[App] WeChat login failed:', e)
    }
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
