<script setup>
import { RouterLink } from 'vue-router'

const stats = [
  { value: '2026', label: 'Tahun berdiri' },
  { value: 'Sarijadi', label: 'Kota Bandung' },
  { value: '3+', label: 'Racikan andalan' },
]
</script>

<template>
  <div class="about">
    <section class="about-hero">
      <div class="container about-hero__inner">
        <span class="eyebrow">Tentang kami</span>
        <h1>Dimulai dari satu meja kecil, satu resep kopi.</h1>
        <p class="about-hero__sub">
          Berdiri di Sarijadi, Kota Bandung — kami menyeduh kopi untuk siapa saja
          yang butuh jeda sejenak di tengah harinya.
        </p>
      </div>
    </section>

    <section class="about-stats">
      <div class="container about-stats__row">
        <div v-for="(s, i) in stats" :key="s.label" class="about-stats__item">
          <span class="about-stats__value">{{ s.value }}</span>
          <span class="about-stats__label">{{ s.label }}</span>
          <span v-if="i < stats.length - 1" class="about-stats__sep" aria-hidden="true"></span>
        </div>
      </div>
    </section>

    <section class="about-story">
      <div class="container about-story__grid">
        <div class="about-story__lede">
          <span class="about-story__kicker">Cerita kami</span>
          <p>
            Kindle Coffee lahir tahun 2026 di Sarijadi, Kota Bandung, dari kecintaan
            sederhana pada kopi rumahan. Kami percaya kopi terbaik bukan yang paling
            rumit, tapi yang dibuat dengan perhatian — biji yang tepat, air yang pas,
            dan waktu yang tidak terburu-buru.
          </p>
          <p class="about-story__lede-secondary">
            Dari satu meja kecil di sudut Sarijadi, kami tumbuh pelan-pelan bersama
            pelanggan yang setia mampir untuk secangkir tenang di tengah hari yang sibuk.
          </p>
        </div>

        <blockquote class="about-story__quote">
          <span class="about-story__quotemark" aria-hidden="true">&ldquo;</span>
          <p>Setiap cangkir adalah jeda kecil yang kami titipkan pada harimu.</p>
          <cite>&mdash; Tim Kindle Coffee, Sarijadi</cite>
        </blockquote>
      </div>
    </section>

    <section class="about-cta">
      <div class="container about-cta__inner">
        <span class="about-cta__eyebrow">Sarijadi, Kota Bandung &middot; sejak 2026</span>
        <h2>Penasaran dengan rasa kami?</h2>
        <RouterLink to="/menu" class="btn btn--primary">Lihat Menu</RouterLink>
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
  margin-bottom: 14px;
}

.eyebrow::before {
  content: '';
  width: 16px;
  height: 1px;
  background: var(--color-brown);
}

/* Hero */
.about-hero {
  padding: 88px 0 0;
  position: relative;
}

@media (max-width: 780px) {
  .about-hero {
    padding: 40px 0 0;
  }
}

.about-hero__inner {
  max-width: 58ch;
}

.about-hero__mark {
  display: none;
}

.about-hero h1 {
  font-size: clamp(32px, 4.6vw, 48px);
  max-width: 16ch;
}

.about-hero__sub {
  margin-top: 18px;
  font-size: 16.5px;
  line-height: 1.7;
  color: var(--color-text-soft);
  max-width: 42ch;
}

/* Stats strip */
.about-stats {
  padding: 44px 0 0;
}

@media (max-width: 780px) {
  .about-stats {
    padding: 32px 0 0;
  }
}

.about-stats__row {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  padding: 28px 0;
}

.about-stats__item {
  position: relative;
  flex: 1;
  min-width: 140px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 24px;
}

.about-stats__item:first-child {
  padding-left: 0;
}

.about-stats__value {
  font-family: var(--font-heading);
  font-size: 26px;
  font-weight: 600;
  color: var(--color-brown-darkest);
}

.about-stats__label {
  font-size: 13px;
  color: var(--color-text-soft);
}

.about-stats__sep {
  position: absolute;
  right: 0;
  top: 2px;
  bottom: 2px;
  width: 1px;
  background: var(--color-border);
}

/* Story */
.about-story {
  padding: 64px 0 100px;
}

.about-story__grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 56px;
  align-items: start;
}

.about-story__kicker {
  display: block;
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-brown);
  margin-bottom: 14px;
}

.about-story__lede p {
  font-size: 19px;
  line-height: 1.75;
  color: var(--color-text);
  max-width: 46ch;
}

.about-story__lede-secondary {
  margin-top: 18px;
  font-size: 16px !important;
  color: var(--color-text-soft) !important;
}

.about-story__quote {
  position: relative;
  border-left: 2px solid var(--color-brown);
  padding-left: 24px;
}

.about-story__quotemark {
  position: absolute;
  left: -6px;
  top: -34px;
  font-family: var(--font-heading);
  font-size: 72px;
  line-height: 1;
  color: var(--color-brown-light);
  opacity: 0.5;
  user-select: none;
}

.about-story__quote p {
  font-family: var(--font-heading);
  font-style: italic;
  font-size: 21px;
  line-height: 1.5;
  color: var(--color-brown-darkest);
  margin-bottom: 12px;
}

.about-story__quote cite {
  font-style: normal;
  font-size: 13.5px;
  color: var(--color-text-soft);
  font-weight: 600;
}

/* CTA */
.about-cta {
  background: var(--color-cream);
  padding: 72px 0;
}

.about-cta__inner {
  text-align: center;
}

.about-cta__eyebrow {
  display: block;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--color-brown);
  margin-bottom: 10px;
}

.about-cta h2 {
  font-size: 26px;
  margin-bottom: 24px;
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
}

.btn--primary {
  background: var(--color-brown-dark);
  color: var(--color-white);
  transition: background-color 0.2s;
}
.btn--primary:hover {
  background: var(--color-brown);
}

@media (max-width: 780px) {
  .about-story__grid {
    grid-template-columns: 1fr;
    gap: 36px;
  }
  .about-stats__row {
    flex-direction: column;
    gap: 12px;
    border: none;
    padding: 0;
  }
  .about-stats__item {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 18px 20px !important;
    border: 1px solid var(--color-border);
    border-radius: 14px;
    background: var(--color-white);
    box-shadow: 0 6px 16px rgba(46, 22, 15, 0.05);
  }
  .about-stats__value {
    font-size: 22px;
    order: 2;
  }
  .about-stats__label {
    order: 1;
    font-size: 13.5px;
    color: var(--color-text-soft);
  }
  .about-stats__sep {
    display: none;
  }
  .about-story__quotemark {
    top: -28px;
    font-size: 56px;
  }
}
</style>
