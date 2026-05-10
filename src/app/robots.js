export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/admin/*', '/api', '/api/*'],
    },
    sitemap: 'https://www.alpinepowertools.com/sitemap.xml',
  }
}
