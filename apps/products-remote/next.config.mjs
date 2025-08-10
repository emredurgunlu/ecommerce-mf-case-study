// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;


// Geliştirme ve production ortamı için CORS çözümü
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)', // tüm route'lar için
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'production' 
              ? 'https://ecommerce-mf-case-study-host-app.vercel.app'
              : 'http://localhost:3000', // host-app
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, Content-Type, Authorization',
          },
        ],
      },
    ]
  },
}

export default nextConfig;

