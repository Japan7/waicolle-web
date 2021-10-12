import Link from 'next/link';
import Live2D from '../Live2D';

export default function PostLayout({ children, home }: { children: React.ReactNode, home?: boolean }) {
  return (
    <div className="prose dark:prose-dark text-justify mx-auto p-4">
      {!home &&
        <header className="my-4">
          <Link href="/"><a>← Back to home</a></Link>
        </header>}

      <article>
        {children}
      </article>

      <Live2D />
    </div>
  );
}
