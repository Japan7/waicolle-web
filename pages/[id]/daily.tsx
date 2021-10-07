import Head from 'next/head';
import React, { useState } from 'react';
import CharaCollage from '../../components/collage/CharaCollage';
import InfosPanel from '../../components/collage/InfosPanel';
import CollageLayout from '../../components/layouts/CollageLayout';
import { WCCharaData, WCTracklists, WCWaifu } from '../../lib/types';
import { IMPORTED_DAILY } from '../api/import/daily';
import { IMPORTED_WAIFUS } from '../api/import/waifus';

export async function getServerSideProps(context: any) {
  const daily = IMPORTED_DAILY[context.params.id].daily;
  const charaDict = IMPORTED_DAILY[context.params.id].charas;
  const charas = daily.map(id => charaDict[id]);

  return {
    props: {
      charas,
      waifus: IMPORTED_WAIFUS[context.params.id].waifus,
      tracklists: IMPORTED_WAIFUS[context.params.id].tracklists,
    }
  };
}

export default function Daily({ charas, waifus, tracklists }:
  { charas: WCCharaData[], waifus: WCWaifu[], tracklists: WCTracklists }) {

  const [selected, setSelected] = useState<number>();

  return (
    <CollageLayout page="daily">
      <div className="h-full grid grid-rows-3 grid-flow-col lg:grid-rows-none lg:grid-cols-4 lg:grid-flow-row">
        <Head>
          <title>Daily tag | Waifu Collection</title>
        </Head>

        <div className="overflow-y-scroll row-span-2 lg:row-span-full lg:col-span-3 flex flex-col">
          <CharaCollage charas={charas} selected={selected} setSelected={setSelected} />
        </div>

        <div className="overflow-y-scroll">
          <InfosPanel charaId={selected} waifus={waifus} tracklists={tracklists} />
        </div>
      </div>
    </CollageLayout>
  );
};
