<script setup>
import { ref, watch } from 'vue'

const visible = ref(false)
const message = ref('')
const type = ref('info')
let timer = null

function show(msg, opts = {}) {
  message.value = msg
  type.value = opts.type || 'info'
  visible.value = true
  clearTimeout(timer)
  timer = setTimeout(() => { visible.value = false }, opts.duration || 2000)
}

function hide() {
  visible.value = false
  clearTimeout(timer)
}

defineExpose({ show, hide })
</script>

<template>
  <Teleport to="body">
    <transition name="ios-toast">
      <div v-if="visible"
           class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] px-6 py-3 rounded-xl shadow-lg"
           :class="type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-ios-destructive' : 'bg-gray-800'">
        <span class="text-white text-[15px] font-medium">{{ message }}</span>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.ios-toast-enter-active { transition: all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1); }
.ios-toast-leave-active { transition: all 0.15s ease-in; }
.ios-toast-enter-from { opacity: 0; transform: translate(-50%, -50%) scale(0.85); }
.ios-toast-leave-to { opacity: 0; transform: translate(-50%, -50%) scale(0.85); }
</style>
