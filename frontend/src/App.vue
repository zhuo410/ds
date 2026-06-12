<script setup>
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppTabBar from '@/components/ui/AppTabBar.vue'
import AppNavbar from '@/components/ui/AppNavbar.vue'

const route = useRoute()
const router = useRouter()

// Set document title from route meta
watch(() => route.meta.title, (title) => {
  if (title) document.title = title
}, { immediate: true })
</script>

<template>
  <div class="app-container min-h-screen bg-ios-bg max-w-lg mx-auto relative">
    <!-- Navigation bar (hidden on pages with transparent nav) -->
    <AppNavbar
      v-if="!route.meta.transparentNav"
      :title="route.meta.title"
      :large-title="route.meta.largeTitle"
      :show-back="route.meta.showTabBar === false && route.path !== '/' && route.path !== '/admin/login'"
    />

    <!-- Page content -->
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

    <!-- iOS-style floating Tab Bar -->
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
