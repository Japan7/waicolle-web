import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import React, { useState } from 'react';
import InfosPanel from '../../components/collage/InfosPanel';
import WaifuCollage from '../../components/collage/WaifuCollage';
import WaifuFiltersHeader from '../../components/collage/WaifuFiltersHeader';
import CollageLayout from '../../components/layouts/CollageLayout';
import { WCCharaData, WCTracklists, WCWaifu } from '../../lib/types';
import { useLocalStorageFilters } from '../../lib/utils';
import { IMPORTED_WAIFUS } from '../api/import/waifus';

export async function getServerSideProps(context: any) {
  return {
    props: {
      waifus: IMPORTED_WAIFUS[context.params.id].waifus,
      charas: IMPORTED_WAIFUS[context.params.id].charas,
      tracklists: IMPORTED_WAIFUS[context.params.id].tracklists,
    }
  };
}

export default function Collage({ waifus, charas, tracklists }:
  {
    waifus: WCWaifu[],
    charas: { [key: number]: WCCharaData },
    tracklists: WCTracklists
  }) {

  const router = useRouter();
  const [filters, setFilters] = useLocalStorageFilters(`collageFilters_${router.query.id}`);
  const [mediaCharas, setMediaCharas] = useState<number[] | null>(null);
  const [selected, setSelected] = useState<WCWaifu>();

  return (
    <CollageLayout page="collage">
      <div className="h-full grid grid-rows-3 grid-flow-col lg:grid-rows-none lg:grid-cols-4 lg:grid-flow-row">
        <Head>
          <title>Collage | Waifu Collection</title>
        </Head>

        <div className="overflow-y-hidden row-span-2 lg:row-span-full lg:col-span-3 flex flex-col">
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
              selected={selected}
              setSelected={setSelected}
            /> :
            <p className="p-2">Select a player</p>}
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
    </CollageLayout>
  );
};
