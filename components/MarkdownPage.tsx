import Head from 'next/head';
import Link from 'next/link';

export default function MarkdownPage({ children, home }: { children: React.ReactNode, home?: boolean }) {
  return (
    <div className="markdown-body">
      <Head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/hyrious/github-markdown-css/github-markdown.css" />
      </Head>

      <header>
        {!home &&
          <Link href="/">
            <a>← Back to home</a>
          </Link>}
      </header>

      <main>
        {children}
      </main>

      <style jsx>{`
        .markdown-body {
          box-sizing: border-box;
          min-width: 200px;
          max-width: 980px;
          margin: 0 auto;
          padding: 45px;
          background-color: unset;
          color: unset;
        }
      
        @media (max-width: 767px) {
          .markdown-body {
            padding: 15px;
          }
        }
      `}</style>
    </div>
  );
}
