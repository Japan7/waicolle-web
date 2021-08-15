import styles from './MarkdownPage.module.scss';

export default function MarkdownPage({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.markdownBody}>
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
    </div>
  );
}
