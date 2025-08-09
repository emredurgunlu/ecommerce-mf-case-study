// src/app/api/products/route.js

export async function GET() {
  try {
    const res = await fetch('https://fakestoreapi.com/products')

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
