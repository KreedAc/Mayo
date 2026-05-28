/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.jmenu.it' },
    ],
  },
}

export default nextConfig
