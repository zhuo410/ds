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
const categories = ref([])
const loading = ref(true)
const showForm = ref(false)
const editingCat = ref(null)
const form = ref({ name: '', icon: '', sortOrder: 0 })

onMounted(async () => {
  if (!user.isAdmin) { router.push('/admin/login'); return }
  await fetchCategories()
})

async function fetchCategories() {
  loading.value = true
  try {
    const res = await adminAPI.categories.list()
    categories.value = res.data || []
  } catch (e) { categories.value = [] }
  finally { loading.value = false }
}

function openNew() {
  editingCat.value = null
  form.value = { name: '', icon: '📦', sortOrder: 0 }
  showForm.value = true
}

function openEdit(c) {
  editingCat.value = c
  form.value = { name: c.name, icon: c.icon || '📦', sortOrder: c.sortOrder || 0 }
  showForm.value = true
}

async function saveCategory() {
  try {
    if (editingCat.value) {
      await adminAPI.categories.update(editingCat.value._id || editingCat.value.id, form.value)
    } else {
      await adminAPI.categories.create(form.value)
    }
    showForm.value = false
    toast.value?.show('保存成功', { type: 'success' })
    await fetchCategories()
  } catch (e) {
    toast.value?.show('保存失败', { type: 'error' })
  }
}

async function deleteCategory(c) {
  if (!confirm('确定删除此分类？')) return
  try {
    await adminAPI.categories.delete(c._id || c.id)
    toast.value?.show('已删除', { type: 'success' })
    await fetchCategories()
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
          <h1 class="text-[22px] font-bold">分类管理</h1>
        </div>
        <AppButton size="sm" @click="openNew">+ 新增</AppButton>
      </div>

      <div v-if="loading" class="space-y-3">
        <div v-for="i in 3" :key="i" class="ios-card p-4 animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>

      <div v-else class="space-y-3">
        <div v-for="c in categories" :key="c._id || c.id" class="ios-card overflow-hidden">
          <div class="flex items-center justify-between px-4 py-3">
            <div class="flex items-center gap-3">
              <span class="text-[24px]">{{ c.icon || '📦' }}</span>
              <div>
                <p class="text-[15px] font-medium">{{ c.name }}</p>
                <p class="text-[12px] text-ios-text-secondary">排序: {{ c.sortOrder || 0 }}</p>
              </div>
            </div>
            <div class="flex gap-2">
              <button @click="openEdit(c)" class="text-[13px] text-ios-accent ios-touch">编辑</button>
              <button @click="deleteCategory(c)" class="text-[13px] text-ios-destructive ios-touch">删除</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <AppModal :show="showForm" :title="editingCat ? '编辑分类' : '新增分类'" @close="showForm = false">
      <div class="space-y-3">
        <input v-model="form.name" placeholder="分类名称" class="w-full h-11 px-4 bg-gray-50 rounded-xl text-[15px] outline-none"/>
        <input v-model="form.icon" placeholder="图标 emoji" class="w-full h-11 px-4 bg-gray-50 rounded-xl text-[15px] outline-none"/>
        <input v-model.number="form.sortOrder" placeholder="排序 (数字越小越靠前)" type="number"
               class="w-full h-11 px-4 bg-gray-50 rounded-xl text-[15px] outline-none"/>
        <AppButton block @click="saveCategory">保存</AppButton>
      </div>
    </AppModal>
  </div>
</template>
