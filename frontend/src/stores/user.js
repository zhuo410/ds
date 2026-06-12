import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authAPI } from '@/api'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const isAdmin = ref(localStorage.getItem('isAdmin') === 'true')

  const isLoggedIn = computed(() => !!token.value)

  function setUser(data) {
    token.value = data.token
    userInfo.value = data.user
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
  }

  function setAdmin(token) {
    isAdmin.value = true
    localStorage.setItem('isAdmin', 'true')
    localStorage.setItem('token', token)
  }

  function logout() {
    token.value = ''
    userInfo.value = null
    isAdmin.value = false
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('isAdmin')
  }

  async function loginWithWechat(code) {
    const res = await authAPI.wechatLogin(code)
    setUser(res.data)
    return res.data
  }

  async function loginAsAdmin(username, password) {
    const res = await authAPI.adminLogin(username, password)
    setAdmin(res.data.token)
    return res.data
  }

  return {
    token, userInfo, isAdmin, isLoggedIn,
    setUser, setAdmin, logout, loginWithWechat, loginAsAdmin
  }
})
