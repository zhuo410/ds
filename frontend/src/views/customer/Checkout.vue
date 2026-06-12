<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import { orderAPI, paymentAPI, addressAPI } from '@/api'
import AppButton from '@/components/ui/AppButton.vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppToast from '@/components/ui/AppToast.vue'

const router = useRouter()
const cart = useCartStore()
const user = useUserStore()
const toast = ref(null)
const showPayModal = ref(false)
const submitting = ref(false)
const addresses = ref([])
const selectedAddress = ref(null)
const paymentMethod = ref('wechat')

const totalAmount = computed(() => cart.totalPrice)

onMounted(async () => {
  if (!cart.selectedItems.length && !cart.items.length) {
    // If nothing selected, use all items
  }
  // Load addresses
  try {
    const res = await addressAPI.list()
    addresses.value = res.data || []
    selectedAddress.value = addresses.value.find(a => a.isDefault) || addresses.value[0] || null
  } catch(e) {}
})

async function submitOrder() {
  if (!selectedAddress.value) {
    toast.value?.show('请选择收货地址', { type: 'error' })
    return
  }
  submitting.value = true
  try {
    const res = await orderAPI.create({
      items: cart.selectedItems.length ? cart.selectedItems.map(i => ({
        productId: i.productId || i.id,
        name: i.name,
        image: i.image,
        price: i.price,
        spec: i.spec,
        quantity: i.quantity
      })) : cart.items.map(i => ({
        productId: i.productId || i.id,
        name: i.name,
        image: i.image,
        price: i.price,
        spec: i.spec,
        quantity: i.quantity
      })),
      addressId: selectedAddress.value._id || selectedAddress.value.id,
      paymentMethod: paymentMethod.value
    })
    // Show simulated payment
    cart.clearCart()
    showPayModal.value = true
  } catch (e) {
    toast.value?.show('提交订单失败', { type: 'error' })
  } finally {
    submitting.value = false
  }
}

function paySuccess() {
  showPayModal.value = false
  router.push('/orders')
}

const orderItems = computed(() => cart.selectedItems.length ? cart.selectedItems : cart.items)
</script>

<template>
  <div class="pb-32">
    <!-- Delivery address -->
    <div class="mx-4 mt-3">
      <div v-if="selectedAddress" class="ios-card p-4 ios-touch">
        <div class="flex items-start gap-3">
          <svg class="w-5 h-5 mt-0.5 text-ios-accent flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
          </svg>
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <span class="text-[15px] font-semibold">{{ selectedAddress.name }}</span>
              <span class="text-[13px] text-ios-text-secondary">{{ selectedAddress.phone }}</span>
            </div>
            <p class="text-[13px] text-ios-text-secondary mt-1">{{ selectedAddress.province }}{{ selectedAddress.city }}{{ selectedAddress.district }}{{ selectedAddress.detail }}</p>
          </div>
          <svg class="w-5 h-5 text-ios-text-secondary flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
        </div>
      </div>
      <div v-else @click="router.push('/addresses')" class="ios-card p-4 ios-touch flex items-center gap-3">
        <svg class="w-5 h-5 text-ios-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 5v14M5 12h14"/></svg>
        <span class="text-[15px] text-ios-accent font-medium">添加收货地址</span>
      </div>
    </div>

    <!-- Order items -->
    <div class="mx-4 mt-3">
      <div class="ios-card overflow-hidden">
        <div class="px-4 py-3 border-b border-ios-separator">
          <span class="text-[15px] font-semibold">商品清单</span>
        </div>
        <div v-for="item in orderItems" :key="item.productId || item.id"
             class="flex items-center gap-3 px-4 py-3 border-b border-ios-separator last:border-0">
          <div class="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
            <img :src="item.image" alt="" class="w-full h-full object-cover"
                 onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2264%22 height=%2264%22><rect fill=%22%23f0f0f0%22 width=%2264%22 height=%2264%22/></svg>'">
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="text-[14px] font-medium truncate">{{ item.name }}</h4>
            <p v-if="item.spec" class="text-[12px] text-ios-text-secondary">{{ item.spec }}</p>
          </div>
          <div class="text-right flex-shrink-0">
            <p class="text-[15px] font-semibold text-ios-destructive">¥{{ item.price }}</p>
            <p class="text-[12px] text-ios-text-secondary">×{{ item.quantity }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment method -->
    <div class="mx-4 mt-3">
      <div class="ios-card p-4">
        <div class="flex items-center justify-between">
          <span class="text-[15px] font-semibold">支付方式</span>
          <div class="flex items-center gap-2">
            <span class="text-[13px] text-green-600 font-medium">微信支付</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#07C160"><path d="M17.5 12.5c0 1.5-1.2 2.7-2.7 2.7s-2.7-1.2-2.7-2.7 1.2-2.7 2.7-2.7 2.7 1.2 2.7 2.7zM12 2C6.5 2 2 5.8 2 10.5c0 2.5 1.3 4.7 3.3 6.2L4.5 20l3.7-2c1 .3 2 .5 3 .5 5.5 0 10-3.8 10-8.5S17.5 2 12 2z"/></svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary -->
    <div class="mx-4 mt-3">
      <div class="ios-card p-4 space-y-2">
        <div class="flex justify-between text-[14px]">
          <span class="text-ios-text-secondary">商品小计</span>
          <span class="text-ios-text font-medium">¥{{ totalAmount.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between text-[14px]">
          <span class="text-ios-text-secondary">运费</span>
          <span class="text-ios-success font-medium">免运费</span>
        </div>
        <div class="border-t border-ios-separator pt-2 flex justify-between">
          <span class="text-[15px] font-semibold">合计</span>
          <span class="text-[20px] font-bold text-ios-destructive">¥{{ totalAmount.toFixed(2) }}</span>
        </div>
      </div>
    </div>

    <!-- Submit button -->
    <div class="fixed bottom-0 left-0 right-0 z-40 flex justify-center pb-safe-bottom pointer-events-none">
      <div class="pointer-events-auto mx-4 mb-3" style="max-width: 400px; width: calc(100% - 32px);">
        <AppButton block :loading="submitting" @click="submitOrder">
          提交订单 ¥{{ totalAmount.toFixed(2) }}
        </AppButton>
      </div>
    </div>

    <!-- Payment success modal -->
    <AppModal :show="showPayModal" title="支付成功" @close="paySuccess">
      <div class="flex flex-col items-center py-4">
        <div class="w-16 h-16 rounded-full bg-ios-success/10 flex items-center justify-center mb-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#34C759" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
        <p class="text-[17px] font-semibold">支付成功</p>
        <p class="text-[14px] text-ios-text-secondary mt-1">您的订单已提交，我们会尽快发货</p>
        <AppButton class="mt-6" block @click="paySuccess">查看订单</AppButton>
      </div>
    </AppModal>

    <AppToast ref="toast" />
  </div>
</template>
