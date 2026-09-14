// src/utils/loadMidtransSnap.js
//
// Muat script Midtrans Snap.js secara lazy — HANYA saat halaman yang
// butuh pembayaran (CartView / HistoryView) benar-benar mount, bukan di
// semua halaman lewat index.html. Ini yang paling menghemat waktu
// render-blocking di Beranda/Menu/Tentang (skor Performa Lighthouse).
//
// Dipanggil berkali-kali aman: kalau script sudah ada/sedang dimuat,
// tidak akan menambah <script> tag baru, cukup nunggu yang sudah ada.

// GANTI ke 'https://app.midtrans.com/snap/snap.js' saat sudah production.
const SNAP_SRC = 'https://app.sandbox.midtrans.com/snap/snap.js'
const SNAP_CLIENT_KEY = 'SB-Mid-client-gAm8oXUyihl8XTj-'

let loadingPromise = null

export function loadMidtransSnap() {
  // Sudah tersedia (mis. dipanggil dua kali di halaman yang sama).
  if (typeof window !== 'undefined' && window.snap) {
    return Promise.resolve(window.snap)
  }

  if (loadingPromise) return loadingPromise

  loadingPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${SNAP_SRC}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve(window.snap))
      existing.addEventListener('error', reject)
      return
    }

    const script = document.createElement('script')
    script.src = SNAP_SRC
    script.setAttribute('data-client-key', SNAP_CLIENT_KEY)
    script.onload = () => resolve(window.snap)
    script.onerror = () => reject(new Error('Gagal memuat Midtrans Snap.js'))
    document.head.appendChild(script)
  })

  return loadingPromise
}
