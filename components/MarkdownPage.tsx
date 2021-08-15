import Head from 'next/head';

export default function MarkdownPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="markdown-body">
      <Head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/hyrious/github-markdown-css/github-markdown.css" />
      </Head>

      {children}

      <style jsx global>{`
        html {
          background-color: #ffffff;
        }

        @media (prefers-color-scheme: dark) {
          html {
            background-color: #0d1117;
          }
        }
      `}</style>

      <style jsx>{`
        .markdown-body {
          box-sizing: border-box;
          min-width: 200px;
          max-width: 980px;
          margin: 0 auto;
          padding: 45px;
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
