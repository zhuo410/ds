<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import AppButton from '@/components/ui/AppButton.vue'
import AppToast from '@/components/ui/AppToast.vue'

const router = useRouter()
const user = useUserStore()
const toast = ref(null)
const username = ref('')
const password = ref('')
const loading = ref(false)

async function handleLogin() {
  if (!username.value || !password.value) {
    toast.value?.show('请输入账号和密码', { type: 'error' })
    return
  }
  loading.value = true
  try {
    await user.loginAsAdmin(username.value, password.value)
    toast.value?.show('登录成功', { type: 'success' })
    setTimeout(() => router.push('/admin'), 500)
  } catch (e) {
    toast.value?.show('账号或密码错误', { type: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-6 bg-ios-bg">
    <AppToast ref="toast" />
    <div class="w-full max-w-sm ios-card p-8">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-ios-accent rounded-[18px] flex items-center justify-center mx-auto mb-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5">
            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
        </div>
        <h1 class="text-[22px] font-bold">管理后台</h1>
        <p class="text-[14px] text-ios-text-secondary mt-1">请登录以管理商城</p>
      </div>

      <div class="space-y-4">
        <input v-model="username" type="text" placeholder="管理员账号"
               class="w-full h-12 px-4 bg-gray-50 rounded-xl text-[16px] outline-none border border-gray-200 focus:border-ios-accent transition-colors"/>
        <input v-model="password" type="password" placeholder="密码"
               class="w-full h-12 px-4 bg-gray-50 rounded-xl text-[16px] outline-none border border-gray-200 focus:border-ios-accent transition-colors"
               @keydown.enter="handleLogin"/>
        <AppButton block :loading="loading" @click="handleLogin">登录</AppButton>
      </div>
    </div>
  </div>
</template>
