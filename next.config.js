/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/:path(collage|daily|pool)",
        destination: "/46173f70-583d-11ed-9899-cf2d8ed1d7c3/:path",
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
