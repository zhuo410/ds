<script setup>
import { ref } from 'vue'

const props = defineProps({
  images: { type: Array, default: () => [] }
})

const currentIndex = ref(0)

function next() {
  if (currentIndex.value < props.images.length - 1) currentIndex.value++
}
function prev() {
  if (currentIndex.value > 0) currentIndex.value--
}
</script>

<template>
  <div class="relative w-full overflow-hidden bg-gray-100" style="aspect-ratio: 1/1;">
    <!-- Images -->
    <div class="flex h-full transition-transform duration-300 ease-out"
         :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
      <div v-for="(img, i) in images" :key="i" class="w-full h-full flex-shrink-0">
        <img
          :src="img"
          :alt="`图片 ${i + 1}`"
          class="w-full h-full object-cover"
          onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22><rect fill=%22%23f0f0f0%22 width=%22200%22 height=%22200%22/><text x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23ccc%22 font-size=%2214%22>暂无图片</text></svg>'"
        />
      </div>
    </div>

    <!-- Placeholder if no images -->
    <div v-if="images.length === 0" class="absolute inset-0 flex items-center justify-center">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C7C7CC" stroke-width="1">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <path d="M21 15l-5-5L5 21"/>
      </svg>
    </div>

    <!-- Dots -->
    <div v-if="images.length > 1"
         class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
      <span v-for="(_, i) in images" :key="i"
            class="w-1.5 h-1.5 rounded-full transition-all duration-200"
            :class="i === currentIndex ? 'bg-white w-3' : 'bg-white/50'">
      </span>
    </div>
  </div>
</template>
