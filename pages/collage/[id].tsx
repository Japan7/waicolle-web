import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import fs from 'fs';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import CollageHeader from '../../components/collage/CollageHeader';
import WaifuCollage from '../../components/collage/WaifuCollage';
import WaifuInfos from '../../components/collage/WaifuInfos';
import { CollageFilters, WCItem } from '../../lib/types';
import styles from '../../styles/Collage.module.scss';
import { WAICOLLAGE_DATA } from '../api/collage/import';

const client = new ApolloClient({
  uri: 'https://graphql.anilist.co',
  cache: new InMemoryCache()
});

export async function getServerSideProps(context: any) {
  const data = context.params.id === 'test' ?
    JSON.parse(fs.readFileSync('./tests/collage.json', 'utf-8')) :
    WAICOLLAGE_DATA[context.params.id];
  return { props: { data } };
}

export default function Collage({ data }: { data: WCItem[] }) {
  const defaultFilters = {
    player: null,
    playerIsIncluded: true,
    charas: null,
    ascendedOnly: false,
    unlockedOnly: false,
    lockedOnly: false,
    nanaedOnly: false,
    lasts: false
  };
  const [filters, setFilters] = useState<CollageFilters>(defaultFilters);
  const [selected, setSelected] = useState<WCItem | null>(null);
  const router = useRouter();

  useEffect(() => {
    const item = localStorage.getItem('collageFilters_' + router.query.id);
    if (item) setFilters(JSON.parse(item));
  }, [router.query.id]);

  useEffect(() => {
    localStorage.setItem('collageFilters_' + router.query.id,
      JSON.stringify({ ...filters, charas: null }));
  }, [filters, router.query.id]);

  return (
    <div className={styles.app}>
      <Head>
        <title>Collage | Waifu Collection</title>
      </Head>

      <ApolloProvider client={client}>
        <div className={styles.collage}>
          <CollageHeader data={data} filters={filters} setFilters={setFilters} />
          <WaifuCollage data={data} filters={filters} setSelected={setSelected} />
        </div>
        <div className={styles.infos}>
          <WaifuInfos item={selected} />
        </div>
      </ApolloProvider>

      <style jsx global>{`
        html,
        body,
        #__next {
          height: 100%;
        }
      `}</style>
    </div>
  );
};
