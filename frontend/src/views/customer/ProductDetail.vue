<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productAPI } from '@/api'
import { useCartStore } from '@/stores/cart'
import ImageGallery from '@/components/common/ImageGallery.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppBottomSheet from '@/components/ui/AppBottomSheet.vue'
import AppToast from '@/components/ui/AppToast.vue'

const route = useRoute()
const router = useRouter()
const cart = useCartStore()
const toast = ref(null)

const product = ref(null)
const loading = ref(true)
const selectedSpec = ref('')
const quantity = ref(1)
const showSpecSheet = ref(false)

onMounted(async () => {
  try {
    const res = await productAPI.detail(route.params.id)
    product.value = res.data || res
  } catch (e) {
    // Fallback demo data
    product.value = {
      _id: route.params.id,
      name: '精选商品',
      description: '这是商品详情描述。精选优质材料，匠心制作。品质保证，值得信赖。',
      price: 99.00,
      comparePrice: 199.00,
      images: [],
      specs: [{ name: '标准款' }, { name: '豪华款' }],
      sales: 888,
      stock: 100
    }
  } finally {
    loading.value = false
  }
})

function addToCart() {
  if (product.value.specs?.length && !selectedSpec.value) {
    showSpecSheet.value = true
    return
  }
  cart.addItem({
    id: product.value._id,
    name: product.value.name,
    image: product.value.images?.[0],
    price: product.value.price,
    spec: selectedSpec.value,
    quantity: quantity.value
  }).then(() => {
    toast.value?.show('已加入购物车', { type: 'success' })
  }).catch(() => {
    toast.value?.show('加入失败，请重试', { type: 'error' })
  })
}

function buyNow() {
  if (product.value.specs?.length && !selectedSpec.value) {
    showSpecSheet.value = true
    return
  }
  cart.addItem({
    id: product.value._id,
    name: product.value.name,
    image: product.value.images?.[0],
    price: product.value.price,
    spec: selectedSpec.value,
    quantity: quantity.value
  }).then(() => {
    router.push('/checkout')
  })
}

function confirmSpec(spec) {
  selectedSpec.value = spec
  showSpecSheet.value = false
}
</script>

<template>
  <div>
    <AppToast ref="toast" />

    <!-- Loading skeleton -->
    <div v-if="loading" class="animate-pulse">
      <div class="aspect-square bg-gray-200"></div>
      <div class="p-4 space-y-3">
        <div class="h-5 bg-gray-200 rounded w-3/4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/3"></div>
        <div class="h-3 bg-gray-200 rounded w-full"></div>
      </div>
    </div>

    <template v-if="product">
      <!-- Image gallery -->
      <ImageGallery :images="product.images || []" />

      <!-- Product info card -->
      <div class="ios-card mx-4 -mt-4 relative z-10 p-4 mb-3">
        <h1 class="text-[17px] font-semibold leading-snug">{{ product.name }}</h1>
        <div class="flex items-baseline gap-2 mt-2">
          <span class="text-[24px] font-bold text-ios-destructive">¥{{ product.price }}</span>
          <span v-if="product.comparePrice" class="text-[14px] text-ios-text-secondary line-through">¥{{ product.comparePrice }}</span>
        </div>
        <div class="flex items-center gap-3 mt-2 text-[13px] text-ios-text-secondary">
          <span>销量 {{ product.sales || 0 }}</span>
          <span v-if="product.stock != null">库存 {{ product.stock }}</span>
        </div>
      </div>

      <!-- Description -->
      <div class="ios-card mx-4 p-4 mb-3">
        <h3 class="text-[15px] font-semibold mb-2">商品详情</h3>
        <p class="text-[14px] text-ios-text-secondary leading-relaxed">{{ product.description }}</p>
      </div>

      <!-- Spec selector -->
      <div v-if="product.specs?.length" class="ios-card mx-4 p-4 mb-3">
        <h3 class="text-[15px] font-semibold mb-3">规格选择</h3>
        <div class="flex flex-wrap gap-2">
          <button v-for="spec in product.specs" :key="spec.name"
                  @click="selectedSpec = spec.name"
                  class="px-4 py-2 rounded-xl text-[14px] font-medium ios-touch transition-colors"
                  :class="selectedSpec === spec.name ? 'bg-ios-accent/10 text-ios-accent border border-ios-accent/30' : 'bg-gray-100 text-ios-text'">
            {{ spec.name }}
          </button>
        </div>
      </div>

      <!-- Quantity -->
      <div class="ios-card mx-4 p-4 mb-20">
        <div class="flex items-center justify-between">
          <span class="text-[15px] font-semibold">数量</span>
          <div class="flex items-center gap-3">
            <button @click="quantity = Math.max(1, quantity - 1)"
                    class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[18px] font-medium ios-touch">−</button>
            <span class="text-[17px] font-semibold min-w-[24px] text-center">{{ quantity }}</span>
            <button @click="quantity = Math.min(product.stock || 99, quantity + 1)"
                    class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[18px] font-medium ios-touch">+</button>
          </div>
        </div>
      </div>
    </template>

    <!-- Bottom action bar -->
    <div class="fixed bottom-0 left-0 right-0 z-40 flex justify-center pb-safe-bottom pointer-events-none">
      <div class="ios-blur ios-card pointer-events-auto mx-4 mb-3 px-4 py-3 flex items-center gap-3"
           style="max-width: 400px; width: calc(100% - 32px); border-radius: 16px;">
        <button @click="addToCart"
                class="flex-1 py-2.5 rounded-xl bg-gray-100 text-ios-text font-semibold text-[15px] ios-touch">
          加入购物车
        </button>
        <button @click="buyNow"
                class="flex-1 py-2.5 rounded-xl bg-ios-accent text-white font-semibold text-[15px] ios-touch">
          立即购买
        </button>
      </div>
    </div>

    <!-- Spec selection bottom sheet -->
    <AppBottomSheet :show="showSpecSheet" title="选择规格" @close="showSpecSheet = false">
      <div class="flex flex-wrap gap-3">
        <button v-for="spec in product?.specs" :key="spec.name"
                @click="confirmSpec(spec.name)"
                class="w-full py-3 rounded-xl text-[16px] font-medium ios-touch border transition-colors text-center"
                :class="selectedSpec === spec.name ? 'border-ios-accent bg-ios-accent/5 text-ios-accent' : 'border-gray-200 text-ios-text'">
          {{ spec.name }}
        </button>
      </div>
      <AppButton class="mt-4" block @click="showSpecSheet = false">取消</AppButton>
    </AppBottomSheet>
  </div>
</template>
