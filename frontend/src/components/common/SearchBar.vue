<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const keyword = ref('')

function onSearch() {
  const kw = keyword.value.trim()
  if (kw) {
    router.push({ path: '/search', query: { q: kw } })
  }
}
</script>

<template>
  <div class="relative">
    <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ios-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="10" cy="10" r="7"/>
      <path d="M15 15l6 6"/>
    </svg>
    <input
      v-model="keyword"
      type="search"
      placeholder="搜索商品..."
      class="w-full h-9 pl-9 pr-3 bg-gray-100 rounded-[10px] text-[15px] placeholder:text-ios-text-secondary outline-none"
      @keydown.enter="onSearch"
    />
  </div>
</template>
