<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { productAPI, categoryAPI } from '@/api'
import ProductGrid from '@/components/product/ProductGrid.vue'
import AppBottomSheet from '@/components/ui/AppBottomSheet.vue'

const route = useRoute()
const products = ref([])
const categories = ref([])
const selectedCategory = ref(route.query.category || 'all')
const sortBy = ref('default')
const loading = ref(true)
const showFilter = ref(false)

const sortOptions = [
  { value: 'default', label: '综合' },
  { value: 'sales', label: '销量' },
  { value: 'price_asc', label: '价格 ↑' },
  { value: 'price_desc', label: '价格 ↓' },
  { value: 'newest', label: '最新' }
]

async function fetchProducts() {
  loading.value = true
  try {
    const params = { pageSize: 20 }
    if (selectedCategory.value && selectedCategory.value !== 'all') {
      params.category = selectedCategory.value
    }
    if (sortBy.value !== 'default') {
      params.sort = sortBy.value
    }
    const res = await productAPI.list(params)
    products.value = res.data?.list || res.data || []
  } catch (e) {
    products.value = []
  } finally {
    loading.value = false
  }
}

async function fetchCategories() {
  try {
    const res = await categoryAPI.list()
    categories.value = res.data || []
  } catch (e) {
    categories.value = []
  }
}

onMounted(() => {
  fetchCategories()
  fetchProducts()
})

watch(() => route.query.category, (val) => {
  selectedCategory.value = val || 'all'
  fetchProducts()
})

function selectCategory(id) {
  selectedCategory.value = id
  showFilter.value = false
  fetchProducts()
}

function selectSort(option) {
  sortBy.value = option
  fetchProducts()
}
</script>

<template>
  <div>
    <!-- Category filter chips -->
    <div class="px-4 py-3 overflow-x-auto flex gap-2 no-scrollbar">
      <button @click="selectCategory('all')"
              class="px-4 py-1.5 rounded-full text-[13px] font-medium ios-touch whitespace-nowrap transition-colors"
              :class="selectedCategory === 'all' ? 'bg-ios-accent text-white' : 'bg-gray-100 text-ios-text'">
        全部
      </button>
      <button v-for="cat in categories" :key="cat._id"
              @click="selectCategory(cat._id)"
              class="px-4 py-1.5 rounded-full text-[13px] font-medium ios-touch whitespace-nowrap transition-colors"
              :class="selectedCategory === cat._id ? 'bg-ios-accent text-white' : 'bg-gray-100 text-ios-text'">
        {{ cat.name }}
      </button>
    </div>

    <!-- Sort bar -->
    <div class="flex items-center gap-1 px-4 pb-2 border-b border-ios-separator">
      <button v-for="opt in sortOptions" :key="opt.value"
              @click="selectSort(opt.value)"
              class="px-3 py-1 text-[13px] font-medium ios-touch rounded-lg transition-colors"
              :class="sortBy === opt.value ? 'text-ios-accent' : 'text-ios-text-secondary'">
        {{ opt.label }}
      </button>
    </div>

    <!-- Product grid -->
    <ProductGrid :products="products" :loading="loading" />

    <!-- Filter bottom sheet -->
    <AppBottomSheet :show="showFilter" title="筛选分类" @close="showFilter = false">
      <div class="grid grid-cols-3 gap-3">
        <button v-for="cat in categories" :key="cat._id"
                @click="selectCategory(cat._id)"
                class="px-3 py-2 rounded-xl text-[14px] transition-colors"
                :class="selectedCategory === cat._id ? 'bg-ios-accent text-white' : 'bg-gray-100 text-ios-text'">
          {{ cat.name }}
        </button>
      </div>
    </AppBottomSheet>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
</style>
