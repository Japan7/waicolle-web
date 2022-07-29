import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import { useEffect, useState } from "react";
import CharaCollage from "../../components/collage/CharaCollage";
import InfosPanel from "../../components/collage/InfosPanel";
import PoolFiltersHeader from "../../components/collage/PoolFiltersHeader";
import CollageLayout from "../../components/layouts/CollageLayout";
import { useLocalStorageFilters } from "../../lib/hooks";
import redis from "../../lib/redis";
import {
  WCCharaData,
  WCPools,
  WCTracklists,
  WCWaifu,
  WCWaifus,
} from "../../types";

export async function getServerSideProps(context: any) {
  const key = `wc:${context.query.id}`;
  const resp: any = await redis.json.GET(key, {
    path: [
      ".pools.pools",
      ".pools.charas",
      ".waifus.waifus",
      ".waifus.tracklists",
    ],
  });
  if (!resp) throw new Error("id not found");
  return {
    props: {
      pools: resp[".pools.pools"] as WCPools["pools"],
      charas: resp[".pools.charas"] as WCPools["charas"],
      waifus: resp[".waifus.waifus"] as WCWaifus["waifus"],
      tracklists: resp[".waifus.tracklists"] as WCWaifus["tracklists"],
    },
  };
}

export default function Pool({
  pools,
  charas,
  waifus,
  tracklists,
}: {
  pools: { [key: string]: number[] };
  charas: { [key: number]: WCCharaData };
  waifus: WCWaifu[];
  tracklists: WCTracklists;
}) {
  const router = useRouter();
  const [filters, setFilters] = useLocalStorageFilters(
    `poolFilters_${router.query.id}`
  );
  const [mediaCharas, setMediaCharas] = useState<number[] | null>(null);
  const [selectedCharas, setSelectedCharas] = useState<WCCharaData[]>([]);
  const [selected, setSelected] = useState<number>();

  useEffect(() => {
    const filteredIds = new Set<number>();
    filters.players.forEach((p) => {
      pools[p].forEach((id) => {
        if (!mediaCharas || mediaCharas.includes(id)) filteredIds.add(id);
      });
    });
    const newCharas: WCCharaData[] = [];
    filteredIds.forEach((id) => newCharas.push(charas[id]));
    setSelectedCharas(newCharas);
  }, [charas, filters, mediaCharas, pools]);

  return (
    <CollageLayout page="pool">
      <div className="h-full grid grid-rows-3 grid-flow-col lg:grid-rows-none lg:grid-cols-4 lg:grid-flow-row">
        <Head>
          <title>Character pool | Waifu Collection</title>
        </Head>

        <div className="overflow-hidden row-span-2 lg:row-span-full lg:col-span-3 flex flex-col">
          <PoolFiltersHeader
            pools={pools}
            filters={filters}
            setFilters={setFilters}
            mediaCharas={mediaCharas}
            setMediaCharas={setMediaCharas}
          />
          {filters.players.length > 0 ? (
            <CharaCollage
              charas={selectedCharas}
              selected={selected}
              setSelected={setSelected}
            />
          ) : (
            <p className="p-2">Select a player</p>
          )}
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
    </CollageLayout>
  );
}
