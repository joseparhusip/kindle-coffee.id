export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  // Server key sandbox Midtrans. JANGAN pernah taruh ini di kode frontend
  // (src/...) — cuma boleh ada di file server-side seperti ini, karena
  // server key bisa dipakai buat charge transaksi kalau bocor.
  const serverKey = 'SB-Mid-server-3CSG63tAbRvqJ9fp5DoziGRq'
  const base64Key = btoa(serverKey + ':')

  try {
    const response = await fetch('https://app.sandbox.midtrans.com/snap/v1/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Basic ${base64Key}`,
      },
      body: JSON.stringify(req.body),
    })

    const data = await response.json()
    res.status(200).json(data)
  } catch (error) {
    console.error('Midtrans API Error:', error)
    res.status(500).json({ error: 'Gagal memproses ke Midtrans' })
  }
}
