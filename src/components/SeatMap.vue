<script setup>
import { ref, computed } from 'vue'

// --- Props & emits -------------------------------------------------
// modelValue: array nomor meja yang sedang dipilih
const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  occupied: { type: Array, default: () => [] }, // nomor meja yang sudah terisi
})
const emit = defineEmits(['update:modelValue'])

// --- Area: dalam ruangan vs luar ruangan ----------------------------
const areas = [
  { id: 'indoor', label: 'Ruang Dalam' },
  { id: 'outdoor', label: 'Ruang Luar' },
]
const activeArea = ref('indoor')

// --- Layout untuk ruang dalam --------------------------------------
const INDOOR_TABLE_COUNT = 10
const layouts = [
  { id: 'circle', label: 'Meja Melingkar' },
  { id: 'rows', label: 'Meja Berbaris' },
]
const activeLayout = ref('circle')

// Denah 1: "Meja Melingkar" - 10 Meja tersusun melingkari area tengah
const circleTables = computed(() => {
  const tables = []
  const cx = 250
  const cy = 295 // Agak ke bawah agar aman dari counter barista
  const r = 135  // Radius sebaran meja
  for (let i = 0; i < INDOOR_TABLE_COUNT; i++) {
    const angle = (i / INDOOR_TABLE_COUNT) * Math.PI * 2 - Math.PI / 2
    tables.push({
      number: i + 1,
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      // Posisi kursi di sekeliling masing-masing meja
      chairs: [
        { dx: 26 * Math.cos(angle), dy: 26 * Math.sin(angle) },
        { dx: -26 * Math.cos(angle), dy: -26 * Math.sin(angle) }
      ]
    })
  }
  return tables
})

// Denah 2: "Meja Berbaris" - 10 Meja berbaris (2 baris x 5 kolom)
const rowTables = computed(() => {
  const tables = []
  const cols = 5
  const gapX = 85
  const startX = 80
  const rowY = [180, 340]
  let n = 1
  rowY.forEach((y) => {
    for (let c = 0; c < cols; c++) {
      tables.push({
        number: n,
        x: startX + c * gapX,
        y,
        // Kursi di atas dan bawah tiap meja
        chairs: [
          { dx: 0, dy: -26 },
          { dx: 0, dy: 26 }
        ]
      })
      n++
    }
  })
  return tables
})

// Denah Ruang Luar: 6 Meja tersebar secara natural di teras
const outdoorTables = computed(() => {
  return [
    { number: 11, x: 130, y: 140, chairs: [{ dx: -26, dy: 0 }, { dx: 26, dy: 0 }] },
    { number: 12, x: 370, y: 140, chairs: [{ dx: -26, dy: 0 }, { dx: 26, dy: 0 }] },
    { number: 13, x: 250, y: 240, chairs: [{ dx: 0, dy: -26 }, { dx: 0, dy: 26 }] },
    { number: 14, x: 130, y: 360, chairs: [{ dx: -26, dy: 0 }, { dx: 26, dy: 0 }] },
    { number: 15, x: 370, y: 360, chairs: [{ dx: -26, dy: 0 }, { dx: 26, dy: 0 }] },
    { number: 16, x: 250, y: 420, chairs: [{ dx: -22, dy: -16 }, { dx: 22, dy: 16 }] }, // Sedikit miring untuk estetika
  ]
})

// Mengambil list meja yang harus di-render saat ini
const activeTables = computed(() => {
  if (activeArea.value === 'outdoor') return outdoorTables.value
  return activeLayout.value === 'circle' ? circleTables.value : rowTables.value
})

const areaLabel = computed(() => areas.find((a) => a.id === activeArea.value)?.label ?? '')

function isOccupied(number) {
  return props.occupied.includes(number)
}

function isSelected(number) {
  return props.modelValue.includes(number)
}

function toggleTable(number) {
  if (isOccupied(number)) return
  const next = isSelected(number)
    ? props.modelValue.filter((n) => n !== number)
    : [...props.modelValue, number]
  emit('update:modelValue', next)
}
</script>

<template>
  <div class="seatmap">
    <div class="seatmap__head">
      <div>
        <h3 class="seatmap__title">Pilih Meja</h3>
        <p class="seatmap__subtitle">
          {{
            modelValue.length
              ? `${modelValue.length} meja dipilih · ${areaLabel}`
              : `Ketuk nomor untuk memilih meja di ${areaLabel.toLowerCase()}`
          }}
        </p>
      </div>
    </div>

    <!-- Area Switch -->
    <div class="seatmap__area-switch" role="tablist" aria-label="Area tempat duduk">
      <button
        v-for="area in areas"
        :key="area.id"
        type="button"
        role="tab"
        class="area-pill"
        :class="{ 'is-active': activeArea === area.id }"
        :aria-selected="activeArea === area.id"
        @click="activeArea = area.id"
      >
        {{ area.label }}
      </button>
    </div>

    <!-- Layout Switch (Indoor Only) -->
    <div v-if="activeArea === 'indoor'" class="seatmap__layout-switch" role="tablist" aria-label="Bentuk denah meja">
      <button
        v-for="layout in layouts"
        :key="layout.id"
        type="button"
        role="tab"
        class="layout-pill"
        :class="{ 'is-active': activeLayout === layout.id }"
        :aria-selected="activeLayout === layout.id"
        @click="activeLayout = layout.id"
      >
        {{ layout.label }}
      </button>
    </div>

    <!-- Papan Denah SVG -->
    <div class="seatmap__board">
      <svg viewBox="0 0 500 500" class="seatmap__svg" role="img" aria-label="Denah meja cafe">
        <defs>
          <filter id="shadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="3" stdDeviation="2.5" flood-color="var(--color-brown-darkest)" flood-opacity="0.12" />
          </filter>
        </defs>

        <!-- ============ RUANG DALAM ============ -->
        <g v-if="activeArea === 'indoor'">
          <!-- Counter barista (tetap di atas) -->
          <g class="barista">
            <rect x="115" y="16" width="270" height="42" rx="14" class="barista__counter" />
            <rect x="150" y="26" width="34" height="22" rx="6" class="barista__machine" />
            <circle cx="230" cy="37" r="9" class="barista__cup" />
            <circle cx="256" cy="37" r="9" class="barista__cup" />
            <circle cx="282" cy="37" r="9" class="barista__cup" />
            <text x="250" y="80" class="barista__label">Counter Barista</text>
          </g>

          <!-- Zona Karpet Abstrak di tengah (Hanya estetika untuk layout melingkar) -->
          <g v-if="activeLayout === 'circle'">
            <path
              d="M 250, 205 C 320, 190 350, 230 340, 295 C 330, 360 290, 390 230, 370 C 170, 350 160, 310 175, 245 C 190, 180 210, 215 250, 205 Z"
              fill="var(--color-cream)"
              opacity="0.6"
            />
            <text x="250" y="295" class="zone-label">AREA TENGAH</text>
          </g>
        </g>

        <!-- ============ RUANG LUAR ============ -->
        <g v-else>
          <!-- Batas teras terbuka & Elemen Dekorasi -->
          <rect x="30" y="30" width="440" height="440" rx="26" class="patio-border" />
          <g class="sun" transform="translate(432, 62)">
            <circle r="16" class="sun__body" />
            <g class="sun__rays">
              <line v-for="a in [0, 45, 90, 135, 180, 225, 270, 315]" :key="a" :transform="`rotate(${a})`" x1="0" y1="22" x2="0" y2="30" />
            </g>
          </g>
          <!-- Tanaman sudut -->
          <g v-for="(pos, i) in [[55,55],[445,55],[55,445],[445,445]]" :key="'plant-'+i" :transform="`translate(${pos[0]},${pos[1]})`" class="plant">
            <path d="M -10 4 C -10 -10 10 -10 10 4 L 6 4 C 6 -4 -6 -4 -10 4 Z" class="plant__leaf" />
            <path d="M -12 4 L 12 4 L 9 16 L -9 16 Z" class="plant__pot" />
          </g>
        </g>

        <!-- ============ RENDER MEJA & KURSI ============ -->
        <g
          v-for="table in activeTables"
          :key="table.number"
          class="table-group"
          :class="{
            'is-selected': isSelected(table.number),
            'is-occupied': isOccupied(table.number),
          }"
          :style="`transform-origin: ${table.x}px ${table.y}px;`"
          tabindex="0"
          role="button"
          :aria-pressed="isSelected(table.number)"
          :aria-label="`Meja nomor ${table.number}${isOccupied(table.number) ? ' (sudah terisi)' : ''}`"
          @click="toggleTable(table.number)"
          @keydown.enter="toggleTable(table.number)"
          @keydown.space.prevent="toggleTable(table.number)"
        >
          <!-- Kursi (Lingkaran kecil di sekitar meja) -->
          <circle
            v-for="(chair, i) in table.chairs"
            :key="'chair-'+i"
            :cx="table.x + chair.dx"
            :cy="table.y + chair.dy"
            r="10"
            class="chair-shape"
          />

          <!-- Meja Utama -->
          <circle
            :cx="table.x"
            :cy="table.y"
            r="22"
            class="table-shape-main"
            :class="{ 'table-shape-main--patio': activeArea === 'outdoor' }"
            filter="url(#shadow)"
          />

          <!-- Nomor Meja -->
          <text
            :x="table.x"
            :y="table.y + 5"
            class="table-number"
            pointer-events="none"
          >
            {{ table.number }}
          </text>
        </g>
      </svg>
    </div>

    <!-- Keterangan (Legend) -->
    <div class="seatmap__legend">
      <span class="legend-item"><i class="legend-dot legend-dot--free"></i> Tersedia</span>
      <span class="legend-item"><i class="legend-dot legend-dot--selected"></i> Dipilih</span>
      <span class="legend-item"><i class="legend-dot legend-dot--occupied"></i> Terisi</span>
    </div>
  </div>
</template>

<style scoped>
/* Variabel Warna Global (jika belum ada di file utama) */
:root {
  --color-cream: #fbf7f3;
  --color-brown-light: #d1bda5;
  --color-brown: #8a6a4b;
  --color-brown-dark: #5c432d;
  --color-brown-darkest: #382718;
  --color-white: #ffffff;
  --color-border: #e6dfd7;
  --color-text-soft: #7a7065;
  --radius-lg: 16px;
  --shadow-card: 0 4px 20px rgba(56, 39, 24, 0.08);
  --font-heading: 'Georgia', serif;
  --font-body: 'Inter', sans-serif;
}

.seatmap {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  padding: 24px;
  box-sizing: border-box;
  width: 100%;
}

.seatmap__head {
  margin-bottom: 14px;
}

.seatmap__title {
  font-size: 20px;
  margin: 0;
  color: var(--color-brown-darkest);
  font-family: var(--font-heading);
}

.seatmap__subtitle {
  margin-top: 4px;
  font-size: 13px;
  color: var(--color-text-soft);
}

/* Tab Area */
.seatmap__area-switch {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.area-pill {
  flex: 1;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1.5px solid var(--color-border);
  background: var(--color-white);
  color: var(--color-brown-darkest);
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.area-pill:hover {
  border-color: var(--color-brown-light);
}

.area-pill.is-active {
  background: var(--color-brown-darkest);
  border-color: var(--color-brown-darkest);
  color: var(--color-white);
}

/* Tab Layout (Indoor) */
.seatmap__layout-switch {
  display: flex;
  gap: 6px;
  background: var(--color-cream);
  padding: 4px;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  width: fit-content;
  margin: 0 auto 12px;
}

.layout-pill {
  padding: 7px 14px;
  border-radius: 999px;
  border: none;
  background: transparent;
  color: var(--color-text-soft);
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.layout-pill:hover {
  color: var(--color-brown-darkest);
}

.layout-pill.is-active {
  background: var(--color-brown-dark);
  color: var(--color-white);
}

.seatmap__board {
  width: 100%;
  max-width: 460px;
  margin: 8px auto 4px;
}

.seatmap__svg {
  width: 100%;
  height: auto;
  display: block;
}

/* =========================================================
   STYLING MEJA & KURSI (GRUP)
   ========================================================= */
.table-group {
  cursor: pointer;
  outline: none;
  /* Animasi saat meja di-hover */
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.table-group:hover:not(.is-occupied) {
  transform: scale(1.08); /* Efek pop-up */
}

/* Meja utama (tengah) */
.table-shape-main {
  fill: var(--color-white);
  stroke: var(--color-brown);
  stroke-width: 2.5;
  transition: fill 0.2s ease, stroke 0.2s ease;
}

/* Varian untuk meja luar agar stroke-nya putus-putus */
.table-shape-main--patio {
  stroke-dasharray: 4 4;
}

/* Kursi-kursi di sekitar meja */
.chair-shape {
  fill: var(--color-cream);
  stroke: var(--color-brown-light);
  stroke-width: 2;
  transition: fill 0.2s ease, stroke 0.2s ease;
}

/* Teks Nomor Meja */
.table-number {
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 700;
  fill: var(--color-brown-darkest);
  text-anchor: middle;
  transition: fill 0.2s ease;
}

/* Interaksi: Hover */
.table-group:hover:not(.is-occupied) .table-shape-main,
.table-group:hover:not(.is-occupied) .chair-shape {
  stroke: var(--color-brown-darkest);
}

/* Interaksi: Dipilih (Selected) */
.table-group.is-selected .table-shape-main {
  fill: var(--color-brown-dark);
  stroke: var(--color-brown-darkest);
}

.table-group.is-selected .chair-shape {
  fill: var(--color-brown);
  stroke: var(--color-brown-darkest);
}

.table-group.is-selected .table-number {
  fill: var(--color-white);
}

/* Interaksi: Terisi (Occupied) */
.table-group.is-occupied {
  cursor: not-allowed;
}

.table-group.is-occupied .table-shape-main,
.table-group.is-occupied .chair-shape {
  fill: var(--color-border);
  stroke: var(--color-text-soft);
}

.table-group.is-occupied .table-number {
  fill: var(--color-text-soft);
}


/* =========================================================
   DEKORASI & LAINNYA
   ========================================================= */
.zone-label {
  font-family: var(--font-heading);
  font-size: 13px;
  font-weight: 600;
  fill: var(--color-brown-light);
  text-anchor: middle;
  letter-spacing: 2px;
}

.barista__counter {
  fill: var(--color-brown-dark);
  stroke: var(--color-brown-darkest);
  stroke-width: 2;
}

.barista__machine {
  fill: var(--color-brown-darkest);
}

.barista__cup {
  fill: var(--color-cream);
  stroke: var(--color-brown-darkest);
  stroke-width: 1.5;
}

.barista__label {
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 700;
  fill: var(--color-text-soft);
  text-anchor: middle;
  letter-spacing: 0.5px;
}

/* Area Teras Luar */
.patio-border {
  fill: none;
  stroke: var(--color-brown-light);
  stroke-width: 2;
  stroke-dasharray: 6 6;
}

.sun__body {
  fill: var(--color-cream);
  stroke: var(--color-brown-light);
  stroke-width: 2;
}

.sun__rays line {
  stroke: var(--color-brown-light);
  stroke-width: 2;
  stroke-linecap: round;
}

.plant__leaf {
  fill: #7c8b6f;
}

.plant__pot {
  fill: var(--color-brown);
}

/* Keterangan (Legend) */
.seatmap__legend {
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 16px;
  font-size: 12.5px;
  color: var(--color-text-soft);
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
  border: 2px solid var(--color-brown);
}

.legend-dot--free {
  background: var(--color-white);
}

.legend-dot--selected {
  background: var(--color-brown-dark);
  border-color: var(--color-brown-darkest);
}

.legend-dot--occupied {
  background: var(--color-border);
  border-color: var(--color-text-soft);
}

/* =========================================================
   RESPONSIVE (MOBILE)
   ========================================================= */
@media (max-width: 480px) {
  .seatmap {
    padding: 16px;
    border-radius: 12px;
  }

  .seatmap__title {
    font-size: 18px;
  }

  .area-pill {
    padding: 8px 10px;
    font-size: 12.5px;
  }

  .layout-pill {
    padding: 6px 12px;
    font-size: 11.5px;
  }

  .seatmap__legend {
    gap: 12px;
    font-size: 11.5px;
  }
}
</style>
