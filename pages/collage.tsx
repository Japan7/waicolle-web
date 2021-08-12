import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { useEffect, useState } from 'react';
import CollageHeader from '../components/collage/CollageHeader';
import WaifuCollage from '../components/collage/WaifuCollage';
import WaifuInfos from '../components/collage/WaifuInfos';
import { CollageFilters, WCItem } from '../lib/types';
import styles from '../styles/Collage.module.css';

const client = new ApolloClient({
  uri: 'https://graphql.anilist.co',
  cache: new InMemoryCache()
});

export default function Collage() {
  const [data, setData] = useState<WCItem[]>([]);
  const [filters, setFilters] = useState<CollageFilters>({
    player: null,
    playerIsIncluded: true,
    charas: null,
    ascendedOnly: false,
    unlockedOnly: false,
    lockedOnly: false,
    nanaedOnly: false,
    lasts: false
  });
  const [selected, setSelected] = useState<WCItem | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get('data');
    if (data) fetch(data).then(resp => resp.json()).then(newData => setData(newData));
  }, []);

  return (
    <ApolloProvider client={client}>
      <div className={styles.app}>
        <div className={styles.collage}>
          <CollageHeader
            data={data}
            filters={filters}
            setFilters={setFilters}
          />
          <WaifuCollage
            data={data}
            filters={filters}
            setSelected={setSelected}
          />
        </div>
        <div className={styles.infos}>
          <WaifuInfos item={selected} />
        </div>
        <style jsx global>{`
          html,
          body,
          #__next {
            height: 100%;
            background-color: black;
            color: white;
          }
      `}</style>
      </div>
    </ApolloProvider>
  );
};
