import Head from 'next/head';
import React, { useState } from 'react';
import CharaCollage from '../../components/collage/CharaCollage';
import InfosPanel from '../../components/collage/InfosPanel';
import ALApolloLayout from '../../components/layouts/ALApolloLayout';
import { WCCharaData } from '../../lib/types';
import { WAICOLLE_DATA } from '../api/collage/import';

export async function getServerSideProps(context: any) {
  return {
    props: {
      charas: WAICOLLE_DATA[context.params.id].daily
    }
  };
}

export default function Tags({ charas }: { charas: WCCharaData[] }) {
  const [selected, setSelected] = useState<number>();

  return (
    <ALApolloLayout>
      <div className="h-screen grid grid-rows-3 grid-flow-col lg:grid-rows-none lg:grid-cols-4 lg:grid-flow-row">
        <Head>
          <title>Daily tag | Waifu Collection</title>
        </Head>

        <div className="overflow-y-scroll row-span-2 lg:row-span-full lg:col-span-3 flex flex-col">
          <CharaCollage charas={charas} setSelected={setSelected} />
        </div>

        <div className="overflow-y-scroll">
          <InfosPanel charaId={selected} />
        </div>
      </div>
    </ALApolloLayout>
  );
};
