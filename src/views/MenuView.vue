<script setup>
import { ref, computed } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import { products, categories } from '@/data/products'

const activeCategory = ref('Semua')

const filtered = computed(() => {
  if (activeCategory.value === 'Semua') return products
  return products.filter((p) => p.category === activeCategory.value)
})
</script>

<template>
  <div class="menu-page">
    <section class="menu-hero">
      <div class="container">
        <span class="eyebrow">Menu kami</span>
        <h1>Pilih racikanmu hari ini</h1>
        <p>Dari kopi susu manis sampai espresso murni, semua diseduh segar setiap pesanan.</p>
      </div>
    </section>

    <section class="menu-body container">
      <div class="tabs" role="tablist">
        <button
          v-for="cat in categories"
          :key="cat"
          class="tab"
          :class="{ 'is-active': activeCategory === cat }"
          @click="activeCategory = cat"
        >
          {{ cat }}
        </button>
      </div>

      <div class="menu-grid">
        <ProductCard v-for="p in filtered" :key="p.id" :product="p" />
      </div>

      <p v-if="filtered.length === 0" class="empty">Belum ada menu di kategori ini.</p>
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

.menu-hero {
  background: var(--color-cream);
  padding: 40px 0 40px;
}

.menu-hero h1 {
  font-size: clamp(30px, 4vw, 42px);
  margin-bottom: 12px;
}

.menu-hero p {
  color: var(--color-text-soft);
  max-width: 48ch;
  font-size: 16px;
}

.menu-body {
  padding: 48px 28px 100px;
}

.tabs {
  display: flex;
  gap: 32px;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 40px;
  overflow-x: auto;
}

.tab {
  position: relative;
  background: none;
  border: none;
  color: var(--color-text-soft);
  font-weight: 600;
  font-size: 14.5px;
  padding: 4px 0 14px;
  white-space: nowrap;
  transition: color 0.2s ease;
}

.tab::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -1px;
  width: 100%;
  height: 2px;
  background: var(--color-brown-dark);
  transform: scaleX(0);
  transition: transform 0.25s ease;
}

.tab:hover {
  color: var(--color-brown-darkest);
}

.tab.is-active {
  color: var(--color-brown-darkest);
}

.tab.is-active::after {
  transform: scaleX(1);
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.empty {
  color: var(--color-text-soft);
  padding: 40px 0;
}

@media (max-width: 900px) {
  .menu-hero {
    padding: 20px 0 32px;
  }
  .menu-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 560px) {
  .menu-grid {
    grid-template-columns: 1fr;
  }
  .tabs {
    gap: 22px;
  }
}
</style>
