import affogato from './product/affogato.png'
import americano from './product/americano.png'
import cappuccino from './product/capucino.png'
import chocolateMilk from './product/chocolate-milk.png'
import latte from './product/latte.png'
import longBlack from './product/long-black.png'
import matcha from './product/matcha.png'

// --- Pastry ---
import butterCroissant from './product/butter-croissant.png'
import cinnamonRoll from './product/cinnamon-roll.png'
import painAuChocolat from './product/pain-au-chocolat.png'
import bananaBread from './product/banana-bread.png'
import cheeseCroissant from './product/cheese-croissant.png'
import smokedBeefSliceCheese from './product/smoked-beef-slice-cheese.png'
import blueberryDanish from './product/blueberry-danish.png'
import almondCroissant from './product/almond-croissant.png'

export const categories = ['Semua', 'Espresso', 'Signature', 'Non-Kopi', 'Pastry']

// Opsi ukuran cup. `extra` adalah selisih harga dari harga dasar (ukuran Medium).
// Hanya dipakai untuk minuman — pastry tidak punya pilihan ukuran.
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

  // --- Pastry (tanpa pilihan ukuran, langsung satu porsi) ---
  {
    id: 'butter-croissant',
    name: 'Butter Croissant',
    category: 'Pastry',
    description: 'Croissant klasik berlapis mentega, renyah di luar dan lembut di dalam.',
    price: 16000,
    image: butterCroissant,
    sizable: false,
    featured: true,
  },
  {
    id: 'cinnamon-roll',
    name: 'Cinnamon Roll',
    category: 'Pastry',
    description: 'Gulungan roti kayu manis empuk dengan lapisan cream cheese frosting.',
    price: 18000,
    image: cinnamonRoll,
    sizable: false,
  },
  {
    id: 'pain-au-chocolat',
    name: 'Pain au Chocolat',
    category: 'Pastry',
    description: 'Pastry berlapis dengan isian cokelat leleh di setiap gigitan.',
    price: 19000,
    image: painAuChocolat,
    sizable: false,
    featured: true,
  },
  {
    id: 'banana-bread',
    name: 'Banana Bread',
    category: 'Pastry',
    description: 'Roti pisang lembut dan moist, dipanggang segar setiap hari.',
    price: 17000,
    image: bananaBread,
    sizable: false,
  },
  {
    id: 'cheese-croissant',
    name: 'Cheese Croissant',
    category: 'Pastry',
    description: 'Croissant mentega dengan isian keju gurih yang meleleh.',
    price: 18500,
    image: cheeseCroissant,
    sizable: false,
  },
  {
    id: 'smoked-beef-slice-cheese',
    name: 'Smoked Beef Slice Cheese',
    category: 'Pastry',
    description: 'Pastry gurih isi smoked beef dan lelehan keju, cocok untuk sarapan.',
    price: 23000,
    image: smokedBeefSliceCheese,
    sizable: false,
  },
  {
    id: 'blueberry-danish',
    name: 'Blueberry Danish',
    category: 'Pastry',
    description: 'Danish pastry renyah dengan selai blueberry asam manis.',
    price: 20000,
    image: blueberryDanish,
    sizable: false,
  },
  {
    id: 'almond-croissant',
    name: 'Almond Croissant',
    category: 'Pastry',
    description: 'Croissant dipanggang dua kali dengan krim almond dan taburan almond panggang.',
    price: 21000,
    image: almondCroissant,
    sizable: false,
  },
]

// Setiap produk minuman otomatis dapat tiga pilihan ukuran (S/M/L) dengan
// harga dasar di atas berlaku untuk ukuran Medium. Produk dengan
// `sizable: false` (mis. pastry) tidak diberi pilihan ukuran sama sekali.
export const products = rawProducts.map((product) => ({
  ...product,
  sizes: product.sizable === false ? [] : sizeOptions,
}))

export function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}
