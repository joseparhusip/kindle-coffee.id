<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { jsPDF } from 'jspdf'
import { useCartStore } from '@/stores/cart'
import { formatRupiah } from '@/data/products'
import logoUtama from '@/components/icons/logo-utama.png'

const cart = useCartStore()

// Filter tanggal: kosong berarti tidak dibatasi ke arah itu.
const startDate = ref('')
const endDate = ref('')

function formatDate(isoString) {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(isoString))
}

const filteredOrders = computed(() => {
  return cart.orderHistory.filter((order) => {
    const orderDay = order.date.slice(0, 10) // 'YYYY-MM-DD', bandingkan per hari

    if (startDate.value && orderDay < startDate.value) return false
    if (endDate.value && orderDay > endDate.value) return false

    return true
  })
})

const hasActiveFilter = computed(() => Boolean(startDate.value || endDate.value))

function resetFilter() {
  startDate.value = ''
  endDate.value = ''
}

// --- Modal konfirmasi hapus riwayat (pengganti confirm() bawaan browser) ---
const showClearConfirm = ref(false)

function handleClearHistory() {
  showClearConfirm.value = true
}

function confirmClearHistory() {
  cart.clearHistory()
  showClearConfirm.value = false
}

function cancelClearHistory() {
  showClearConfirm.value = false
}

// --- Export struk PDF (gaya struk kasir, bukan A4) ---

// Load logo jadi <img> element dulu supaya kita tahu rasio asli gambarnya
// (biar logo gak gepeng/melar), baru digambar ke canvas untuk diubah jadi
// base64 data URL — format yang dibutuhkan jsPDF.addImage.
function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}

function imageToDataURL(img) {
  const canvas = document.createElement('canvas')
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight
  canvas.getContext('2d').drawImage(img, 0, 0)
  return canvas.toDataURL('image/png')
}

async function downloadReceipt(order) {
  const receiptWidth = 226 // ~80mm, lebar umum kertas struk thermal
  const marginX = 16
  const contentWidth = receiptWidth - marginX * 2
  const centerX = receiptWidth / 2
  const lineHeight = 12

  // Tinggi halaman dihitung dulu dari jumlah baris konten, supaya PDF
  // pas sesuai panjang struk (gak nyisa halaman kosong kayak kertas A4).
  let estimatedHeight = 200 // logo + nama toko + info pesanan + spacing
  order.items.forEach((item) => {
    estimatedHeight += lineHeight * 2
    if (item.note) estimatedHeight += lineHeight
  })
  estimatedHeight += 90 // total + footer

  const doc = new jsPDF({ unit: 'pt', format: [receiptWidth, estimatedHeight] })
  let y = 18

  try {
    const logoImg = await loadImage(logoUtama)
    const logoDataUrl = imageToDataURL(logoImg)
    const logoWidth = 46
    const logoHeight = logoWidth * (logoImg.naturalHeight / logoImg.naturalWidth)
    doc.addImage(logoDataUrl, 'PNG', centerX - logoWidth / 2, y, logoWidth, logoHeight)
    y += logoHeight + 10
  } catch (err) {
    console.warn('Gagal memuat logo untuk struk:', err)
  }

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('Kindle Coffee', centerX, y, { align: 'center' })
  y += 12
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.text('Sarijadi, Kota Bandung', centerX, y, { align: 'center' })
  y += 14

  doc.setDrawColor(180)
  doc.line(marginX, y, receiptWidth - marginX, y)
  y += 14

  doc.setFontSize(8)
  doc.setTextColor(0)
  doc.text(`No. Pesanan: ${order.id}`, marginX, y)
  y += 11
  doc.text(`Tanggal: ${formatDate(order.date)}`, marginX, y, { maxWidth: contentWidth })
  y += 14

  doc.line(marginX, y, receiptWidth - marginX, y)
  y += 14

  order.items.forEach((item) => {
    const label = item.size ? `${item.name} (${item.size})` : item.name
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.text(label, marginX, y, { maxWidth: contentWidth })
    y += 11

    doc.setFont('helvetica', 'normal')
    doc.text(`${item.qty} x ${formatRupiah(item.price)}`, marginX, y)
    doc.text(formatRupiah(item.price * item.qty), receiptWidth - marginX, y, { align: 'right' })
    y += 11

    if (item.note) {
      doc.setFontSize(7)
      doc.setTextColor(130)
      doc.text(`Catatan: ${item.note}`, marginX, y, { maxWidth: contentWidth })
      doc.setTextColor(0)
      y += 11
    }

    y += 3
  })

  doc.line(marginX, y, receiptWidth - marginX, y)
  y += 13

  doc.setFontSize(8)
  const rows = [
    ['Subtotal', order.subtotal],
    ['PPN (11%)', order.tax],
  ]
  rows.forEach(([label, value]) => {
    doc.text(label, marginX, y)
    doc.text(formatRupiah(value), receiptWidth - marginX, y, { align: 'right' })
    y += 11
  })

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9.5)
  doc.text('Total', marginX, y)
  doc.text(formatRupiah(order.total), receiptWidth - marginX, y, { align: 'right' })
  y += 20

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(6.5)
  doc.setTextColor(140)
  doc.text('Terima kasih sudah memesan di Kindle Coffee.', centerX, y, {
    align: 'center',
    maxWidth: contentWidth,
  })

  doc.save(`struk-${order.id}.pdf`)
}
</script>

<template>
  <div class="history-page container">
    <div class="history-head">
      <div>
        <span class="eyebrow">Riwayat</span>
        <h1>Riwayat Pesanan</h1>
      </div>
      <button v-if="cart.orderHistory.length > 0" class="btn btn--ghost" @click="handleClearHistory">
        Hapus Riwayat
      </button>
    </div>

    <div v-if="cart.orderHistory.length > 0" class="filter-bar">
      <div class="filter-field">
        <label for="startDate">Dari tanggal</label>
        <input id="startDate" type="date" v-model="startDate" />
      </div>
      <div class="filter-field">
        <label for="endDate">Sampai tanggal</label>
        <input id="endDate" type="date" v-model="endDate" />
      </div>
      <button v-if="hasActiveFilter" class="filter-reset" @click="resetFilter">Reset filter</button>
    </div>

    <div v-if="cart.orderHistory.length === 0" class="state">
      <svg class="state__icon" width="52" height="52" viewBox="0 0 24 24" fill="none">
        <path d="M12 8V12.5L15 15" stroke="var(--color-brown-dark)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="12" cy="12" r="9" stroke="var(--color-brown-dark)" stroke-width="1.4"/>
      </svg>
      <h2>Belum ada riwayat pesanan</h2>
      <p>Pesanan yang sudah kamu checkout bakal muncul di sini.</p>
      <RouterLink to="/menu" class="btn btn--primary">Lihat Menu</RouterLink>
    </div>

    <div v-else-if="filteredOrders.length === 0" class="state">
      <h2>Tidak ada pesanan di rentang tanggal ini</h2>
      <p>Coba ubah atau reset filter tanggalnya.</p>
      <button class="btn btn--primary" @click="resetFilter">Reset Filter</button>
    </div>

    <ul v-else class="order-list">
      <li v-for="order in filteredOrders" :key="order.id" class="order-card">
        <div class="order-card__head">
          <div>
            <span class="order-card__id">{{ order.id }}</span>
            <span class="order-card__date">{{ formatDate(order.date) }}</span>
          </div>
          <div class="order-card__head-right">
            <span class="order-card__total">{{ formatRupiah(order.total) }}</span>
            <button class="order-card__pdf" @click="downloadReceipt(order)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 3V15M12 15L8 11M12 15L16 11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4 17V19C4 20.1 4.9 21 6 21H18C19.1 21 20 20.1 20 19V17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
              </svg>
              Unduh Struk
            </button>
          </div>
        </div>

        <ul class="order-card__items">
          <li v-for="(item, idx) in order.items" :key="idx" class="order-item">
            <div class="order-item__photo">
              <img :src="item.image" :alt="item.name" loading="lazy" />
            </div>
            <div class="order-item__info">
              <span class="order-item__name">{{ item.name }}</span>
              <div class="order-item__tags">
                <span v-if="item.size" class="order-item__size">{{ item.size }}</span>
                <span v-if="item.note" class="order-item__note">&ldquo;{{ item.note }}&rdquo;</span>
              </div>
            </div>
            <span class="order-item__qty">&times;{{ item.qty }}</span>
            <span class="order-item__subtotal">{{ formatRupiah(item.price * item.qty) }}</span>
          </li>
        </ul>

        <div class="order-card__foot">
          <div class="order-card__row">
            <span>Subtotal</span>
            <span>{{ formatRupiah(order.subtotal) }}</span>
          </div>
          <div class="order-card__row">
            <span>PPN (11%)</span>
            <span>{{ formatRupiah(order.tax) }}</span>
          </div>
          <div class="order-card__row order-card__row--total">
            <span>Total</span>
            <span>{{ formatRupiah(order.total) }}</span>
          </div>
        </div>
      </li>
    </ul>

    <!-- Modal konfirmasi hapus riwayat -->
    <Transition name="modal-fade">
      <div
        v-if="showClearConfirm"
        class="modal-overlay"
        @click.self="cancelClearHistory"
      >
        <div class="modal-card" role="alertdialog" aria-modal="true" aria-labelledby="clearHistoryTitle">
          <div class="modal-card__icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M4 7H20" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
              <path d="M9 7V5C9 4.4 9.4 4 10 4H14C14.6 4 15 4.4 15 5V7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M6 7L6.8 19C6.9 19.7 7.5 20.2 8.2 20.2H15.8C16.5 20.2 17.1 19.7 17.2 19L18 7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M10 11V16M14 11V16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
            </svg>
          </div>
          <h2 id="clearHistoryTitle">Hapus semua riwayat?</h2>
          <p>Semua data pesanan yang pernah kamu checkout akan hilang permanen dan tidak bisa dikembalikan.</p>
          <div class="modal-card__actions">
            <button class="btn btn--ghost" @click="cancelClearHistory">Batal</button>
            <button class="btn btn--danger" @click="confirmClearHistory">Ya, Hapus</button>
          </div>
        </div>
      </div>
    </Transition>
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

.history-page {
  padding: 32px 28px 100px;
  min-height: 50vh;
}

.history-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.history-head h1 {
  font-size: clamp(28px, 3.6vw, 38px);
}

.filter-bar {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  flex-wrap: wrap;
  padding: 18px 20px;
  border: 1px solid var(--color-border);
  border-radius: 14px;
  background: var(--color-cream);
  margin-bottom: 28px;
}

.filter-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-field label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-soft);
}

.filter-field input[type='date'] {
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 9px 12px;
  font-size: 13.5px;
  font-family: inherit;
  color: var(--color-brown-darkest);
  background: var(--color-white);
}

.filter-reset {
  background: none;
  border: none;
  color: var(--color-brown-dark);
  font-weight: 600;
  font-size: 13px;
  text-decoration: underline;
  padding-bottom: 10px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 22px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 14px;
  text-decoration: none;
  border: none;
  transition: background-color 0.2s, border-color 0.2s;
}

.btn--primary {
  background: var(--color-brown-dark);
  color: var(--color-white);
  padding: 14px 26px;
  font-size: 15px;
}
.btn--primary:hover {
  background: var(--color-brown);
}

.btn--ghost {
  background: transparent;
  color: var(--color-brown-darkest);
  border: 1.5px solid var(--color-border);
}
.btn--ghost:hover {
  border-color: var(--color-brown-dark);
}

.btn--danger {
  background: #c0392b;
  color: var(--color-white);
}
.btn--danger:hover {
  background: #a5301f;
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

.order-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  border: 1px solid var(--color-border);
  border-radius: 16px;
  background: var(--color-white);
  overflow: hidden;
}

.order-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 22px;
  background: var(--color-cream);
  flex-wrap: wrap;
}

.order-card__head-right {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.order-card__id {
  display: block;
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 15px;
  color: var(--color-brown-darkest);
}

.order-card__date {
  display: block;
  font-size: 12.5px;
  color: var(--color-text-soft);
  margin-top: 2px;
}

.order-card__total {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 18px;
  color: var(--color-brown-darkest);
}

.order-card__pdf {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: var(--color-white);
  color: var(--color-brown-dark);
  font-size: 12.5px;
  font-weight: 700;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.order-card__pdf:hover {
  border-color: var(--color-brown-dark);
  background: var(--color-cream);
}

.order-card__items {
  list-style: none;
}

.order-item {
  display: grid;
  grid-template-columns: 52px 1fr auto auto;
  align-items: center;
  gap: 14px;
  padding: 14px 22px;
  border-bottom: 1px solid var(--color-border);
}

.order-item:last-child {
  border-bottom: none;
}

.order-item__photo {
  width: 52px;
  height: 52px;
  border-radius: 10px;
  overflow: hidden;
  background: var(--color-cream);
  border: 1px solid var(--color-border);
  flex-shrink: 0;
}

.order-item__photo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 5px;
  display: block;
}

.order-item__name {
  display: block;
  font-size: 14.5px;
  font-weight: 600;
  color: var(--color-brown-darkest);
}

.order-item__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 3px;
}

.order-item__size {
  display: inline-flex;
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--color-cream);
  border: 1px solid var(--color-border);
  color: var(--color-brown-dark);
  font-size: 11px;
  font-weight: 700;
}

.order-item__note {
  font-size: 12px;
  font-style: italic;
  color: var(--color-text-soft);
}

.order-item__qty {
  font-size: 13.5px;
  color: var(--color-text-soft);
  white-space: nowrap;
}

.order-item__subtotal {
  font-weight: 600;
  color: var(--color-brown-darkest);
  white-space: nowrap;
}

.order-card__foot {
  padding: 16px 22px 20px;
}

.order-card__row {
  display: flex;
  justify-content: space-between;
  font-size: 13.5px;
  color: var(--color-text-soft);
  margin-bottom: 6px;
}

.order-card__row--total {
  font-family: var(--font-heading);
  font-weight: 600;
  color: var(--color-brown-darkest);
  font-size: 16px;
  border-top: 1px solid var(--color-border);
  padding-top: 10px;
  margin-top: 4px;
}

/* Modal konfirmasi */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(46, 22, 15, 0.45);
  padding: 20px;
}

.modal-card {
  width: 100%;
  max-width: 380px;
  background: var(--color-white);
  border-radius: 18px;
  padding: 32px 28px 26px;
  text-align: center;
  box-shadow: 0 24px 60px rgba(46, 22, 15, 0.25);
}

.modal-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(192, 57, 43, 0.1);
  color: #c0392b;
  margin-bottom: 18px;
}

.modal-card h2 {
  font-size: 19px;
  margin-bottom: 10px;
  color: var(--color-brown-darkest);
}

.modal-card p {
  font-size: 14px;
  line-height: 1.55;
  color: var(--color-text-soft);
  margin-bottom: 26px;
}

.modal-card__actions {
  display: flex;
  gap: 12px;
}

.modal-card__actions .btn {
  flex: 1;
  padding: 13px 20px;
  font-size: 14px;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-card,
.modal-fade-leave-active .modal-card {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-fade-enter-from .modal-card,
.modal-fade-leave-to .modal-card {
  transform: scale(0.94) translateY(6px);
  opacity: 0;
}

@media (max-width: 780px) {
  .history-page {
    padding: 20px 20px 80px;
  }
  .filter-bar {
    flex-direction: column;
    align-items: stretch;
  }
  .filter-reset {
    padding-bottom: 0;
    align-self: flex-start;
  }
  .order-item {
    grid-template-columns: 44px 1fr auto;
  }
  .order-item__subtotal {
    grid-column: 2 / 4;
    text-align: right;
  }
  .order-card__head-right {
    width: 100%;
    justify-content: space-between;
  }
  .modal-card {
    padding: 28px 22px 22px;
  }
  .modal-card__actions {
    flex-direction: column-reverse;
  }
}
</style>
