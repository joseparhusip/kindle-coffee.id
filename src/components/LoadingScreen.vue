<script setup>
import { ref, onMounted } from 'vue'
import logoLoading from '@/data/img/logo-loading.webp'

const isVisible = ref(true)
const isLeaving = ref(false)

const FLIP_CYCLE_MS = 1800
const MIN_DURATION = FLIP_CYCLE_MS * 2
const FADE_DURATION = 500

let startTime = 0

function hideLoading() {
  const elapsed = Date.now() - startTime
  const remaining = Math.max(MIN_DURATION - elapsed, 0)

  setTimeout(() => {
    isLeaving.value = true
    setTimeout(() => {
      isVisible.value = false
    }, FADE_DURATION)
  }, remaining)
}

onMounted(() => {
  startTime = Date.now()

  if (document.readyState === 'complete') {
    hideLoading()
  } else {
    window.addEventListener('load', hideLoading, { once: true })
  }
})
</script>

<template>
  <div
    v-if="isVisible"
    class="loading-screen"
    :class="{ 'loading-screen--leaving': isLeaving }"
    role="status"
    aria-label="Memuat halaman"
  >
    <div class="loading-screen__perspective">
      <div class="flip-card">
        <div class="flip-card__face flip-card__face--front">
          <img :src="logoLoading" alt="Kindle Coffee" />
        </div>
        <div class="flip-card__face flip-card__face--back">
          <img :src="logoLoading" alt="Kindle Coffee" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loading-screen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #46261d;
  opacity: 1;
  transition: opacity 0.5s ease;
}

.loading-screen--leaving {
  opacity: 0;
  pointer-events: none;
}

.loading-screen__perspective {
  width: 220px;
  height: 220px;
  perspective: 900px;
}

.flip-card {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  /* !important dipakai sengaja: memastikan tidak ada CSS lain (reset,
     reduce-motion, atau library) yang diam-diam mematikan animasi ini */
  animation: forced-card-flip 1.8s cubic-bezier(0.45, 0, 0.2, 1) infinite !important;
}

.flip-card__face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.flip-card__face img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.flip-card__face--front {
  transform: rotateY(0deg);
}

.flip-card__face--back {
  transform: rotateY(180deg);
}

@keyframes forced-card-flip {
  0% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(180deg);
  }
  100% {
    transform: rotateY(0deg);
  }
}

/* SENGAJA tidak ada @media (prefers-reduced-motion) di sini.
   Kalau ternyata ini penyebabnya (browser/OS kamu set reduce-motion),
   animasi tetap akan jalan dengan versi ini. */
</style>
