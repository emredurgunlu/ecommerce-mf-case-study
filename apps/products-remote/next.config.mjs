// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;


// Geliştirme ortamı için CORS çözümü
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)', // tüm route'lar için
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'http://localhost:3000', // host-app
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

