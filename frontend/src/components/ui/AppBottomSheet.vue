<script setup>
import { onMounted, onUnmounted } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: '' }
})

const emit = defineEmits(['close'])

function close() {
  emit('close')
}

onMounted(() => document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close() }))
onUnmounted(() => document.removeEventListener('keydown', (e) => { if (e.key === 'Escape') close() }))
</script>

<template>
  <Teleport to="body">
    <transition name="ios-sheet">
      <div v-if="show" class="fixed inset-0 z-50 flex items-end" @click.self="close">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="close"></div>
        <!-- Sheet -->
        <div class="relative w-full bg-white rounded-t-[20px] overflow-hidden ios-transition"
             style="padding-bottom: env(safe-area-inset-bottom, 0px); max-height: 75vh;">
          <!-- Grab handle -->
          <div class="flex justify-center pt-3 pb-1">
            <div class="w-9 h-1 bg-gray-300 rounded-full"></div>
          </div>
          <!-- Title -->
          <div v-if="title" class="px-5 pb-3">
            <h3 class="text-[17px] font-semibold text-center">{{ title }}</h3>
          </div>
          <!-- Content -->
          <div class="overflow-y-auto px-5 pb-6" style="max-height: calc(75vh - 60px);">
            <slot />
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.ios-sheet-enter-active,
.ios-sheet-leave-active {
  transition: opacity 0.25s cubic-bezier(0.25, 0.1, 0.25, 1);
}
.ios-sheet-enter-active > div:last-child,
.ios-sheet-leave-active > div:last-child {
  transition: transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1);
}
.ios-sheet-enter-from,
.ios-sheet-leave-to {
  opacity: 0;
}
.ios-sheet-enter-from > div:last-child,
.ios-sheet-leave-to > div:last-child {
  transform: translateY(100%);
}
</style>
