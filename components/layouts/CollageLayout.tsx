import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';

const client = new ApolloClient({
  uri: 'https://graphql.anilist.co',
  cache: new InMemoryCache()
});

export default function CollageLayout({ page, children }: { page: string, children: React.ReactNode }) {
  const router = useRouter();
  const { id } = router.query;

  return (
    <ApolloProvider client={client}>
      <div className="flex flex-col">
        <div className="w-full p-2 flex space-x-2">
          <Link href={`/${id}/collage`}>
            <a className={page === 'collage' ? 'selected' : 'button'}>Collage</a>
          </Link>
          <Link href={`/${id}/daily`}>
            <a className={page === 'daily' ? 'selected' : 'button'}>Daily tag</a>
          </Link>
          <Link href={`/${id}/pool`}>
            <a className={page === 'pool' ? 'selected' : 'button'}>Character pool</a>
          </Link>

          <style jsx>{`
            .selected{
              @apply flex-grow text-center rounded-md bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900;
            }
            .button {
              @apply flex-grow text-center rounded-md border border-gray-400;
            }
          `}</style>
        </div>

        {children}
      </div>
    </ApolloProvider>
  );
}
