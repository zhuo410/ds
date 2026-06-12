<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { productAPI, categoryAPI } from '@/api'
import ProductGrid from '@/components/product/ProductGrid.vue'
import SearchBar from '@/components/common/SearchBar.vue'

const router = useRouter()
const banners = ref([
  { id: 1, image: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22375%22 height=%22160%22><defs><linearGradient id=%22g%22 x1=%220%25%22 y1=%220%25%22 x2=%22100%25%22 y2=%22100%25%22><stop offset=%220%25%22 style=%22stop-color:%23007AFF;stop-opacity:1%22 /><stop offset=%22100%25%22 style=%22stop-color:%2300C6FF;stop-opacity:1%22 /></linearGradient></defs><rect fill=%22url(%23g)%22 width=%22375%22 height=%22160%22 rx=%2212%22/><text x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2220%22>精选好物 限时特惠</text></svg>' },
  { id: 2, image: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22375%22 height=%22160%22><defs><linearGradient id=%22g%22 x1=%220%25%22 y1=%220%25%22 x2=%22100%25%22 y2=%22100%25%22><stop offset=%220%25%22 style=%22stop-color:%23FF6B6B;stop-opacity:1%22 /><stop offset=%22100%25%22 style=%22stop-color:%23FFD93D;stop-opacity:1%22 /></linearGradient></defs><rect fill=%22url(%23g)%22 width=%22375%22 height=%22160%22 rx=%2212%22/><text x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2220%22>新品首发 全场包邮</text></svg>' },
  { id: 3, image: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22375%22 height=%22160%22><defs><linearGradient id=%22g%22 x1=%220%25%22 y1=%220%25%22 x2=%22100%25%22 y2=%22100%25%22><stop offset=%220%25%22 style=%22stop-color:%236C5CE7;stop-opacity:1%22 /><stop offset=%22100%25%22 style=%22stop-color:%23A29BFE;stop-opacity:1%22 /></linearGradient></defs><rect fill=%22url(%23g)%22 width=%22375%22 height=%22160%22 rx=%2212%22/><text x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2220%22>品质生活 即刻拥有</text></svg>' }
])
const categories = ref([])
const hotProducts = ref([])
const loading = ref(true)
const bannerIndex = ref(0)
let bannerTimer = null

onMounted(async () => {
  try {
    const [catRes, prodRes] = await Promise.all([
      categoryAPI.list(),
      productAPI.list({ pageSize: 8, sort: 'sales' })
    ])
    categories.value = catRes.data || []
    hotProducts.value = prodRes.data?.list || prodRes.data || []
  } catch (e) {
    // Use fallback data
    categories.value = [
      { _id: '1', name: '数码', icon: '📱' },
      { _id: '2', name: '服饰', icon: '👔' },
      { _id: '3', name: '美妆', icon: '💄' },
      { _id: '4', name: '食品', icon: '🍜' },
      { _id: '5', name: '家居', icon: '🏠' },
      { _id: '6', name: '运动', icon: '⚽' },
      { _id: '7', name: '图书', icon: '📚' },
      { _id: '8', name: '更多', icon: '⋯' },
    ]
  } finally {
    loading.value = false
  }

  // Auto-play banner
  bannerTimer = setInterval(() => {
    bannerIndex.value = (bannerIndex.value + 1) % banners.value.length
  }, 4000)
})

function goCategory(cat) {
  router.push({ path: '/category', query: { category: cat._id } })
}
</script>

<template>
  <div class="pb-4">
    <!-- Search bar -->
    <div class="px-4 pt-3 pb-2">
      <SearchBar />
    </div>

    <!-- Banner carousel -->
    <div class="px-4 mb-4">
      <div class="relative overflow-hidden rounded-[14px] bg-gray-100" style="aspect-ratio: 375/160;">
        <div class="flex h-full transition-transform duration-500 ease-out"
             :style="{ transform: `translateX(-${bannerIndex * 100}%)` }">
          <div v-for="(b, i) in banners" :key="b.id" class="w-full h-full flex-shrink-0">
            <img :src="b.image" alt="banner" class="w-full h-full object-cover" />
          </div>
        </div>
        <!-- Dots -->
        <div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          <span v-for="(_, i) in banners" :key="i"
                class="w-1.5 h-1.5 rounded-full transition-all duration-300"
                :class="i === bannerIndex ? 'bg-white w-3' : 'bg-white/50'">
          </span>
        </div>
      </div>
    </div>

    <!-- Category grid -->
    <div class="px-4 mb-5">
      <div class="ios-card p-4">
        <div class="grid grid-cols-4 gap-4">
          <div v-for="cat in categories" :key="cat._id"
               @click="goCategory(cat)"
               class="flex flex-col items-center gap-1.5 ios-touch cursor-pointer">
            <div class="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-[22px]">
              {{ cat.icon || '📦' }}
            </div>
            <span class="text-[12px] text-ios-text truncate max-w-full">{{ cat.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Hot products section -->
    <div class="px-4 mb-3">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-[18px] font-semibold text-ios-text">热销推荐</h2>
        <span class="text-[13px] text-ios-text-secondary">查看更多 →</span>
      </div>
      <ProductGrid :products="hotProducts" :loading="loading" />
    </div>
  </div>
</template>
