<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { orderAPI } from '@/api'
import AppButton from '@/components/ui/AppButton.vue'

const route = useRoute()
const router = useRouter()
const order = ref(null)
const loading = ref(true)

const statusMap = {
  pending_payment: '待付款',
  pending_shipment: '待发货',
  shipped: '待收货',
  completed: '已完成',
  cancelled: '已取消'
}

const timeline = [
  { status: 'pending_payment', label: '提交订单', icon: '📝' },
  { status: 'pending_shipment', label: '等待发货', icon: '📦' },
  { status: 'shipped', label: '配送中', icon: '🚚' },
  { status: 'completed', label: '已完成', icon: '✅' }
]

onMounted(async () => {
  try {
    const res = await orderAPI.detail(route.params.id)
    order.value = res.data || res
  } catch (e) {
    order.value = {
      _id: route.params.id,
      orderNo: 'ORD' + Date.now(),
      status: 'pending_payment',
      totalFee: 99.00,
      items: [{ name: '精选商品', price: 99.00, quantity: 1 }],
      address: { name: '张三', phone: '138****8888', province: '广东省', city: '深圳市', district: '南山区', detail: '科技园路1号' },
      createdAt: new Date().toISOString()
    }
  } finally {
    loading.value = false
  }
})

function getStatusIndex(status) {
  return timeline.findIndex(t => t.status === status)
}
</script>

<template>
  <div v-if="loading" class="animate-pulse p-4 space-y-4">
    <div class="h-12 bg-gray-200 rounded-xl"></div>
    <div class="h-32 bg-gray-200 rounded-xl"></div>
    <div class="h-20 bg-gray-200 rounded-xl"></div>
  </div>

  <template v-if="order">
    <!-- Status banner -->
    <div class="bg-gradient-to-r from-ios-accent to-blue-500 text-white p-5">
      <p class="text-[14px] opacity-90">订单状态</p>
      <p class="text-[24px] font-bold mt-1">{{ statusMap[order.status] || order.status }}</p>
      <p class="text-[13px] opacity-80 mt-1">{{ new Date(order.createdAt).toLocaleString('zh-CN') }}</p>
    </div>

    <!-- Timeline -->
    <div class="ios-card mx-4 -mt-3 relative z-10 p-4 mb-3">
      <div class="flex items-start justify-between">
        <div v-for="(step, i) in timeline" :key="step.status"
             class="flex flex-col items-center flex-1">
          <div :class="[
            'w-8 h-8 rounded-full flex items-center justify-center text-[14px] font-medium transition-all',
            i <= getStatusIndex(order.status) ? 'bg-ios-accent text-white' : 'bg-gray-100 text-gray-400'
          ]">
            {{ i + 1 }}
          </div>
          <p class="text-[11px] mt-1 text-center"
             :class="i <= getStatusIndex(order.status) ? 'text-ios-accent font-medium' : 'text-ios-text-secondary'">
            {{ step.label }}
          </p>
        </div>
      </div>
    </div>

    <!-- Delivery address -->
    <div v-if="order.address" class="mx-4 mb-3">
      <div class="ios-card p-4">
        <div class="flex items-start gap-2">
          <svg class="w-4 h-4 mt-1 text-ios-accent flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
          <div>
            <p class="text-[14px] font-medium">{{ order.address.name }} {{ order.address.phone }}</p>
            <p class="text-[12px] text-ios-text-secondary mt-0.5">{{ order.address.province }}{{ order.address.city }}{{ order.address.district }}{{ order.address.detail }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Order items -->
    <div class="mx-4 mb-3">
      <div class="ios-card overflow-hidden">
        <div class="px-4 py-3 border-b border-ios-separator">
          <span class="text-[15px] font-semibold">商品信息</span>
        </div>
        <div v-for="item in (order.items || [])" :key="item.productId"
             class="flex items-center gap-3 px-4 py-3 border-b border-ios-separator last:border-0">
          <div class="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
            <img :src="item.image" alt="" class="w-full h-full object-cover"
                 onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2256%22 height=%2256%22><rect fill=%22%23f0f0f0%22 width=%2256%22 height=%2256%22/></svg>'">
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-[14px] truncate">{{ item.name }}</p>
          </div>
          <div class="text-right">
            <p class="text-[14px] font-medium">¥{{ item.price }}</p>
            <p class="text-[12px] text-ios-text-secondary">×{{ item.quantity }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Order summary -->
    <div class="mx-4 mb-20">
      <div class="ios-card p-4 space-y-2 text-[14px]">
        <div class="flex justify-between">
          <span class="text-ios-text-secondary">订单编号</span>
          <span class="text-ios-text">{{ order.orderNo }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-ios-text-secondary">下单时间</span>
          <span class="text-ios-text">{{ new Date(order.createdAt).toLocaleString('zh-CN') }}</span>
        </div>
        <div class="border-t border-ios-separator pt-2 flex justify-between">
          <span class="font-semibold">实付款</span>
          <span class="text-[18px] font-bold text-ios-destructive">¥{{ order.totalFee }}</span>
        </div>
      </div>
    </div>
  </template>
</template>
