<script setup>
import { ref, onMounted } from 'vue'
import { addressAPI } from '@/api'
import AppButton from '@/components/ui/AppButton.vue'
import AppBottomSheet from '@/components/ui/AppBottomSheet.vue'
import AppEmpty from '@/components/ui/AppEmpty.vue'
import AppToast from '@/components/ui/AppToast.vue'

const toast = ref(null)
const addresses = ref([])
const loading = ref(true)
const showForm = ref(false)
const editingAddress = ref(null)
const form = ref({ name: '', phone: '', province: '', city: '', district: '', detail: '', isDefault: false })

async function fetchAddresses() {
  loading.value = true
  try {
    const res = await addressAPI.list()
    addresses.value = res.data || []
  } catch (e) {
    addresses.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchAddresses)

function openNew() {
  editingAddress.value = null
  form.value = { name: '', phone: '', province: '', city: '', district: '', detail: '', isDefault: false }
  showForm.value = true
}

function openEdit(addr) {
  editingAddress.value = addr
  form.value = { ...addr }
  showForm.value = true
}

async function saveAddress() {
  try {
    if (editingAddress.value) {
      await addressAPI.update(editingAddress.value._id || editingAddress.value.id, form.value)
    } else {
      await addressAPI.create(form.value)
    }
    showForm.value = false
    toast.value?.show('保存成功', { type: 'success' })
    await fetchAddresses()
  } catch (e) {
    toast.value?.show('保存失败', { type: 'error' })
  }
}

async function deleteAddress(addr) {
  try {
    await addressAPI.delete(addr._id || addr.id)
    toast.value?.show('已删除', { type: 'success' })
    await fetchAddresses()
  } catch (e) {
    toast.value?.show('删除失败', { type: 'error' })
  }
}

function setDefault(addr) {
  addressAPI.update(addr._id || addr.id, { isDefault: true }).then(fetchAddresses)
}
</script>

<template>
  <div>
    <AppToast ref="toast" />

    <div v-if="loading" class="p-4 space-y-3">
      <div v-for="i in 2" :key="i" class="ios-card p-4 animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div class="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>

    <div v-else-if="addresses.length === 0" class="pt-8">
      <AppEmpty text="暂无收货地址" action-text="添加地址" @action="openNew" />
    </div>

    <div v-else class="px-4 space-y-3 mt-3 pb-24">
      <div v-for="addr in addresses" :key="addr._id || addr.id"
           class="ios-card p-4 relative">
        <div class="flex items-start gap-2">
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <span class="text-[15px] font-semibold">{{ addr.name }}</span>
              <span class="text-[13px] text-ios-text-secondary">{{ addr.phone }}</span>
              <span v-if="addr.isDefault"
                    class="text-[10px] text-ios-accent bg-ios-accent/10 px-1.5 py-0.5 rounded font-medium">
                默认
              </span>
            </div>
            <p class="text-[13px] text-ios-text-secondary mt-1 leading-relaxed">
              {{ addr.province }}{{ addr.city }}{{ addr.district }}{{ addr.detail }}
            </p>
          </div>
          <div class="flex flex-col gap-2">
            <button @click="openEdit(addr)" class="text-[13px] text-ios-accent ios-touch py-1">编辑</button>
            <button @click="deleteAddress(addr)" class="text-[13px] text-ios-destructive ios-touch py-1">删除</button>
            <button v-if="!addr.isDefault" @click="setDefault(addr)"
                    class="text-[11px] text-ios-text-secondary ios-touch py-1">设为默认</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add button -->
    <div class="fixed bottom-0 left-0 right-0 z-40 flex justify-center pb-safe-bottom pointer-events-none">
      <div class="pointer-events-auto mx-4 mb-3" style="max-width: 400px; width: calc(100% - 32px);">
        <AppButton block @click="openNew">+ 新增地址</AppButton>
      </div>
    </div>

    <!-- Address form bottom sheet -->
    <AppBottomSheet :show="showForm" :title="editingAddress ? '编辑地址' : '新增地址'" @close="showForm = false">
      <div class="space-y-3">
        <input v-model="form.name" placeholder="收货人姓名" class="w-full h-11 px-4 bg-gray-100 rounded-xl text-[15px] outline-none"/>
        <input v-model="form.phone" placeholder="手机号码" class="w-full h-11 px-4 bg-gray-100 rounded-xl text-[15px] outline-none"/>
        <div class="flex gap-2">
          <input v-model="form.province" placeholder="省" class="flex-1 h-11 px-4 bg-gray-100 rounded-xl text-[15px] outline-none"/>
          <input v-model="form.city" placeholder="市" class="flex-1 h-11 px-4 bg-gray-100 rounded-xl text-[15px] outline-none"/>
          <input v-model="form.district" placeholder="区" class="flex-1 h-11 px-4 bg-gray-100 rounded-xl text-[15px] outline-none"/>
        </div>
        <input v-model="form.detail" placeholder="详细地址" class="w-full h-11 px-4 bg-gray-100 rounded-xl text-[15px] outline-none"/>
        <label class="flex items-center gap-3 py-2">
          <input type="checkbox" v-model="form.isDefault" class="w-5 h-5 rounded accent-ios-accent"/>
          <span class="text-[14px] text-ios-text">设为默认地址</span>
        </label>
        <AppButton block @click="saveAddress">保存</AppButton>
      </div>
    </AppBottomSheet>
  </div>
</template>
