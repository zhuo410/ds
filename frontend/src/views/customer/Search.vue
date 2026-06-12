<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { productAPI } from '@/api'
import ProductGrid from '@/components/product/ProductGrid.vue'
import AppEmpty from '@/components/ui/AppEmpty.vue'

const route = useRoute()
const keyword = ref(route.query.q || '')
const products = ref([])
const loading = ref(false)
const searched = ref(false)

async function doSearch() {
  if (!keyword.value.trim()) return
  loading.value = true
  searched.value = true
  try {
    const res = await productAPI.list({ keyword: keyword.value, pageSize: 20 })
    products.value = res.data?.list || res.data || []
  } catch (e) {
    // Search fallback - try to filter client side
    products.value = []
  } finally {
    loading.value = false
  }
}

watch(() => route.query.q, (q) => {
  if (q) {
    keyword.value = q
    doSearch()
  }
}, { immediate: true })
</script>

<template>
  <div class="px-4 pt-3">
    <div class="relative mb-4">
      <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ios-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="10" cy="10" r="7"/><path d="M15 15l6 6"/>
      </svg>
      <input v-model="keyword" type="search" placeholder="搜索商品..." autofocus
             class="w-full h-11 pl-9 pr-4 bg-gray-100 rounded-[12px] text-[16px] outline-none"
             @keydown.enter="doSearch"/>
    </div>

    <div v-if="!searched" class="text-center py-12 text-ios-text-secondary text-[14px]">
      输入关键词搜索商品
    </div>

    <ProductGrid v-else :products="products" :loading="loading" />
  </div>
</template>
