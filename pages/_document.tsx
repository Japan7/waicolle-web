import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="description" content="WaiColle companion web app" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/logo192.png" />
          <meta name="theme-color" content="#956DA6" />
          <link rel="manifest" href="/manifest.json" />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="Japan7/waicolle-web" />
          <meta
            property="og:image"
            content="https://waicolle.yuru.moe/logo512.png"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
