<script setup>
defineProps({
  icon: { type: String, default: 'box' },
  text: { type: String, default: '暂无数据' },
  actionText: { type: String, default: '' }
})

const emit = defineEmits(['action'])
</script>

<template>
  <div class="flex flex-col items-center justify-center py-20">
    <svg v-if="icon === 'box'" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#C7C7CC" stroke-width="1">
      <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
    </svg>
    <svg v-else-if="icon === 'cart'" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#C7C7CC" stroke-width="1">
      <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/>
    </svg>
    <svg v-else-if="icon === 'search'" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#C7C7CC" stroke-width="1">
      <circle cx="10" cy="10" r="7"/>
      <path d="M15 15l6 6"/>
    </svg>
    <p class="mt-4 text-[15px] text-ios-text-secondary">{{ text }}</p>
    <button v-if="actionText" @click="emit('action')"
            class="mt-4 text-ios-accent text-[15px] font-semibold ios-touch">
      {{ actionText }}
    </button>
  </div>
</template>
