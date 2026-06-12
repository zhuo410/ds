<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { adminAPI } from '@/api'
import AppToast from '@/components/ui/AppToast.vue'

const router = useRouter()
const user = useUserStore()
const toast = ref(null)
const orders = ref([])
const loading = ref(true)
const filter = ref('all')

const statusMap = {
  pending_payment: '待付款', pending_shipment: '待发货',
  shipped: '待收货', completed: '已完成', cancelled: '已取消'
}

onMounted(async () => {
  if (!user.isAdmin) { router.push('/admin/login'); return }
  await fetchOrders()
})

async function fetchOrders() {
  loading.value = true
  try {
    const params = {}
    if (filter.value !== 'all') params.status = filter.value
    const res = await adminAPI.orders.list(params)
    orders.value = res.data?.list || res.data || []
  } catch (e) { orders.value = [] }
  finally { loading.value = false }
}

async function updateStatus(order, newStatus) {
  try {
    await adminAPI.orders.updateStatus(order._id || order.id, newStatus)
    toast.value?.show('操作成功', { type: 'success' })
    await fetchOrders()
  } catch (e) {
    toast.value?.show('操作失败', { type: 'error' })
  }
}
</script>

<template>
  <div class="bg-ios-bg min-h-screen">
    <AppToast ref="toast" />

    <div class="p-4">
      <div class="flex items-center gap-3 mb-4">
        <button @click="router.push('/admin')" class="text-ios-accent ios-touch">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <h1 class="text-[22px] font-bold">订单管理</h1>
      </div>

      <!-- Filter -->
      <div class="flex gap-2 overflow-x-auto pb-3 no-scrollbar">
        <button v-for="opt in [{k:'all',l:'全部'},{k:'pending_payment',l:'待付款'},{k:'pending_shipment',l:'待发货'},{k:'shipped',l:'待收货'},{k:'completed',l:'已完成'},{k:'cancelled',l:'已取消'}]"
                :key="opt.k"
                @click="filter=opt.k; fetchOrders()"
                class="px-3 py-1.5 rounded-[8px] text-[13px] font-medium whitespace-nowrap ios-touch"
                :class="filter===opt.k ? 'bg-ios-accent text-white' : 'bg-gray-100 text-ios-text'">
          {{ opt.l }}
        </button>
      </div>

      <div v-if="loading" class="space-y-3">
        <div v-for="i in 3" :key="i" class="ios-card p-4 animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
          <div class="h-3 bg-gray-200 rounded w-full"></div>
        </div>
      </div>

      <div v-else class="space-y-3">
        <div v-for="order in orders" :key="order._id || order.id" class="ios-card overflow-hidden">
          <div class="px-4 py-3 border-b border-ios-separator flex items-center justify-between">
            <span class="text-[12px] text-ios-text-secondary">{{ order.orderNo?.slice(-8) }}</span>
            <span class="text-[12px] font-medium" :class="order.status==='cancelled'?'text-ios-text-secondary':'text-ios-accent'">
              {{ statusMap[order.status] }}
            </span>
          </div>
          <div class="px-4 py-3">
            <div v-for="item in (order.items||[])" :key="item.productId" class="flex items-center gap-2 text-[13px]">
              <span class="truncate flex-1">{{ item.name }}×{{ item.quantity }}</span>
              <span class="font-medium">¥{{ item.price }}</span>
            </div>
          </div>
          <div class="px-4 py-3 border-t border-ios-separator flex items-center justify-between">
            <span class="text-[13px] font-semibold">¥{{ order.totalFee }}</span>
            <div class="flex gap-2">
              <button v-if="order.status==='pending_payment'"
                      @click="updateStatus(order, 'cancelled')"
                      class="text-[12px] text-ios-destructive ios-touch px-3 py-1 rounded-lg bg-red-50">取消</button>
              <button v-if="order.status==='pending_shipment'"
                      @click="updateStatus(order, 'shipped')"
                      class="text-[12px] text-ios-accent ios-touch px-3 py-1 rounded-lg bg-blue-50">发货</button>
              <button v-if="order.status==='shipped'"
                      @click="updateStatus(order, 'completed')"
                      class="text-[12px] text-green-600 ios-touch px-3 py-1 rounded-lg bg-green-50">完成</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
</style>
