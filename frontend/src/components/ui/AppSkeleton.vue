<script setup>
defineProps({
  type: { type: String, default: 'card' }, // card | list | product-grid
  count: { type: Number, default: 4 }
})
</script>

<template>
  <div class="animate-pulse space-y-4 p-4">
    <!-- Card skeleton -->
    <div v-if="type === 'card'" v-for="i in count" :key="i" class="ios-card p-4 space-y-3">
      <div class="h-4 bg-gray-200 rounded w-3/4"></div>
      <div class="h-3 bg-gray-200 rounded w-1/2"></div>
      <div class="h-3 bg-gray-200 rounded w-full"></div>
    </div>

    <!-- Product grid skeleton -->
    <div v-if="type === 'product-grid'" class="grid grid-cols-2 gap-3">
      <div v-for="i in 6" :key="i" class="ios-card overflow-hidden">
        <div class="aspect-square bg-gray-200"></div>
        <div class="p-3 space-y-2">
          <div class="h-3 bg-gray-200 rounded w-3/4"></div>
          <div class="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    </div>

    <!-- List skeleton -->
    <div v-if="type === 'list'" v-for="i in count" :key="i" class="flex gap-3 p-4">
      <div class="w-16 h-16 bg-gray-200 rounded-xl flex-shrink-0"></div>
      <div class="flex-1 space-y-2 py-1">
        <div class="h-3 bg-gray-200 rounded w-3/4"></div>
        <div class="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  </div>
</template>
