<script setup>
import ProductCard from './ProductCard.vue'
import AppEmpty from '@/components/ui/AppEmpty.vue'

defineProps({
  products: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
})
</script>

<template>
  <div v-if="loading" class="grid grid-cols-2 gap-3 p-4">
    <div v-for="i in 6" :key="i" class="ios-card overflow-hidden animate-pulse">
      <div class="aspect-square bg-gray-200"></div>
      <div class="p-3 space-y-2">
        <div class="h-3 bg-gray-200 rounded w-3/4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
  </div>
  <div v-else-if="products.length === 0" class="py-12">
    <AppEmpty text="暂无商品" />
  </div>
  <div v-else class="grid grid-cols-2 gap-3 p-4">
    <ProductCard v-for="product in products" :key="product._id || product.id" :product="product" />
  </div>
</template>
