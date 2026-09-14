<script setup>
import { RouterLink } from 'vue-router'
import ProductCard from '@/components/ProductCard.vue'
import { products } from '@/data/products'
import heroImg from '@/data/img/img-home.webp'

const featured = products.filter((p) => p.featured)

const values = [
  {
    title: 'Biji pilihan',
    text: 'Kami memilih biji arabika dari kebun lokal terbaik, disangrai setiap minggu.',
  },
  {
    title: 'Diracik barista',
    text: 'Setiap cangkir diseduh langsung oleh barista, bukan mesin otomatis.',
  },
  {
    title: 'Suasana nyaman',
    text: 'Tempat duduk yang tenang, cocok untuk kerja maupun sekadar berbincang.',
  },
]

const testimonials = [
  {
    name: 'Raka A.',
    text: 'Kopi susu gula arennya juara, dan tempatnya nyaman buat kerja seharian.',
  },
  {
    name: 'Dinda P.',
    text: 'Baristanya ramah, racikannya konsisten enak tiap kali datang.',
  },
  {
    name: 'Fajar N.',
    text: 'Croissant almond-nya selalu habis duluan, jangan sampai kehabisan.',
  },
]
</script>

<template>
  <div class="home">
    <!-- Hero -->
    <section class="hero">
      <div class="container hero__inner">
        <div class="hero__text">
          <h1>Secangkir tenang, di tengah hari yang sibuk.</h1>
          <p class="hero__sub">
            Kindle Coffee menyeduh kopi dari biji pilihan, diracik pelan-pelan supaya
            setiap tegukan terasa seperti jeda yang kamu butuhkan.
          </p>
          <div class="hero__actions">
            <RouterLink to="/menu" class="btn btn--primary">Lihat Menu</RouterLink>
            <RouterLink to="/about" class="btn btn--ghost">Cerita Kami</RouterLink>
          </div>
        </div>

        <div class="hero__art" aria-hidden="true">
          <img :src="heroImg" alt="" class="hero__img" width="320" height="320" />
        </div>
      </div>
    </section>

    <!-- Value props -->
    <section class="values">
      <div class="container values__grid">
        <div class="value">
          <span class="value__icon-wrap">
            <svg class="value__icon" width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 3C7.03 3 3 7.03 3 12.5C3 17.2 6.6 21 11.2 21C16.4 21 21 17.03 21 11.5C21 6.5 16.97 3 12 3Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
              <path d="M7.8 18.2C7.9 14.3 9.8 12 12 9.9C14.1 7.9 16 5.9 16 3.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </span>
          <h3>{{ values[0].title }}</h3>
          <p>{{ values[0].text }}</p>
        </div>

        <div class="value">
          <span class="value__icon-wrap">
            <svg class="value__icon" width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M8 10.5V5a1.3 1.3 0 0 1 2.6 0v5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M10.6 9.8V4.2a1.3 1.3 0 0 1 2.6 0v5.6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M13.2 10V5.6a1.3 1.3 0 0 1 2.6 0v6.1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M5.4 13.2C5.2 11.8 6.1 10.5 7.5 10.5c.6 0 1.1.2 1.5.6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M5.4 13.2 6.6 18.4C7 20 8.4 21 10 21h4c2 0 3.6-1.4 4-3.4l1-4.7c.3-1.6-.9-3.1-2.6-3.1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <h3>{{ values[1].title }}</h3>
          <p>{{ values[1].text }}</p>
        </div>

        <div class="value">
          <span class="value__icon-wrap">
            <svg class="value__icon" width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M6.5 11V7.5A2.5 2.5 0 0 1 9 5h6a2.5 2.5 0 0 1 2.5 2.5V11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M4.5 11.5A1.5 1.5 0 0 1 6 10h12a1.5 1.5 0 0 1 1.5 1.5v2.7A1.8 1.8 0 0 1 17.7 16H6.3a1.8 1.8 0 0 1-1.8-1.8v-2.7Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
              <path d="M5.5 16v3M18.5 16v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </span>
          <h3>{{ values[2].title }}</h3>
          <p>{{ values[2].text }}</p>
        </div>
      </div>
    </section>

    <!-- Featured menu -->
    <section class="featured">
      <div class="container">
        <div class="featured__head">
          <div>
            <span class="eyebrow">Menu unggulan</span>
            <h2>Favorit di Kindle Coffee</h2>
          </div>
          <RouterLink to="/menu" class="link-more">Lihat semua menu</RouterLink>
        </div>

        <div class="featured__grid">
          <ProductCard v-for="p in featured" :key="p.id" :product="p" />
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="testimonials">
      <div class="container">
        <span class="eyebrow eyebrow--light">Kata mereka</span>
        <h2 class="testimonials__title">Ditemani secangkir, setiap hari</h2>

        <div class="testimonials__grid">
          <blockquote v-for="t in testimonials" :key="t.name" class="testimonial">
            <p>&ldquo;{{ t.text }}&rdquo;</p>
            <cite>{{ t.name }}</cite>
          </blockquote>
        </div>
      </div>
    </section>

    <!-- Visit CTA -->
    <section class="visit">
      <div class="container visit__card">
        <div class="visit__content">
          <div class="visit__text">
            <span class="visit__eyebrow">Kunjungi kami</span>
            <h2>Mampir dan nikmati secangkir sekarang</h2>
            <p>
              Area Universitas Logistik dan Bisnis Internasional (ULBI), Sarijadi, Bandung
              &middot; Buka setiap hari, 07.00 &ndash; 22.00
            </p>
          </div>
          <div class="visit__actions">
            <RouterLink to="/menu" class="btn btn--primary">Pesan Sekarang</RouterLink>
            <a
              href="https://maps.app.goo.gl/LGT94p4CDt4AAfhG6"
              target="_blank"
              rel="noopener"
              class="btn btn--outline"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 22s7-7.2 7-12.5A7 7 0 0 0 5 9.5C5 14.8 12 22 12 22Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
                <circle cx="12" cy="9.5" r="2.4" stroke="currentColor" stroke-width="1.6"/>
              </svg>
              Buka di Maps
            </a>
          </div>
        </div>

        <div class="visit__map">
          <iframe
            title="Lokasi Kindle Coffee dekat ULBI"
            src="https://www.openstreetmap.org/export/embed.html?bbox=107.5707,-6.8796,107.5807,-6.8696&layer=mapnik&marker=-6.87455,107.5756998"
            loading="lazy"
            scrolling="no"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
          <a
            href="https://maps.app.goo.gl/LGT94p4CDt4AAfhG6"
            target="_blank"
            rel="noopener"
            class="visit__map-lock"
            aria-label="Buka lokasi Kindle Coffee di Google Maps"
          ></a>
          <a
            href="https://maps.app.goo.gl/LGT94p4CDt4AAfhG6"
            target="_blank"
            rel="noopener"
            class="visit__map-fallback"
          >
            Buka lokasi di Google Maps
          </a>
        </div>
      </div>
    </section>
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

.eyebrow--light {
  color: var(--color-brown-light);
}

.eyebrow--light::before {
  background: var(--color-brown-light);
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
  transition: background-color 0.2s, color 0.2s, border-color 0.2s;
}

.btn--primary {
  background: var(--color-brown-dark);
  color: var(--color-white);
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

/* Hero */
.hero {
  padding: 40px 0 var(--section-gap);
}

.hero__inner {
  display: grid;
  grid-template-columns: 0.9fr 1.3fr;
  align-items: center;
  gap: 32px;
}

.hero__text h1 {
  font-size: clamp(34px, 4.4vw, 54px);
  max-width: 14ch;
}

.hero__sub {
  margin-top: 20px;
  color: var(--color-text-soft);
  font-size: 17px;
  max-width: 46ch;
}

.hero__actions {
  margin-top: 32px;
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.hero__art {
  position: relative;
  max-width: 780px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  padding: 20px;
}

.hero__ring {
  display: none;
}

.hero__img {
  position: relative;
  z-index: 1;
  width: 100%;
  height: auto;
  object-fit: contain;
  transform: rotate(6deg);
  filter: drop-shadow(0 28px 36px rgba(74, 46, 34, 0.3));
  transition: transform 0.35s ease;
  animation: floatImg 4.5s ease-in-out infinite;
}

.hero__img:hover {
  transform: rotate(3deg) translateY(-4px);
}

@keyframes floatImg {
  0%, 100% { transform: rotate(6deg) translateY(0); }
  50% { transform: rotate(6deg) translateY(-10px); }
}

/* Values */
.values {
  padding: 48px 0;
  background: var(--color-cream);
}

.values__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

.value {
  text-align: left;
}

.value__icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--color-white);
  box-shadow: 0 8px 20px rgba(74, 46, 34, 0.12);
  margin-bottom: 18px;
}

.value__icon {
  color: var(--color-brown-dark);
}

.value h3 {
  font-size: 18px;
  margin-bottom: 8px;
}

.value p {
  color: var(--color-text-soft);
  font-size: 14.5px;
  max-width: 32ch;
}

/* Featured */
.featured {
  padding: var(--section-gap) 0;
}

.featured__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
  margin-bottom: 36px;
}

.link-more {
  position: relative;
  color: var(--color-brown-dark);
  text-decoration: none;
  font-weight: 600;
  font-size: 14.5px;
  white-space: nowrap;
  padding-bottom: 3px;
  border-bottom: 1px solid var(--color-brown-dark);
}

.featured__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

/* Testimonials */
.testimonials {
  background: var(--color-brown-darkest);
  color: var(--color-white);
  padding: var(--section-gap) 0;
}

.testimonials__title {
  color: var(--color-white);
  font-size: clamp(26px, 3vw, 36px);
  margin-bottom: 40px;
  max-width: 20ch;
}

.testimonials__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.testimonial {
  background: rgba(244, 233, 225, 0.05);
  border: 1px solid rgba(244, 233, 225, 0.12);
  border-radius: 14px;
  padding: 26px;
}

.testimonial p {
  font-family: var(--font-heading);
  font-style: italic;
  font-size: 17px;
  line-height: 1.5;
  margin-bottom: 18px;
}

.testimonial cite {
  font-style: normal;
  font-size: 13.5px;
  color: var(--color-text-on-dark-soft);
  font-weight: 600;
}

/* Visit CTA */
.visit {
  padding: 80px 0;
}

.visit {
  overflow-x: clip;
}

.visit__card {
  background: var(--color-brown);
  border-radius: 20px;
  overflow: hidden;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 1fr);
  align-items: stretch;
}

/* Card stays centered inside the normal page container on all sizes. */

.visit__content {
  padding: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 28px;
  color: var(--color-white);
}

.visit__eyebrow {
  display: block;
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 10px;
}

.visit__text h2 {
  color: var(--color-white);
  font-size: 26px;
  margin-bottom: 10px;
}

.visit__text p {
  color: rgba(255, 255, 255, 0.85);
  font-size: 14.5px;
  line-height: 1.6;
  max-width: 38ch;
}

.visit__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.visit .btn--primary {
  background: var(--color-white);
  color: var(--color-brown-darkest);
  flex-shrink: 0;
}
.visit .btn--primary:hover {
  background: var(--color-cream);
}

.btn--outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 24px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 15px;
  text-decoration: none;
  border: 1.5px solid rgba(255, 255, 255, 0.5);
  color: var(--color-white);
  background: transparent;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.btn--outline:hover {
  border-color: var(--color-white);
  background: rgba(255, 255, 255, 0.08);
}

.visit__map {
  position: relative;
  min-height: 280px;
  height: 100%;
  background: var(--color-cream);
  overflow: hidden;
}

.visit__map iframe {
  width: calc(100% + 60px);
  height: calc(100% + 60px);
  border: 0;
  display: block;
  position: absolute;
  top: -10px;
  left: -10px;
  /* Purely decorative: no drag, no scroll-zoom, no clicking the +/- buttons.
     pointer-events:none means clicks always fall through to .visit__map-lock
     below, never to the map itself — so a click can never trigger a zoom. */
  pointer-events: none;
}

.visit__map-lock {
  position: absolute;
  inset: 0;
  z-index: 2;
  cursor: pointer;
}

.visit__map-fallback {
  position: absolute;
  left: 12px;
  bottom: 12px;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--color-white);
  color: var(--color-brown-dark);
  font-size: 12.5px;
  font-weight: 700;
  padding: 8px 14px;
  border-radius: 999px;
  text-decoration: none;
  box-shadow: 0 6px 16px rgba(46, 22, 15, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.visit__map-fallback:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(46, 22, 15, 0.22);
}

@media (max-width: 900px) and (min-width: 781px) {
  .visit__card {
    margin-left: 0;
    margin-right: 0;
    border-radius: 20px;
  }
}

@media (max-width: 780px) {
  .visit {
    padding: 48px 0;
  }
  .visit__card {
    grid-template-columns: 1fr;
    border-radius: 22px;
    margin-left: 0;
    margin-right: 0;
  }
  .visit__map {
    order: -1;
    min-height: 200px;
    height: 200px;
  }
  .visit__content {
    padding: 30px 24px 34px;
    gap: 22px;
    text-align: left;
  }
  .visit__text h2 {
    font-size: 22px;
  }
  .visit__text p {
    font-size: 14px;
    max-width: 100%;
  }
  .visit__actions {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  .visit__actions .btn,
  .visit__actions .btn--outline {
    width: 100%;
  }
  .visit .btn--primary,
  .btn--outline {
    padding: 15px 24px;
  }
  .visit__map-fallback {
    left: 10px;
    bottom: 10px;
    font-size: 11.5px;
    padding: 7px 12px;
  }
}

@media (max-width: 420px) {
  .visit__map {
    min-height: 180px;
    height: 180px;
  }
  .visit__content {
    padding: 26px 20px 30px;
  }
}

@media (max-width: 900px) {
  .hero {
    padding: 20px 0 var(--section-gap);
  }
  .hero__inner {
    grid-template-columns: 1fr;
  }
  .hero__art {
    order: -1;
    max-width: 420px;
    width: 100%;
  }
  .values__grid,
  .featured__grid,
  .testimonials__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 560px) {
  .hero__art {
    max-width: 320px;
  }
  .values__grid,
  .featured__grid,
  .testimonials__grid {
    grid-template-columns: 1fr;
  }
  .featured__head {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
