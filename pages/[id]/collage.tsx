import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import React, { useState } from 'react';
import InfosPanel from '../../components/collage/InfosPanel';
import WaifuCollage from '../../components/collage/WaifuCollage';
import WaifuFiltersHeader from '../../components/collage/WaifuFiltersHeader';
import ALApolloLayout from '../../components/layouts/ALApolloLayout';
import { CollageFilters, WCCharaData, WCTracklists, WCWaifu } from '../../lib/types';
import { useLocalStorageState } from '../../lib/utils';
import { WAICOLLE_DATA } from '../api/collage/import';

export async function getServerSideProps(context: any) {
  return {
    props: {
      waifus: WAICOLLE_DATA[context.params.id].waifus,
      charas: WAICOLLE_DATA[context.params.id].charas,
      tracklists: WAICOLLE_DATA[context.params.id].tracklists,
    }
  };
}

export default function Collage({ waifus, charas, tracklists }:
  {
    waifus: WCWaifu[],
    charas: { [key: number]: WCCharaData },
    tracklists: WCTracklists
  }) {

  const defaultFilters = {
    players: [],
    mediaId: null,
    ascendedOnly: false,
    unlockedOnly: false,
    lockedOnly: false,
    nanaedOnly: false,
    blooded: false,
    lasts: false
  };

  const router = useRouter();
  const [filters, setFilters] = useLocalStorageState<CollageFilters>(`collageFilters_${router.query.id}`, defaultFilters);
  const [mediaCharas, setMediaCharas] = useState<number[] | null>(null);
  const [selected, setSelected] = useState<WCWaifu>();

  return (
    <ALApolloLayout>
      <div className="h-screen grid grid-rows-3 grid-flow-col lg:grid-rows-none lg:grid-cols-4 lg:grid-flow-row">
        <Head>
          <title>Collage | Waifu Collection</title>
        </Head>

        <div className="overflow-y-scroll row-span-2 lg:row-span-full lg:col-span-3 flex flex-col">
          <WaifuFiltersHeader
            waifus={waifus}
            filters={filters}
            setFilters={setFilters}
            mediaCharas={mediaCharas}
            setMediaCharas={setMediaCharas}
          />

          {filters.players.length > 0 ?
            <WaifuCollage
              waifus={waifus}
              charas={charas}
              filters={filters}
              mediaCharas={mediaCharas}
              setSelected={setSelected}
            /> :
            <p className="p-2">Choose a player</p>}
        </div>

        <div className="overflow-y-scroll">
          <InfosPanel
            charaId={selected?.chara_id}
            waifu={selected}
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
