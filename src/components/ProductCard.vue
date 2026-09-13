<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { formatRupiah } from '@/data/products'

const props = defineProps({
  product: { type: Object, required: true },
})

const cart = useCartStore()
const justAdded = ref(false)

// Default ke ukuran Medium (index 1) kalau produk punya daftar ukuran.
const defaultSizeId = props.product.sizes?.[1]?.id ?? props.product.sizes?.[0]?.id ?? null
const selectedSizeId = ref(defaultSizeId)
const note = ref('')

const activeSize = computed(() =>
  props.product.sizes?.find((s) => s.id === selectedSizeId.value),
)

const finalPrice = computed(() => props.product.price + (activeSize.value?.extra || 0))

function handleAdd() {
  cart.addToCart({
    ...props.product,
    price: finalPrice.value,
    size: activeSize.value?.label ?? null,
    note: note.value.trim(),
  })
  justAdded.value = true
  setTimeout(() => (justAdded.value = false), 1100)
  // Reset both note AND size back to default after every add. Without this,
  // the previously chosen size silently "sticks" on the card, so a later
  // order can end up merged into the wrong size/line if the person forgets
  // to re-pick a size before clicking add again.
  note.value = ''
  selectedSizeId.value = defaultSizeId
}
</script>

<template>
  <article class="dish">
    <div class="dish__photo">
      <img :src="product.image" :alt="product.name" loading="lazy" />
    </div>

    <div class="dish__body">
      <span class="dish__category">{{ product.category }}</span>
      <h3 class="dish__name">{{ product.name }}</h3>
      <p class="dish__desc">{{ product.description }}</p>

      <div v-if="product.sizes?.length" class="dish__sizes">
        <button
          v-for="s in product.sizes"
          :key="s.id"
          type="button"
          class="size-pill"
          :class="{ 'is-active': selectedSizeId === s.id }"
          @click="selectedSizeId = s.id"
        >
          {{ s.label }}
        </button>
      </div>

      <label class="dish__note">
        <span class="dish__note-label">Catatan (opsional)</span>
        <input
          v-model="note"
          type="text"
          maxlength="80"
          placeholder="Cth: less sugar, extra ice"
        />
      </label>

      <div class="dish__foot">
        <span class="dish__price">{{ formatRupiah(finalPrice) }}</span>

        <button
          class="dish__add"
          :class="{ 'is-added': justAdded }"
          :aria-label="`Tambah ${product.name} ke keranjang`"
          @click="handleAdd"
        >
          <svg v-if="!justAdded" width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
          <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M5 12L10 17L19 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.dish {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.dish:hover {
  border-color: var(--color-brown-light);
  box-shadow: 0 10px 24px rgba(46, 22, 15, 0.08);
}

.dish__photo {
  aspect-ratio: 1 / 1.05;
  overflow: hidden;
  background: var(--color-cream);
  padding: 14px;
}

.dish__photo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  transition: transform 0.4s ease;
}

.dish:hover .dish__photo img {
  transform: scale(1.045);
}

.dish__body {
  padding: 18px 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.dish__category {
  font-size: 12px;
  color: var(--color-text-soft);
}

.dish__name {
  font-size: 18px;
  line-height: 1.3;
}

.dish__desc {
  color: var(--color-text-soft);
  font-size: 14px;
  line-height: 1.55;
  flex: 1;
}

/* Size selector */
.dish__sizes {
  display: flex;
  gap: 6px;
  margin-top: 2px;
}

.size-pill {
  flex: 1;
  padding: 6px 0;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: var(--color-cream);
  color: var(--color-text-soft);
  font-size: 12.5px;
  font-weight: 700;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.size-pill:hover {
  border-color: var(--color-brown-light);
  color: var(--color-brown-darkest);
}

.size-pill.is-active {
  background: var(--color-brown-dark);
  border-color: var(--color-brown-dark);
  color: var(--color-white);
}

/* Note field */
.dish__note {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 2px;
}

.dish__note-label {
  font-size: 11.5px;
  color: var(--color-text-soft);
  font-weight: 600;
}

.dish__note input {
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--color-text);
  background: var(--color-white);
  transition: border-color 0.2s ease;
}

.dish__note input:focus {
  outline: none;
  border-color: var(--color-brown-light);
}

.dish__note input::placeholder {
  color: rgba(46, 26, 18, 0.4);
}

.dish__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  margin-top: 4px;
  border-top: 1px solid var(--color-border);
}

.dish__price {
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 16px;
  color: var(--color-brown-darkest);
}

.dish__add {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid var(--color-brown-dark);
  background: transparent;
  color: var(--color-brown-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.15s ease;
}

.dish__add:hover {
  background: var(--color-brown-dark);
  color: var(--color-white);
}

.dish__add:active {
  transform: scale(0.92);
}

.dish__add.is-added {
  background: var(--color-brown-dark);
  color: var(--color-white);
  border-color: var(--color-brown-dark);
}
</style>
