// src/app/api/products/route.js
import { API_CONFIG } from '../../../utils/constants.js'

export async function GET() {
  try {
    const res = await fetch(`${API_CONFIG.BASE_URL}/products`)

    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch products' }), {
        status: 500,
      })
    }

    const data = await res.json()

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    })
  }
}
