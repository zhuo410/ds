<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  product: { type: Object, required: true }
})

const router = useRouter()
const p = props.product

function goDetail() {
  router.push(`/product/${p._id || p.id}`)
}
</script>

<template>
  <div @click="goDetail" class="ios-card overflow-hidden ios-touch cursor-pointer">
    <!-- Product image -->
    <div class="aspect-square bg-gray-100 overflow-hidden">
      <img
        :src="(p.images?.[0] || p.image) ? (p.images?.[0] || p.image) : '/placeholder.svg'"
        :alt="p.name"
        class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        loading="lazy"
        onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22><rect fill=%22%23f0f0f0%22 width=%22200%22 height=%22200%22/><text x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23ccc%22 font-size=%2214%22>暂无图片</text></svg>'"
      />
    </div>
    <!-- Product info -->
    <div class="p-3 space-y-1">
      <h3 class="text-[13px] font-medium text-ios-text leading-tight line-clamp-2">{{ p.name }}</h3>
      <p v-if="p.specs?.length" class="text-[11px] text-ios-text-secondary">{{ p.specs.map(s => s.name).join(' / ') }}</p>
      <div class="flex items-center gap-1.5">
        <span class="text-[16px] font-semibold text-ios-destructive">¥{{ p.price }}</span>
        <span v-if="p.comparePrice" class="text-[12px] text-ios-text-secondary line-through">¥{{ p.comparePrice }}</span>
      </div>
      <div v-if="p.sales != null" class="text-[11px] text-ios-text-secondary">已售 {{ p.sales > 999 ? `${(p.sales/1000).toFixed(1)}k` : p.sales }}</div>
    </div>
  </div>
</template>
