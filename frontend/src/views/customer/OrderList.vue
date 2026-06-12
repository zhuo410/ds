<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { orderAPI } from '@/api'
import AppEmpty from '@/components/ui/AppEmpty.vue'
import AppSkeleton from '@/components/ui/AppSkeleton.vue'

const router = useRouter()
const orders = ref([])
const loading = ref(true)
const activeTab = ref('all')

const tabs = [
  { key: 'all', label: '全部' },
  { key: 'pending_payment', label: '待付款' },
  { key: 'pending_shipment', label: '待发货' },
  { key: 'shipped', label: '待收货' },
  { key: 'completed', label: '已完成' }
]

const statusMap = {
  pending_payment: '待付款',
  pending_shipment: '待发货',
  shipped: '待收货',
  completed: '已完成',
  cancelled: '已取消'
}

async function fetchOrders() {
  loading.value = true
  try {
    const params = {}
    if (activeTab.value !== 'all') params.status = activeTab.value
    const res = await orderAPI.list(params)
    orders.value = res.data?.list || res.data || []
  } catch (e) {
    orders.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchOrders)

function switchTab(tab) {
  activeTab.value = tab
  fetchOrders()
}

function goDetail(id) {
  router.push(`/order/${id}`)
}
</script>

<template>
  <div>
    <!-- Segment tabs -->
    <div class="px-4 py-2 overflow-x-auto no-scrollbar">
      <div class="flex gap-1 bg-gray-100 rounded-[10px] p-1">
        <button v-for="tab in tabs" :key="tab.key"
                @click="switchTab(tab.key)"
                class="flex-1 px-3 py-1.5 text-[13px] font-medium rounded-[8px] ios-touch transition-all whitespace-nowrap"
                :class="activeTab === tab.key ? 'bg-white text-ios-text shadow-sm' : 'text-ios-text-secondary'">
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Orders -->
    <div v-if="loading" class="px-4 space-y-3 mt-3">
      <div v-for="i in 3" :key="i" class="ios-card p-4 animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
        <div class="flex gap-3">
          <div class="w-16 h-16 bg-gray-200 rounded-xl"></div>
          <div class="flex-1 space-y-2">
            <div class="h-3 bg-gray-200 rounded w-3/4"></div>
            <div class="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="orders.length === 0" class="pt-8">
      <AppEmpty text="暂无订单" action-text="去逛逛" @action="router.push('/')" />
    </div>

    <div v-else class="px-4 space-y-3 mt-3 pb-24">
      <div v-for="order in orders" :key="order._id || order.id"
           @click="goDetail(order._id || order.id)"
           class="ios-card overflow-hidden ios-touch cursor-pointer">
        <!-- Header -->
        <div class="flex items-center justify-between px-4 py-3 border-b border-ios-separator">
          <span class="text-[13px] text-ios-text-secondary">{{ order.orderNo }}</span>
          <span class="text-[13px] font-medium" :class="order.status === 'cancelled' ? 'text-ios-text-secondary' : 'text-ios-accent'">
            {{ statusMap[order.status] || order.status }}
          </span>
        </div>
        <!-- Items -->
        <div class="px-4 py-3 space-y-2">
          <div v-for="item in (order.items || [])" :key="item.productId"
               class="flex items-center gap-3">
            <div class="w-14 h-14 bg-gray-100 rounded-xl flex-shrink-0">
              <img :src="item.image" alt="" class="w-full h-full object-cover rounded-xl"
                   onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2256%22 height=%2256%22><rect fill=%22%23f0f0f0%22 width=%2256%22 height=%2256%22/></svg>'">
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[14px] truncate">{{ item.name }}</p>
              <p class="text-[12px] text-ios-text-secondary">×{{ item.quantity }}</p>
            </div>
            <span class="text-[14px] font-medium">¥{{ item.price }}</span>
          </div>
        </div>
        <!-- Footer -->
        <div class="px-4 py-3 border-t border-ios-separator flex items-center justify-between">
          <span class="text-[13px] text-ios-text-secondary">共 {{ (order.items || []).length }} 件商品</span>
          <span class="text-[15px] font-semibold">合计 ¥{{ order.totalFee }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
</style>
