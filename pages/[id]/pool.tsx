import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import CharaCollage from '../../components/collage/CharaCollage';
import InfosPanel from '../../components/collage/InfosPanel';
import PoolFiltersHeader from '../../components/collage/PoolFiltersHeader';
import ALApolloLayout from '../../components/layouts/ALApolloLayout';
import { BaseFilters, WCCharaData, WCTracklists, WCWaifu } from '../../lib/types';
import { useLocalStorageState } from '../../lib/utils';
import { WAICOLLE_DATA } from '../api/collage/import';

export async function getServerSideProps(context: any) {
  return {
    props: {
      pools: WAICOLLE_DATA[context.params.id].pools,
      charas: WAICOLLE_DATA[context.params.id].charas,
      waifus: WAICOLLE_DATA[context.params.id].waifus,
      tracklists: WAICOLLE_DATA[context.params.id].tracklists,
    }
  };
}

export default function Pool({ pools, charas, waifus, tracklists }:
  {
    pools: { [key: string]: number[] },
    charas: { [key: number]: WCCharaData },
    waifus: WCWaifu[],
    tracklists: WCTracklists
  }) {

  const defaultFilters = {
    players: null,
    mediaId: null,
  };

  const router = useRouter();
  const [filters, setFilters] = useLocalStorageState<BaseFilters>(`poolFilters_${router.query.id}`, defaultFilters);
  const [mediaCharas, setMediaCharas] = useState<number[] | null>(null);
  const [selectedCharas, setSelectedCharas] = useState<WCCharaData[]>([]);
  const [selected, setSelected] = useState<number>();

  useEffect(() => {
    const filteredIds = new Set<number>();
    filters.players?.forEach(p => {
      pools[p].forEach(id => {
        if (!mediaCharas || mediaCharas.includes(id)) filteredIds.add(id);
      });
    });
    const newCharas: WCCharaData[] = [];
    filteredIds.forEach(id => newCharas.push(charas[id]));
    setSelectedCharas(newCharas);
  }, [charas, filters, mediaCharas, pools]);

  return (
    <ALApolloLayout>
      <div className="h-screen grid grid-rows-3 grid-flow-col lg:grid-rows-none lg:grid-cols-4 lg:grid-flow-row">
        <Head>
          <title>Character pool | Waifu Collection</title>
        </Head>

        <div className="overflow-y-scroll row-span-2 lg:row-span-full lg:col-span-3 flex flex-col">
          <PoolFiltersHeader
            pools={pools}
            filters={filters}
            setFilters={setFilters}
            mediaCharas={mediaCharas}
            setMediaCharas={setMediaCharas}
          />

          <CharaCollage charas={selectedCharas} setSelected={setSelected} />
        </div>

        <div className="overflow-y-scroll">
          <InfosPanel
            charaId={selected}
            waifus={waifus}
            tracklists={tracklists}
            filters={filters}
            setFilters={setFilters}
          />
        </div>
      </div>
    </ALApolloLayout>
  );
};
