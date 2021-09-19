import fs from 'fs';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import ALApolloLayout from '../../components/ALApolloLayout';
import InfosPanel from '../../components/collage/InfosPanel';
import WaifuCollage from '../../components/collage/WaifuCollage';
import WaifuFiltersHeader from '../../components/collage/WaifuFiltersHeader';
import { CollageFilters, FILTERS_VERSION, WCItem } from '../../lib/types';
import { WAICOLLAGE_DATA } from '../api/collage/import';

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
  const [selected, setSelected] = useState<WCItem>();
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
    <ALApolloLayout>
      <div className="h-screen grid grid-rows-3 grid-flow-col lg:grid-rows-none lg:grid-cols-4 lg:grid-flow-row">
        <Head>
          <title>Collage | Waifu Collection</title>
        </Head>

        <div className="overflow-y-scroll row-span-2 lg:row-span-full lg:col-span-3 flex flex-col">
          <WaifuFiltersHeader items={items} filters={filters} setFilters={setFilters} >
            {mediaInfos}
          </WaifuFiltersHeader>

          <WaifuCollage
            items={items}
            filters={filters}
            setSelected={setSelected}
            setMediaInfos={setMediaInfos}
          />
        </div>

        <div className="overflow-y-scroll">
          <InfosPanel
            charaId={selected?.waifu.chara_id}
            waifu={selected?.waifu}
            filters={filters}
            setFilters={setFilters}
          />
        </div>
      </div>
    </ALApolloLayout>
  );
};
