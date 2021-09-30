/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/:path(collage|daily)',
        destination: '/324820379527020540/:path',
        permanent: true
      },
      {
        source: '/(e?)mails/:slug',
        destination: 'https://japan7.bde.enseeiht.fr/emails/:slug',
        permanent: true
      },
    ];
  },
};
