// src/app/api/products/route.js
import { APP_CONFIG } from '../../../utils/constants.js'

const BASE_URL = process.env.API_URL || 'https://fakestoreapi.com'

export async function GET() {
  try {

    const res = await fetch(`${BASE_URL}/products`);

    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch products' }), {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production'
            ? APP_CONFIG.HOST_URL
            : 'http://localhost:3000',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization',
        }
      });
    }

    const data = await res.json();
    console.log('process.env.NODE_ENV:', process.env.NODE_ENV) // ← bunu ekle
    console.log('APP_CONFIG.HOST_URL', process.env.NODE_ENV) // ← bunu ekle
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production'
          ? APP_CONFIG.HOST_URL
          : 'http://localhost:3000',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization',
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production'
          ? APP_CONFIG.HOST_URL
          : 'http://localhost:3000',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization',
      }
    });
  }
}

