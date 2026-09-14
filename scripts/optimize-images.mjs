// scripts/optimize-images.mjs
//
// Resize + compress semua gambar produk & logo secara OTOMATIS, lalu
// simpan versi .webp di folder yang sama (file asli TIDAK dihapus, jadi
// aman kalau mau rollback). Gak perlu buka Photoshop/convert manual satu-satu.
//
// Cara pakai:
//   1. npm install -D sharp fast-glob
//   2. node scripts/optimize-images.mjs
//   3. Ganti import di products.js / komponen dari '.png' -> '.webp'
//      (lihat products.js yang sudah saya siapkan, tinggal pakai itu)
//
// Kenapa WebP: ukurannya jauh lebih kecil dari PNG untuk foto (biasanya
// 70-90% lebih kecil) tapi kualitas visualnya tetap bagus. Ini BUKAN SVG,
// jadi cocok untuk foto produk yang gak bisa direpresentasikan sebagai
// vector.
//
// maxWidth 700 dipilih karena kartu produk paling lebar di desain ini
// ~326px display width. Dikali ~2 untuk layar retina/HDPI = ~650-700px
// sudah lebih dari cukup tajam, tidak perlu 3250px seperti file aslinya.

import sharp from 'sharp'
import fg from 'fast-glob'
import path from 'node:path'
import fs from 'node:fs/promises'

const TARGETS = [
  // [folder yang di-scan, maxWidth output, quality webp]
  { dir: 'src/data/product', maxWidth: 700, quality: 78 },
  { dir: 'src/data/img', maxWidth: 900, quality: 78 },
  { dir: 'src/components/icons', maxWidth: 260, quality: 82 }, // logo-utama.png dll
]

async function optimizeFile(filePath, maxWidth, quality) {
  const ext = path.extname(filePath).toLowerCase()
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) return null

  const outPath = filePath.replace(ext, '.webp')
  const image = sharp(filePath)
  const meta = await image.metadata()

  const shouldResize = meta.width && meta.width > maxWidth

  const pipeline = image.resize({
    width: shouldResize ? maxWidth : meta.width,
    withoutEnlargement: true,
  })

  await pipeline.webp({ quality }).toFile(outPath)

  const [beforeStat, afterStat] = await Promise.all([
    fs.stat(filePath),
    fs.stat(outPath),
  ])

  return {
    file: path.basename(filePath),
    before: beforeStat.size,
    after: afterStat.size,
  }
}

function formatKB(bytes) {
  return `${(bytes / 1024).toFixed(0)} KB`
}

async function run() {
  let totalBefore = 0
  let totalAfter = 0

  for (const { dir, maxWidth, quality } of TARGETS) {
    const files = await fg(`${dir}/**/*.{png,jpg,jpeg}`, { onlyFiles: true })
    if (files.length === 0) continue

    console.log(`\n📁 ${dir} (max ${maxWidth}px, quality ${quality})`)

    for (const file of files) {
      try {
        const result = await optimizeFile(file, maxWidth, quality)
        if (!result) continue
        totalBefore += result.before
        totalAfter += result.after
        const savedPct = (100 - (result.after / result.before) * 100).toFixed(0)
        console.log(
          `  ✓ ${result.file}: ${formatKB(result.before)} → ${formatKB(result.after)} (-${savedPct}%)`,
        )
      } catch (err) {
        console.error(`  ✗ Gagal proses ${file}:`, err.message)
      }
    }
  }

  console.log(
    `\n✅ Selesai. Total: ${formatKB(totalBefore)} → ${formatKB(totalAfter)} (hemat ${formatKB(
      totalBefore - totalAfter,
    )})`,
  )
  console.log('\nFile .webp sudah dibuat di sebelah file .png aslinya.')
  console.log('Langkah selanjutnya: pakai products.js yang sudah diupdate (import .webp),')
  console.log('lalu ganti manual import logo di NavBar.vue & FooterBar.vue ke .webp juga.')
}

run()
