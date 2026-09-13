<script setup>
import { RouterLink } from 'vue-router'
import logoNavbar from '@/components/icons/logo-utama.png'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container footer__grid">
      <div class="footer__brand">
        <div class="footer__brandrow">
          <img :src="logoNavbar" alt="Kindle Coffee" class="footer__logo" />
        </div>
        <p class="footer__desc">
          Kopi yang diracik pelan-pelan, untuk momen yang ingin kamu nikmati lebih lama.
        </p>
      </div>

      <div class="footer__col">
        <h4>Jelajahi</h4>
        <RouterLink to="/">Beranda</RouterLink>
        <RouterLink to="/menu">Menu</RouterLink>
        <RouterLink to="/cart">Keranjang</RouterLink>
        <RouterLink to="/about">Tentang Kami</RouterLink>
      </div>

      <div class="footer__col">
        <h4>Kunjungi Kami</h4>
        <p>Jl. Braga No. 21, Bandung</p>
        <p>Setiap hari, 07.00 &ndash; 22.00</p>
        <p>+62 812-3456-7890</p>
      </div>

      <div class="footer__col">
        <h4>Ikuti Kami</h4>
        <a href="#">Instagram</a>
        <a href="#">TikTok</a>
        <a href="#">WhatsApp</a>
      </div>
    </div>

    <div class="footer__bottom container">
      <p>&copy; {{ year }} Kindle Coffee. Semua hak dilindungi.</p>
      <p class="footer__made">Diracik dengan hati, disajikan dengan bangga.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--color-brown-darkest);
  color: var(--color-text-on-dark);
  margin-top: auto;
  padding-top: 72px;
  position: relative;
}

.footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--color-brown) 0%, var(--color-brown-light) 50%, var(--color-brown) 100%);
  opacity: 0.6;
}

.footer__grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1fr;
  gap: 48px;
  padding-bottom: 52px;
  border-bottom: 1px solid rgba(244, 233, 225, 0.1);
}

.footer__brandrow {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.footer__logo {
  height: 64px;
  width: auto;
  object-fit: contain;
}

.footer__desc {
  color: var(--color-text-on-dark-soft);
  max-width: 30ch;
  font-size: 14.5px;
  line-height: 1.7;
}

.footer__col h4 {
  color: var(--color-white);
  font-family: var(--font-body);
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.03em;
  margin-bottom: 18px;
}

.footer__col a,
.footer__col p {
  display: block;
  width: fit-content;
  color: var(--color-text-on-dark-soft);
  text-decoration: none;
  font-size: 14.5px;
  margin-bottom: 11px;
  position: relative;
}

.footer__col a {
  transition: color 0.25s ease;
}

.footer__col a::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 100%;
  height: 1px;
  background: var(--color-brown-light);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.25s ease;
}

.footer__col a:hover {
  color: var(--color-white);
}

.footer__col a:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

.footer__bottom {
  padding: 22px 28px;
  font-size: 13px;
  color: var(--color-text-on-dark-soft);
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
}

.footer__made {
  font-family: var(--font-heading);
  font-style: italic;
  color: rgba(244, 233, 225, 0.45);
}

@media (max-width: 820px) {
  .footer__grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 540px) {
  .footer__grid {
    grid-template-columns: 1fr;
    gap: 36px;
  }
  .footer__bottom {
    flex-direction: column;
  }
}
</style>
