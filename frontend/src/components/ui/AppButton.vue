<script setup>
const props = defineProps({
  type: { type: String, default: 'primary' }, // primary | secondary | danger | plain
  size: { type: String, default: 'md' }, // sm | md | lg
  block: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['click'])

const typeClasses = {
  primary: 'bg-ios-accent text-white active:bg-blue-600',
  secondary: 'bg-gray-100 text-ios-text active:bg-gray-200',
  danger: 'bg-ios-destructive text-white active:bg-red-600',
  plain: 'bg-transparent text-ios-accent active:bg-blue-50 border border-ios-accent/30'
}

const sizeClasses = {
  sm: 'text-[13px] py-1.5 px-3 rounded-lg',
  md: 'text-[15px] py-2.5 px-5 rounded-xl',
  lg: 'text-[17px] py-3.5 px-6 rounded-xl'
}

function handleClick(e) {
  if (!props.disabled && !props.loading) {
    emit('click', e)
  }
}
</script>

<template>
  <button
    :class="[
      'font-semibold ios-touch transition-all duration-150 inline-flex items-center justify-center gap-2',
      typeClasses[type],
      sizeClasses[size],
      block ? 'w-full' : '',
      (disabled || loading) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <svg v-if="loading" class="animate-spin -ml-1" width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-dasharray="31.4 31.4" opacity="0.3"/>
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-dasharray="31.4 31.4" stroke-dashoffset="-10" opacity="0.8"/>
    </svg>
    <slot />
  </button>
</template>
