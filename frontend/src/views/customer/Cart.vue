<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import AppEmpty from '@/components/ui/AppEmpty.vue'
import AppButton from '@/components/ui/AppButton.vue'

const router = useRouter()
const cart = useCartStore()
const user = useUserStore()
const editing = ref(false)

onMounted(() => {
  if (!user.isLoggedIn) {
    // Show empty cart for non-logged-in users
    return
  }
  cart.fetchCart()
})

function toggleSelectAll() {
  const allSelected = cart.items.every(i => i.selected !== false)
  cart.items.forEach(i => { i.selected = !allSelected })
}

function deleteSelected() {
  const toRemove = cart.items.filter(i => i.selected !== false)
  toRemove.forEach(item => cart.removeItem(item._id || item.id))
}

function goCheckout() {
  if (!cart.selectedItems.length) return
  router.push('/checkout')
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-2">
      <span class="text-[15px] font-semibold">共 {{ cart.count }} 件商品</span>
      <button @click="editing = !editing"
              class="text-[15px] text-ios-accent font-medium ios-touch">
        {{ editing ? '完成' : '编辑' }}
      </button>
    </div>

    <!-- Cart items -->
    <div v-if="cart.items.length === 0" class="pt-12">
      <AppEmpty icon="cart" text="购物车是空的" action-text="去逛逛" @action="router.push('/')" />
    </div>

    <div v-else class="px-4 space-y-3 pb-32">
      <div v-for="item in cart.items" :key="item._id || item.id"
           class="ios-card overflow-hidden flex items-stretch">
        <!-- Select checkbox -->
        <div class="flex items-center pl-4 pr-2">
          <div @click="item.selected = !(item.selected !== false)"
               class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer"
               :class="item.selected !== false ? 'border-ios-accent bg-ios-accent' : 'border-gray-300'">
            <svg v-if="item.selected !== false" width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
        </div>
        <!-- Image -->
        <div class="w-20 h-20 my-3 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
          <img :src="item.image || item.images?.[0]" alt="" class="w-full h-full object-cover"
               onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22><rect fill=%22%23f0f0f0%22 width=%2280%22 height=%2280%22/></svg>'">
        </div>
        <!-- Info -->
        <div class="flex-1 py-3 pl-3 pr-4 flex flex-col justify-between">
          <div>
            <h4 class="text-[14px] font-medium leading-tight line-clamp-2">{{ item.name }}</h4>
            <p v-if="item.spec" class="text-[12px] text-ios-text-secondary mt-0.5">{{ item.spec }}</p>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-[16px] font-semibold text-ios-destructive">¥{{ item.price }}</span>
            <div v-if="!editing" class="flex items-center gap-2">
              <button @click="cart.updateQuantity(item._id || item.id, Math.max(1, item.quantity - 1))"
                      class="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[16px] ios-touch">−</button>
              <span class="text-[15px] font-medium min-w-[20px] text-center">{{ item.quantity }}</span>
              <button @click="cart.updateQuantity(item._id || item.id, Math.min(99, item.quantity + 1))"
                      class="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[16px] ios-touch">+</button>
            </div>
            <button v-else @click="cart.removeItem(item._id || item.id)"
                    class="text-[13px] text-ios-destructive font-medium ios-touch">
              删除
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="fixed bottom-0 left-0 right-0 z-40 flex justify-center pb-safe-bottom pointer-events-none">
      <div class="ios-blur ios-card pointer-events-auto mx-4 mb-3 px-4 py-3 flex items-center gap-3"
           style="max-width: 400px; width: calc(100% - 32px); border-radius: 16px;">
        <div class="flex-1 flex items-center gap-2">
          <div v-if="!editing" @click="toggleSelectAll"
               class="w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer"
               :class="cart.items.every(i => i.selected !== false) ? 'border-ios-accent bg-ios-accent' : 'border-gray-300'">
            <svg v-if="cart.items.every(i => i.selected !== false)" width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <span v-if="!editing" class="text-[13px] text-ios-text-secondary">全选</span>
          <button v-else @click="deleteSelected"
                  class="text-[14px] text-ios-destructive font-medium ios-touch">删除选中</button>
        </div>
        <div v-if="!editing" class="flex items-center gap-3">
          <div class="text-right">
            <span class="text-[13px] text-ios-text-secondary">合计：</span>
            <span class="text-[18px] font-bold text-ios-destructive">¥{{ cart.totalPrice.toFixed(2) }}</span>
          </div>
          <AppButton :disabled="!cart.selectedItems.length" @click="goCheckout">结算</AppButton>
        </div>
      </div>
    </div>
  </div>
</template>
