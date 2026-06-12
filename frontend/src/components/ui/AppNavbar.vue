<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  title: { type: String, default: '' },
  largeTitle: { type: Boolean, default: false },
  showBack: { type: Boolean, default: false },
  transparent: { type: Boolean, default: false }
})

const router = useRouter()

function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<template>
  <header v-if="largeTitle" class="fixed top-0 left-0 right-0 z-40 ios-blur"
          style="padding-top: env(safe-area-inset-top, 0px);">
    <div class="max-w-lg mx-auto px-5 pt-2 pb-2">
      <!-- Back button for large title pages -->
      <button v-if="showBack" @click="goBack" class="flex items-center gap-1 text-ios-accent mb-1 ios-touch">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
        <span class="text-[17px]">返回</span>
      </button>
      <h1 class="ios-large-title">
        {{ title }}
      </h1>
    </div>
  </header>

  <header v-else class="fixed top-0 left-0 right-0 z-40 ios-blur"
          style="padding-top: env(safe-area-inset-top, 0px);">
    <div class="max-w-lg mx-auto h-11 flex items-center justify-center relative px-4">
      <!-- Back button -->
      <button v-if="showBack" @click="goBack"
              class="absolute left-2 flex items-center gap-0.5 text-ios-accent ios-touch py-2">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>

      <!-- Title -->
      <span class="text-[17px] font-semibold truncate max-w-[60%]">
        {{ title }}
      </span>

      <!-- Placeholder for symmetry when back is shown -->
      <div v-if="showBack" class="w-12"></div>
    </div>
    <!-- Hairline separator -->
    <div class="h-[0.5px] bg-ios-separator"></div>
  </header>
</template>
