/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/:path(collage|daily|pool)",
        destination: "/324820379527020540/:path",
        permanent: true,
      },
      {
        source: "/(e?)mails/:slug",
        destination: "https://japan7.bde.enseeiht.fr/emails/:slug",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
