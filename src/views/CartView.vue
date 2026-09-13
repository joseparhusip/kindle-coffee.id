<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { formatRupiah } from '@/data/products'

const cart = useCartStore()
const orderPlaced = ref(false)
const isCheckingOut = ref(false)
const errorMessage = ref('')

const TAX_RATE = 0.11 // PPN 11% (tarif umum 2026, non-barang mewah)

const taxAmount = computed(() => Math.round(cart.totalPrice * TAX_RATE))
const grandTotal = computed(() => cart.totalPrice + taxAmount.value)

// --- Checkout via Midtrans Snap ---
async function handleCheckout() {
  if (cart.items.length === 0 || isCheckingOut.value) return

  isCheckingOut.value = true
  errorMessage.value = ''

  try {
    const orderId = `ORDER-${Date.now()}`

    // Tiap baris keranjang jadi satu item_details. PPN ditambahkan sebagai
    // baris tersendiri supaya total item_details == gross_amount, yang
    // disyaratkan Midtrans untuk beberapa metode pembayaran.
    const itemDetails = cart.items.map((item) => ({
      id: item.lineId,
      price: item.price,
      quantity: item.qty,
      name: (item.size ? `${item.name} (${item.size})` : item.name).substring(0, 50),
    }))

    itemDetails.push({
      id: 'PPN',
      price: taxAmount.value,
      quantity: 1,
      name: 'PPN (11%)',
    })

    const payload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grandTotal.value,
      },
      item_details: itemDetails,
    }

    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!data.token) {
      console.error('Gagal dapat token Midtrans:', data)
      errorMessage.value = 'Gagal memproses checkout. Silakan coba lagi.'
      isCheckingOut.value = false
      return
    }

    window.snap.pay(data.token, {
      onSuccess(result) {
        console.log('Pembayaran berhasil:', result)
        // Baru catat ke riwayat & kosongkan keranjang setelah bayar sukses.
        cart.checkout()
        orderPlaced.value = true
        isCheckingOut.value = false
      },
      onPending(result) {
        console.log('Pembayaran pending:', result)
        // Tetap dianggap "dipesan" — misal transfer VA yang belum dibayar.
        cart.checkout()
        orderPlaced.value = true
        isCheckingOut.value = false
      },
      onError(result) {
        console.error('Pembayaran gagal:', result)
        errorMessage.value = 'Pembayaran gagal diproses. Keranjangmu masih aman, coba lagi ya.'
        isCheckingOut.value = false
      },
      onClose() {
        // Popup ditutup tanpa menyelesaikan pembayaran — keranjang dibiarkan utuh.
        isCheckingOut.value = false
      },
    })
  } catch (error) {
    console.error('Error saat checkout:', error)
    errorMessage.value = 'Terjadi kesalahan sistem saat checkout. Coba lagi sebentar lagi.'
    isCheckingOut.value = false
  }
}
</script>

<template>
  <div class="cart-page container">
    <div class="cart-head">
      <span class="eyebrow">Keranjang</span>
      <h1>Pesananmu</h1>
    </div>

    <div v-if="orderPlaced" class="state">
      <svg class="state__icon" width="52" height="52" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="var(--color-brown-dark)" stroke-width="1.4"/>
        <path d="M8 12.5L10.8 15L16 9.5" stroke="var(--color-brown-dark)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <h2>Pesanan diterima</h2>
      <p>Terima kasih! Pesananmu sedang disiapkan oleh barista kami.</p>
      <div class="state__actions">
        <RouterLink to="/menu" class="btn btn--primary">Pesan Lagi</RouterLink>
        <RouterLink to="/history" class="btn btn--ghost">Lihat Riwayat Pesanan</RouterLink>
      </div>
    </div>

    <div v-else-if="cart.items.length === 0" class="state">
      <svg class="state__icon" width="52" height="52" viewBox="0 0 24 24" fill="none">
        <path d="M3 4H5L5.6 7M5.6 7L7 15H18L20 7H5.6Z" stroke="var(--color-brown-dark)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="9" cy="19.5" r="1.3" fill="var(--color-brown-dark)"/>
        <circle cx="17" cy="19.5" r="1.3" fill="var(--color-brown-dark)"/>
      </svg>
      <h2>Keranjangmu masih kosong</h2>
      <p>Yuk pilih racikan favoritmu dari menu kami.</p>
      <RouterLink to="/menu" class="btn btn--primary">Lihat Menu</RouterLink>
    </div>

    <div v-else class="cart-layout">
      <ul class="cart-list cart-list__scroll">
        <li v-for="item in cart.items" :key="item.lineId" class="cart-item">
          <div class="cart-item__photo">
            <img :src="item.image" :alt="item.name" loading="lazy" />
          </div>

          <div class="cart-item__info">
            <h3>{{ item.name }}</h3>
            <div class="cart-item__tags">
              <span v-if="item.size" class="cart-item__size">{{ item.size }}</span>
              <span v-if="item.note" class="cart-item__note">&ldquo;{{ item.note }}&rdquo;</span>
            </div>
            <span class="cart-item__unit">{{ formatRupiah(item.price) }} / porsi</span>
          </div>

          <div class="cart-item__qty">
            <button aria-label="Kurangi jumlah" @click="cart.decrement(item.lineId)">&minus;</button>
            <span>{{ item.qty }}</span>
            <button aria-label="Tambah jumlah" @click="cart.increment(item.lineId)">+</button>
          </div>

          <div class="cart-item__subtotal">{{ formatRupiah(item.price * item.qty) }}</div>

          <button class="cart-item__remove" aria-label="Hapus item" @click="cart.removeFromCart(item.lineId)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M5 5L19 19M19 5L5 19" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
            </svg>
          </button>
        </li>
      </ul>

      <aside class="summary">
        <h3>Ringkasan</h3>
        <div class="summary__row">
          <span>Jumlah item</span>
          <span>{{ cart.totalItems }}</span>
        </div>
        <div class="summary__row">
          <span>Subtotal</span>
          <span>{{ formatRupiah(cart.totalPrice) }}</span>
        </div>
        <div class="summary__row">
          <span>PPN (11%)</span>
          <span>{{ formatRupiah(taxAmount) }}</span>
        </div>
        <div class="summary__row summary__row--total">
          <span>Total</span>
          <span>{{ formatRupiah(grandTotal) }}</span>
        </div>

        <p v-if="errorMessage" class="summary__error">{{ errorMessage }}</p>

        <button class="btn btn--primary btn--block" :disabled="isCheckingOut" @click="handleCheckout">
          <span v-if="isCheckingOut">Memproses...</span>
          <span v-else>Checkout Sekarang</span>
        </button>
        <RouterLink to="/menu" class="continue-link">Tambah menu lain</RouterLink>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.eyebrow {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-brown);
  margin-bottom: 10px;
}

.eyebrow::before {
  content: '';
  width: 16px;
  height: 1px;
  background: var(--color-brown);
}

.cart-page {
  padding: 32px 28px 100px;
  min-height: 50vh;
}

.cart-head h1 {
  font-size: clamp(28px, 3.6vw, 38px);
  margin-bottom: 36px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 26px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 15px;
  text-decoration: none;
  border: none;
  transition: background-color 0.2s;
}

.btn--primary {
  background: var(--color-brown-dark);
  color: var(--color-white);
}
.btn--primary:hover {
  background: var(--color-brown);
}

.btn--primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn--ghost {
  background: transparent;
  color: var(--color-brown-darkest);
  border: 1.5px solid var(--color-border);
}
.btn--ghost:hover {
  border-color: var(--color-brown-dark);
}

.btn--block {
  width: 100%;
  margin-top: 8px;
}

.state {
  text-align: center;
  padding: 72px 20px;
  border: 1px solid var(--color-border);
  border-radius: 18px;
}

.state__icon {
  margin-bottom: 20px;
}

.state h2 {
  font-size: 20px;
  margin-bottom: 8px;
}

.state p {
  color: var(--color-text-soft);
  margin-bottom: 26px;
  font-size: 14.5px;
}

.state__actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.cart-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 32px;
  align-items: flex-start;
}

.cart-list {
  list-style: none;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  overflow: hidden;
  background: var(--color-white);
}

.cart-list__scroll {
  /* Around 5 rows before it scrolls instead of pushing the page down. */
  max-height: 560px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--color-brown-light) transparent;
}

.cart-list__scroll::-webkit-scrollbar {
  width: 8px;
}

.cart-list__scroll::-webkit-scrollbar-thumb {
  background-color: var(--color-brown-light);
  border-radius: 999px;
}

.cart-list__scroll::-webkit-scrollbar-track {
  background: transparent;
}

.cart-item {
  display: grid;
  grid-template-columns: 72px 1fr auto auto 28px;
  align-items: center;
  gap: 18px;
  padding: 18px 20px;
  border-bottom: 1px solid var(--color-border);
  transition: background-color 0.2s ease;
}

.cart-item:hover {
  background: var(--color-cream);
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item__photo {
  width: 72px;
  height: 72px;
  border-radius: 12px;
  overflow: hidden;
  background: var(--color-cream);
  border: 1px solid var(--color-border);
  flex-shrink: 0;
}

.cart-item__photo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 6px;
  display: block;
}

.cart-item__info h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.cart-item__tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.cart-item__size {
  display: inline-flex;
  padding: 2px 9px;
  border-radius: 999px;
  background: var(--color-cream);
  border: 1px solid var(--color-border);
  color: var(--color-brown-dark);
  font-size: 11.5px;
  font-weight: 700;
}

.cart-item__note {
  font-size: 12.5px;
  font-style: italic;
  color: var(--color-text-soft);
}

.cart-item__unit {
  font-size: 13px;
  color: var(--color-text-soft);
}

.cart-item__qty {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  padding: 6px 12px;
}

.cart-item__qty button {
  background: none;
  border: none;
  font-size: 15px;
  width: 16px;
  color: var(--color-brown-dark);
  font-weight: 700;
}

.cart-item__subtotal {
  font-family: var(--font-heading);
  font-weight: 600;
  color: var(--color-brown-darkest);
  white-space: nowrap;
}

.cart-item__remove {
  background: none;
  border: none;
  color: var(--color-text-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}
.cart-item__remove:hover {
  color: var(--color-brown);
}

.summary {
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 26px;
  position: sticky;
  top: 96px;
  background: var(--color-white);
  box-shadow: 0 14px 34px rgba(46, 22, 15, 0.06);
}

.summary h3 {
  font-size: 17px;
  margin-bottom: 18px;
}

.summary__row {
  display: flex;
  justify-content: space-between;
  font-size: 14.5px;
  color: var(--color-text-soft);
  margin-bottom: 12px;
}

.summary__row--total {
  font-family: var(--font-heading);
  font-weight: 600;
  color: var(--color-brown-darkest);
  font-size: 18px;
  border-top: 1px solid var(--color-border);
  padding-top: 14px;
  margin-top: 6px;
}

.summary__error {
  font-size: 13px;
  color: #c0392b;
  background: rgba(192, 57, 43, 0.08);
  border: 1px solid rgba(192, 57, 43, 0.25);
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 12px;
}

.continue-link {
  display: block;
  text-align: center;
  margin-top: 14px;
  font-size: 13.5px;
  color: var(--color-brown-dark);
  text-decoration: none;
  font-weight: 600;
}

.continue-link:hover {
  text-decoration: underline;
}

@media (max-width: 780px) {
  .cart-page {
    padding: 20px 20px 80px;
  }
  .cart-layout {
    grid-template-columns: 1fr;
  }
  .cart-item {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
  }
  .cart-item__photo {
    width: 56px;
    height: 56px;
  }
  .cart-item__info {
    flex: 1;
    min-width: 120px;
  }
  .cart-item__qty {
    order: 3;
  }
  .cart-item__subtotal {
    order: 4;
    margin-left: auto;
  }
  .cart-item__remove {
    order: 2;
  }
}
</style>
