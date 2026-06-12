<script setup>
defineProps({
  padding: { type: String, default: 'p-4' },
  class: { type: String, default: '' }
})
</script>

<template>
  <div class="ios-card overflow-hidden" :class="[padding, $attrs.class]">
    <slot />
  </div>
</template>
