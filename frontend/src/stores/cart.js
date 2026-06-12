import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cartAPI } from '@/api'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const loading = ref(false)

  const count = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))
  const totalPrice = computed(() => items.value.reduce((sum, item) => sum + item.price * item.quantity, 0))
  const selectedItems = computed(() => items.value.filter(item => item.selected !== false))

  async function fetchCart() {
    loading.value = true
    try {
      const res = await cartAPI.get()
      items.value = res.data || []
    } catch (e) {
      items.value = []
    } finally {
      loading.value = false
    }
  }

  async function addItem(product) {
    try {
      const res = await cartAPI.add({
        productId: product.id || product._id,
        name: product.name,
        image: product.images?.[0] || product.image,
        price: product.price,
        spec: product.spec || '',
        quantity: product.quantity || 1
      })
      await fetchCart()
      return res
    } catch (e) {
      throw e
    }
  }

  async function updateQuantity(itemId, quantity) {
    try {
      await cartAPI.update(itemId, { quantity })
      const item = items.value.find(i => i._id === itemId || i.id === itemId)
      if (item) item.quantity = quantity
    } catch (e) {
      throw e
    }
  }

  async function removeItem(itemId) {
    try {
      await cartAPI.remove(itemId)
      items.value = items.value.filter(i => (i._id || i.id) !== itemId)
    } catch (e) {
      throw e
    }
  }

  function clearCart() {
    items.value = []
  }

  return {
    items, loading, count, totalPrice, selectedItems,
    fetchCart, addItem, updateQuantity, removeItem, clearCart
  }
})
