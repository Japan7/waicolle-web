/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/collage',
        destination: '/collage/324820379527020540',
      },
    ];
  }
};
