import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import fs from 'fs';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import CollageHeader from '../../components/collage/CollageHeader';
import WaifuCollage from '../../components/collage/WaifuCollage';
import WaifuInfos from '../../components/collage/WaifuInfos';
import { CollageFilters, FILTERS_VERSION, WCItem } from '../../lib/types';
import { WAICOLLAGE_DATA } from '../api/collage/import';

const client = new ApolloClient({
  uri: 'https://graphql.anilist.co',
  cache: new InMemoryCache()
});

export async function getServerSideProps(context: any) {
  const items = context.params.id === 'test' ?
    JSON.parse(fs.readFileSync('./tests/waicolle_export.json', 'utf-8')) :
    WAICOLLAGE_DATA[context.params.id];
  return { props: { items } };
}

export default function Collage({ items }: { items: WCItem[] }) {
  const router = useRouter();

  const defaultFilters = {
    players: null,
    mediaId: null,
    ascendedOnly: false,
    unlockedOnly: false,
    lockedOnly: false,
    nanaedOnly: false,
    blooded: false,
    lasts: false
  };

  const [filters, setFilters] = useState<CollageFilters>(defaultFilters);
  const [selected, setSelected] = useState<WCItem | null>(null);
  const [mediaInfos, setMediaInfos] = useState<React.ReactNode>(null);

  useEffect(() => {
    const itemName = 'collageFilters_' + router.query.id;
    const item = localStorage.getItem(itemName);
    if (item) {
      const parsed = JSON.parse(item);
      (parsed.version == FILTERS_VERSION) ?
        setFilters(parsed) : localStorage.removeItem(itemName);
    }
  }, [router.query.id]);

  useEffect(() => {
    const itemName = 'collageFilters_' + router.query.id;
    localStorage.setItem(itemName,
      JSON.stringify({ ...filters, version: FILTERS_VERSION }));
  }, [filters, router.query.id]);

  return (
    <div className="h-screen overflow-y-hidden grid grid-rows-4 grid-flow-col lg:grid-rows-none lg:grid-cols-4 lg:grid-flow-row">
      <Head>
        <title>Collage | Waifu Collection</title>
      </Head>

      <ApolloProvider client={client}>
        <div className="overflow-y-scroll row-span-3 lg:row-span-full lg:col-span-3 flex flex-col">
          <CollageHeader items={items} filters={filters} setFilters={setFilters} >
            {mediaInfos}
          </CollageHeader>

          <WaifuCollage
            items={items}
            filters={filters}
            setSelected={setSelected}
            setMediaInfos={setMediaInfos}
          />
        </div>

        <div className="overflow-y-scroll">
          <WaifuInfos item={selected} filters={filters} setFilters={setFilters} />
        </div>
      </ApolloProvider>
    </div>
  );
};
