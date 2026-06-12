<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { adminAPI } from '@/api'
import AppButton from '@/components/ui/AppButton.vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppToast from '@/components/ui/AppToast.vue'

const router = useRouter()
const user = useUserStore()
const toast = ref(null)
const products = ref([])
const loading = ref(true)
const showForm = ref(false)
const editingProduct = ref(null)
const form = ref({ name: '', price: '', comparePrice: '', stock: '', description: '', images: '', categoryId: '' })

onMounted(async () => {
  if (!user.isAdmin) { router.push('/admin/login'); return }
  await fetchProducts()
})

async function fetchProducts() {
  loading.value = true
  try {
    const res = await adminAPI.products.list()
    products.value = res.data?.list || res.data || []
  } catch (e) { products.value = [] }
  finally { loading.value = false }
}

function openNew() {
  editingProduct.value = null
  form.value = { name: '', price: '', comparePrice: '', stock: '100', description: '', images: '', categoryId: '' }
  showForm.value = true
}

function openEdit(p) {
  editingProduct.value = p
  form.value = {
    name: p.name,
    price: String(p.price),
    comparePrice: String(p.comparePrice || ''),
    stock: String(p.stock || ''),
    description: p.description || '',
    images: (p.images || []).join('\n'),
    categoryId: p.categoryId || ''
  }
  showForm.value = true
}

async function saveProduct() {
  const data = {
    name: form.value.name,
    price: parseFloat(form.value.price),
    comparePrice: form.value.comparePrice ? parseFloat(form.value.comparePrice) : null,
    stock: parseInt(form.value.stock) || 0,
    description: form.value.description,
    images: form.value.images.split('\n').filter(Boolean),
    categoryId: form.value.categoryId
  }
  try {
    if (editingProduct.value) {
      await adminAPI.products.update(editingProduct.value._id || editingProduct.value.id, data)
    } else {
      await adminAPI.products.create(data)
    }
    showForm.value = false
    toast.value?.show('保存成功', { type: 'success' })
    await fetchProducts()
  } catch (e) {
    toast.value?.show('保存失败', { type: 'error' })
  }
}

async function deleteProduct(p) {
  if (!confirm('确定删除此商品？')) return
  try {
    await adminAPI.products.delete(p._id || p.id)
    toast.value?.show('已删除', { type: 'success' })
    await fetchProducts()
  } catch (e) {
    toast.value?.show('删除失败', { type: 'error' })
  }
}
</script>

<template>
  <div class="bg-ios-bg min-h-screen">
    <AppToast ref="toast" />

    <div class="p-4">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <button @click="router.push('/admin')" class="text-ios-accent ios-touch">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <h1 class="text-[22px] font-bold">商品管理</h1>
        </div>
        <AppButton size="sm" @click="openNew">+ 新增</AppButton>
      </div>

      <!-- Product list -->
      <div v-if="loading" class="space-y-3">
        <div v-for="i in 4" :key="i" class="ios-card p-4 animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div class="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>

      <div v-else class="space-y-3">
        <div v-for="p in products" :key="p._id || p.id" class="ios-card overflow-hidden">
          <div class="flex gap-3 p-3">
            <div class="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
              <img :src="p.images?.[0]" alt="" class="w-full h-full object-cover"
                   onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2264%22 height=%2264%22><rect fill=%22%23f0f0f0%22 width=%2264%22 height=%2264%22/></svg>'">
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[14px] font-medium truncate">{{ p.name }}</p>
              <p class="text-[16px] font-semibold text-ios-destructive mt-1">¥{{ p.price }}</p>
              <p class="text-[12px] text-ios-text-secondary">库存: {{ p.stock }} | 销量: {{ p.sales || 0 }}</p>
            </div>
            <div class="flex flex-col gap-1">
              <button @click="openEdit(p)" class="text-[12px] text-ios-accent ios-touch py-1">编辑</button>
              <button @click="deleteProduct(p)" class="text-[12px] text-ios-destructive ios-touch py-1">删除</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Product form modal -->
    <AppModal :show="showForm" :title="editingProduct ? '编辑商品' : '新增商品'" @close="showForm = false">
      <div class="space-y-3">
        <input v-model="form.name" placeholder="商品名称" class="w-full h-11 px-4 bg-gray-50 rounded-xl text-[15px] outline-none"/>
        <div class="flex gap-2">
          <input v-model="form.price" placeholder="价格" type="number" class="flex-1 h-11 px-4 bg-gray-50 rounded-xl text-[15px] outline-none"/>
          <input v-model="form.comparePrice" placeholder="原价" type="number" class="flex-1 h-11 px-4 bg-gray-50 rounded-xl text-[15px] outline-none"/>
          <input v-model="form.stock" placeholder="库存" type="number" class="flex-1 h-11 px-4 bg-gray-50 rounded-xl text-[15px] outline-none"/>
        </div>
        <textarea v-model="form.description" placeholder="商品描述" rows="3"
                  class="w-full px-4 py-3 bg-gray-50 rounded-xl text-[15px] outline-none resize-none"/>
        <textarea v-model="form.images" placeholder="图片链接（每行一张）" rows="2"
                  class="w-full px-4 py-3 bg-gray-50 rounded-xl text-[15px] outline-none resize-none"/>
        <AppButton block @click="saveProduct">保存</AppButton>
      </div>
    </AppModal>
  </div>
</template>
