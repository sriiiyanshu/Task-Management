/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true, // This effectively makes /login your homepage
      },
    ];
  },
};

module.exports = nextConfig;