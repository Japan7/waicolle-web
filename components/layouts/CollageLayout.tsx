import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import styles from '../../styles/CollageLayout.module.css';

const client = new ApolloClient({
  uri: 'https://graphql.anilist.co',
  cache: new InMemoryCache()
});

export default function CollageLayout({ page, children }: { page?: string, children: React.ReactNode }) {
  const router = useRouter();
  const { id } = router.query;

  return (
    <ApolloProvider client={client}>
      <div className={"h-screen " + styles.collagegrid}>
        <nav className="w-full p-2 flex space-x-2">
          <Link href={`/${id}/collage`}>
            <a className={page === 'collage' ? styles.selected : styles.button}>Collage</a>
          </Link>
          <Link href={`/${id}/daily`}>
            <a className={page === 'daily' ? styles.selected : styles.button}>Daily tag</a>
          </Link>
          <Link href={`/${id}/pool`}>
            <a className={page === 'pool' ? styles.selected : styles.button}>Character pool</a>
          </Link>
        </nav>

        <main>
          {children}
        </main>
      </div>
    </ApolloProvider>
  );
}
