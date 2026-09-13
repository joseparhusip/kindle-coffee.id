<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import logoNavbar from '@/components/icons/logo-utama.png'

const cart = useCartStore()
const route = useRoute()
const menuOpen = ref(false)

const links = [
  { to: '/', label: 'Beranda' },
  { to: '/menu', label: 'Menu' },
  { to: '/history', label: 'Riwayat' },
  { to: '/about', label: 'Tentang' },
]

function closeMenu() {
  menuOpen.value = false
}
</script>

<template>
  <header class="navbar">
    <div class="navbar__inner container">
      <RouterLink to="/" class="navbar__brand" @click="closeMenu">
        <img :src="logoNavbar" alt="Kindle Coffee" class="navbar__logo" />
      </RouterLink>

      <nav class="navbar__links" :class="{ 'is-open': menuOpen }">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="navbar__link"
          :class="{ 'is-active': route.path === link.to }"
          @click="closeMenu"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="navbar__actions">
        <RouterLink to="/cart" class="navbar__cart" aria-label="Keranjang">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 4H5L5.6 7M5.6 7L7 15H18L20 7H5.6Z"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <circle cx="9" cy="19.5" r="1.3" fill="currentColor" />
            <circle cx="17" cy="19.5" r="1.3" fill="currentColor" />
          </svg>
          <span v-if="cart.totalItems > 0" class="navbar__badge">{{ cart.totalItems }}</span>
        </RouterLink>

        <button
          class="navbar__burger"
          :class="{ 'is-open': menuOpen }"
          aria-label="Buka menu navigasi"
          @click="menuOpen = !menuOpen"
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--color-brown-dark);
  border-bottom: 1px solid rgba(244, 233, 225, 0.1);
}

.navbar__inner {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
}

/* Brand */
.navbar__brand {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: var(--color-white);
  flex-shrink: 0;
}

.navbar__logo {
  height: 64px;
  width: auto;
  object-fit: contain;
}

/* Links — elegant underline on hover */
.navbar__links {
  display: flex;
  gap: 36px;
  margin: 0 auto;
}

.navbar__link {
  position: relative;
  text-decoration: none;
  color: var(--color-text-on-dark-soft);
  font-weight: 600;
  font-size: 14.5px;
  letter-spacing: 0.01em;
  padding: 6px 2px;
  transition: color 0.25s ease;
}

.navbar__link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1.5px;
  background: var(--color-white);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s ease;
}

.navbar__link:hover {
  color: var(--color-white);
}

.navbar__link:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

.navbar__link.is-active {
  color: var(--color-white);
}

.navbar__link.is-active::after {
  transform: scaleX(1);
  transform-origin: left;
  background: var(--color-white);
}

/* Actions */
.navbar__actions {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
}

.navbar__cart {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: var(--color-white);
  background: transparent;
  border: 1px solid rgba(244, 233, 225, 0.25);
  text-decoration: none;
  transition:
    border-color 0.25s ease,
    background-color 0.25s ease;
}

.navbar__cart:hover {
  border-color: var(--color-white);
  background: rgba(244, 233, 225, 0.08);
}

.navbar__badge {
  position: absolute;
  top: -5px;
  right: -5px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 999px;
  background: var(--color-white);
  color: var(--color-brown-dark);
  font-size: 10.5px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--color-brown-dark);
}

.navbar__burger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
}

.navbar__burger span {
  height: 1.5px;
  width: 22px;
  background: var(--color-white);
  transition:
    transform 0.2s,
    opacity 0.2s;
  margin: 0 auto;
}

.navbar__burger.is-open span:nth-child(1) {
  transform: translateY(6.5px) rotate(45deg);
}
.navbar__burger.is-open span:nth-child(2) {
  opacity: 0;
}
.navbar__burger.is-open span:nth-child(3) {
  transform: translateY(-6.5px) rotate(-45deg);
}

@media (max-width: 780px) {
  .navbar__burger {
    display: flex;
  }

  .navbar__links {
    position: absolute;
    top: 80px;
    left: 0;
    right: 0;
    background: var(--color-brown-dark);
    border-bottom: 1px solid rgba(244, 233, 225, 0.1);
    flex-direction: column;
    padding: 8px 28px 24px;
    display: none;
    gap: 4px;
  }

  .navbar__links.is-open {
    display: flex;
  }

  .navbar__link {
    text-align: left;
    padding: 12px 0;
  }

  .navbar__link::after {
    display: none;
  }
}
</style>
