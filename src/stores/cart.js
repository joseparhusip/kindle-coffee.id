import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

// Key localStorage. Ganti nilai ini kalau suatu saat mau "invalidate"
// keranjang/riwayat lama milik user (misal setelah ubah struktur data produk).
const CART_STORAGE_KEY = 'kindle-coffee-cart'
const HISTORY_STORAGE_KEY = 'kindle-coffee-orders'

const TAX_RATE = 0.11 // PPN 11% (tarif umum 2026, non-barang mewah)

// Batas waktu order "pending" (sudah dapat token Midtrans, popup sudah/sedang
// dibuka) boleh dilanjutkan lagi lewat tombol "Bayar Lagi" di riwayat.
// Setelah ini lewat, order otomatis dianggap hangus (expired).
const PENDING_PAYMENT_DURATION_MS = 60 * 1000 // 1 menit

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

  // --- Pending order (dipanggil SEBELUM window.snap.pay() dibuka) ---
  //
  // Kenapa dipisah dari checkout(): kalau kita baru mencatat riwayat di
  // callback onSuccess/onPending Midtrans, dan device user mati / app
  // ke-force-close TEPAT setelah popup Snap kebuka, callback itu tidak
  // akan pernah terpanggil — order jadi hilang begitu saja padahal token
  // pembayarannya sudah valid.
  //
  // Solusinya: catat order dengan status 'pending' ke riwayat SEGERA
  // setelah token didapat, sebelum snap.pay() dipanggil. Keranjang belum
  // dikosongkan di titik ini (baru dikosongkan kalau pembayaran benar-benar
  // sukses lewat markOrderPaid). Order pending ini punya batas waktu
  // PENDING_PAYMENT_DURATION_MS untuk dilanjutkan lewat tombol "Bayar Lagi".
  function createPendingOrder(orderId, snapToken) {
    if (items.value.length === 0) return null

    const subtotal = totalPrice.value
    const tax = Math.round(subtotal * TAX_RATE)
    const now = Date.now()

    const order = {
      id: orderId,
      date: new Date(now).toISOString(),
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
      // 'pending' -> 'paid' (sukses) | 'failed' (onError) | 'expired' (lewat 1 menit)
      status: 'pending',
      snapToken,
      expiresAt: now + PENDING_PAYMENT_DURATION_MS,
    }

    orderHistory.value = [order, ...orderHistory.value]
    return order
  }

  function findOrder(orderId) {
    return orderHistory.value.find((order) => order.id === orderId) || null
  }

  // Dipanggil saat pembayaran sukses/pending (VA dsb) — baik dari checkout
  // pertama kali maupun dari "Bayar Lagi" di riwayat.
  function markOrderPaid(orderId) {
    const order = findOrder(orderId)
    if (!order) return
    order.status = 'paid'
    order.snapToken = null
    order.expiresAt = null
    clearCart()
  }

  // Dipanggil saat Midtrans eksplisit melaporkan pembayaran gagal (onError).
  // Token biasanya sudah tidak bisa dipakai lagi, jadi tidak bisa "Bayar Lagi".
  function markOrderFailed(orderId) {
    const order = findOrder(orderId)
    if (!order) return
    order.status = 'failed'
    order.snapToken = null
    order.expiresAt = null
  }

  // Cek semua order pending, tandai 'expired' kalau sudah lewat batas
  // waktunya. Dipanggil berkala (setInterval) dari HistoryView supaya
  // status "hangus"-nya permanen tersimpan (bukan cuma dihitung di layar),
  // dan tetap konsisten walau halaman di-refresh setelah waktunya habis.
  function expireStalePendingOrders() {
    const now = Date.now()
    orderHistory.value.forEach((order) => {
      if (order.status === 'pending' && order.expiresAt && now > order.expiresAt) {
        order.status = 'expired'
        order.snapToken = null
      }
    })
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
    createPendingOrder,
    markOrderPaid,
    markOrderFailed,
    expireStalePendingOrders,
    clearHistory,
  }
})
