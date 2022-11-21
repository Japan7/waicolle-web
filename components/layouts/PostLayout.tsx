import Link from "next/link";

export default function PostLayout({
  children,
  home,
}: {
  children: React.ReactNode;
  home?: boolean;
}) {
  return (
    <div className="prose text-justify mx-auto p-4">
      {!home && (
        <header className="my-4">
          <Link href="/">← Back to home</Link>
        </header>
      )}

      <article>{children}</article>
    </div>
  );
}
