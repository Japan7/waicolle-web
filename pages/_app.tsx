import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Waifu Collection</title>
        <meta name="description" content="WaiColle companion web app" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo192.png" />
        <meta name="theme-color" content="#956DA6" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="manifest" href="/manifest.json" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Japan7/waicolle-web" />
        <meta property="og:image" content="https://waicolle.yuru.moe/logo512.png" />
      </Head>

      <Component {...pageProps} />
    </>
  );
}
