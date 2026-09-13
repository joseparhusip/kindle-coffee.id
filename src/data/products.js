import affogato from './product/affogato.png'
import americano from './product/americano.png'
import cappuccino from './product/capucino.png'
import chocolateMilk from './product/chocolate-milk.png'
import latte from './product/latte.png'
import longBlack from './product/long-black.png'
import matcha from './product/matcha.png'

export const categories = ['Semua', 'Espresso', 'Signature', 'Non-Kopi']

// Opsi ukuran cup. `extra` adalah selisih harga dari harga dasar (ukuran Medium).
export const sizeOptions = [
  { id: 'S', label: 'Small', extra: -3000 },
  { id: 'M', label: 'Medium', extra: 0 },
  { id: 'L', label: 'Large', extra: 4000 },
]

const rawProducts = [
  {
    id: 'americano',
    name: 'Americano',
    category: 'Espresso',
    description: 'Espresso murni dengan air panas, sederhana dan kuat.',
    price: 18000,
    image: americano,
    featured: true,
  },
  {
    id: 'long-black',
    name: 'Long Black',
    category: 'Espresso',
    description: 'Air panas dituang lebih dulu, menjaga crema espresso tetap utuh.',
    price: 19000,
    image: longBlack,
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    category: 'Espresso',
    description: 'Espresso, susu steam, dan foam tebal nan lembut.',
    price: 23000,
    image: cappuccino,
    featured: true,
  },
  {
    id: 'latte',
    name: 'Latte',
    category: 'Espresso',
    description: 'Espresso dengan susu steam yang halus, lembut di setiap tegukan.',
    price: 25000,
    image: latte,
    featured: true,
  },
  {
    id: 'affogato',
    name: 'Affogato',
    category: 'Signature',
    description: 'Es krim vanilla disiram espresso panas, manis dan pahit berpadu.',
    price: 28000,
    image: affogato,
    featured: true,
  },
  {
    id: 'matcha',
    name: 'Matcha Latte',
    category: 'Non-Kopi',
    description: 'Matcha Jepang premium dengan susu creamy.',
    price: 26000,
    image: matcha,
  },
  {
    id: 'chocolate-milk',
    name: 'Chocolate Milk',
    category: 'Non-Kopi',
    description: 'Cokelat Belgia leleh dipadu susu segar dingin.',
    price: 22000,
    image: chocolateMilk,
  },
]

// Setiap produk otomatis dapat tiga pilihan ukuran (S/M/L) dengan harga
// dasar di atas berlaku untuk ukuran Medium.
export const products = rawProducts.map((product) => ({
  ...product,
  sizes: sizeOptions,
}))

export function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}
