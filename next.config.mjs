/** @type {import('next').NextConfig} */

const SUPPORT_HUB_BASE =
  process.env.NEXT_PUBLIC_SUPPORT_HUB_URL ?? 'https://genomelink-support-hub.vercel.app';

const nextConfig = {
  async redirects() {
    return [
      {
        source: '/help',
        destination: `${SUPPORT_HUB_BASE}/cm-clarity`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
