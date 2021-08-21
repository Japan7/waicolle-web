import Link from 'next/link';

export default function MarkdownPage({ children, home }: { children: React.ReactNode, home?: boolean }) {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <header className="text-blue-500 my-4">
        {!home && <Link href="/"><a>← Back to home</a></Link>}
      </header>

      <article className="prose max-w-none">
        {children}
      </article>
    </div>
  );
}
