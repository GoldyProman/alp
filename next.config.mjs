/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'alppower.vercel.app' }],
        destination: 'https://www.alpinepowertools.com/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'alppower.netlify.app' }],
        destination: 'https://www.alpinepowertools.com/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'alpine123.netlify.app' }],
        destination: 'https://www.alpinepowertools.com/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'alpinepowertools.com' }],
        destination: 'https://www.alpinepowertools.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
