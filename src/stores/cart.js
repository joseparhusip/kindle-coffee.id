import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

// Key localStorage. Ganti nilai ini kalau suatu saat mau "invalidate"
// keranjang/riwayat lama milik user (misal setelah ubah struktur data produk).
const CART_STORAGE_KEY = 'kindle-coffee-cart'
const HISTORY_STORAGE_KEY = 'kindle-coffee-orders'

const TAX_RATE = 0.11 // PPN 11% (tarif umum 2026, non-barang mewah)

// Two cart lines are "the same" only if product, size, AND note all match.
// That lets someone order e.g. a Latte Large "less sugar" as a separate
// line from a Latte Medium with no note.
function makeLineId(product) {
  const size = product.size || 'default'
  const note = (product.note || '').trim().toLowerCase()
  return `${product.id}::${size}::${note}`
}

// --- Helper baca/tulis localStorage, dibungkus try/catch supaya kalau
// localStorage gagal (mode private penuh, data corrupt, dll) app tidak crash.
function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : fallback
  } catch (err) {
    console.warn(`Gagal membaca ${key} dari localStorage:`, err)
    return fallback
  }
}

function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.warn(`Gagal menyimpan ${key} ke localStorage:`, err)
  }
}

export const useCartStore = defineStore('cart', () => {
  // items: [{ id, name, price, icon, size, note, lineId, qty }]
  // Diisi dari localStorage kalau ada, supaya keranjang tidak hilang saat refresh.
  const items = ref(loadJSON(CART_STORAGE_KEY, []))

  // orderHistory: [{ id, date, items, totalItems, subtotal, tax, total }]
  // Pesanan terbaru ada di index 0.
  const orderHistory = ref(loadJSON(HISTORY_STORAGE_KEY, []))

  // Setiap kali isi keranjang berubah (tambah, kurang, hapus, dsb),
  // otomatis simpan ulang ke localStorage. deep:true karena qty di dalam
  // tiap objek item juga perlu dipantau, bukan cuma panjang array-nya.
  watch(
    items,
    (newItems) => {
      saveJSON(CART_STORAGE_KEY, newItems)
    },
    { deep: true },
  )

  watch(
    orderHistory,
    (newHistory) => {
      saveJSON(HISTORY_STORAGE_KEY, newHistory)
    },
    { deep: true },
  )

  function addToCart(product) {
    const lineId = makeLineId(product)
    const existing = items.value.find((item) => item.lineId === lineId)
    if (existing) {
      existing.qty++
    } else {
      items.value.push({ ...product, lineId, qty: 1 })
    }
  }

  function increment(lineId) {
    const item = items.value.find((item) => item.lineId === lineId)
    if (item) item.qty++
  }

  function decrement(lineId) {
    const item = items.value.find((item) => item.lineId === lineId)
    if (!item) return
    if (item.qty <= 1) {
      removeFromCart(lineId)
    } else {
      item.qty--
    }
  }

  function removeFromCart(lineId) {
    items.value = items.value.filter((item) => item.lineId !== lineId)
  }

  function clearCart() {
    items.value = []
  }

  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + item.qty, 0),
  )

  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.qty * item.price, 0),
  )

  // Kunci keranjang jadi satu pesanan di riwayat, lalu kosongkan keranjang.
  // Mengembalikan pesanan yang baru dibuat kalau halaman butuh menampilkannya.
  function checkout() {
    if (items.value.length === 0) return null

    const subtotal = totalPrice.value
    const tax = Math.round(subtotal * TAX_RATE)

    const order = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      items: items.value.map((item) => ({
        id: item.id,
        name: item.name,
        image: item.image,
        size: item.size,
        note: item.note,
        price: item.price,
        qty: item.qty,
      })),
      totalItems: totalItems.value,
      subtotal,
      tax,
      total: subtotal + tax,
    }

    orderHistory.value = [order, ...orderHistory.value]
    clearCart()

    return order
  }

  function clearHistory() {
    orderHistory.value = []
  }

  return {
    items,
    addToCart,
    increment,
    decrement,
    removeFromCart,
    clearCart,
    totalItems,
    totalPrice,
    orderHistory,
    checkout,
    clearHistory,
  }
})
