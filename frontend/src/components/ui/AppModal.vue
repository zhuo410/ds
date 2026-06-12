<script setup>
import { onMounted, onUnmounted } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: '' }
})

const emit = defineEmits(['close'])

function onBackdropClick() {
  emit('close')
}

function onKeydown(e) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <transition name="ios-modal">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-8"
           @click.self="onBackdropClick">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="onBackdropClick"></div>
        <!-- Sheet -->
        <div class="ios-card relative w-full max-w-sm overflow-hidden ios-transition"
             style="border-radius: 20px;">
          <!-- Handle -->
          <div class="flex justify-center pt-2 pb-1">
            <div class="w-9 h-1 bg-gray-300 rounded-full"></div>
          </div>
          <!-- Title -->
          <div v-if="title" class="text-center pt-2 pb-1">
            <h3 class="text-[17px] font-semibold">{{ title }}</h3>
          </div>
          <!-- Body -->
          <div class="p-4">
            <slot />
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.ios-modal-enter-active,
.ios-modal-leave-active {
  transition: opacity 0.25s cubic-bezier(0.25, 0.1, 0.25, 1);
}
.ios-modal-enter-active > div:last-child,
.ios-modal-leave-active > div:last-child {
  transition: transform 0.35s cubic-bezier(0.25, 0.1, 0.25, 1);
}
.ios-modal-enter-from,
.ios-modal-leave-to {
  opacity: 0;
}
.ios-modal-enter-from > div:last-child,
.ios-modal-leave-to > div:last-child {
  transform: scale(0.92) translateY(20px);
}
</style>
