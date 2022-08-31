import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import CharaCollage from "../../components/collage/CharaCollage";
import InfosPanel from "../../components/collage/InfosPanel";
import PoolFiltersHeader from "../../components/collage/PoolFiltersHeader";
import CollageLayout from "../../components/layouts/CollageLayout";
import { useLocalStorageFilters } from "../../lib/hooks";
import redis from "../../lib/redis";
import { WCCharaData, WCTracklists, WCWaifu } from "../../types/waicolle";

interface PoolProps {
  pools: { [key: string]: number[] };
  charas: { [key: number]: WCCharaData };
  waifus: WCWaifu[];
  tracklists: WCTracklists;
}

export const getServerSideProps: GetServerSideProps<PoolProps> = async (
  context
) => {
  const key = `wc:${context.query.id}`;
  const resp: any = await redis.json.GET(key, {
    path: [
      "$.poolsData.pools",
      "$.poolsData.charas",
      "$.waifusData.waifus.*",
      "$.waifusData.tracklists",
    ],
  });
  if (!resp) throw new Error("id not found");
  return {
    props: {
      pools: resp["$.poolsData.pools"][0],
      charas: resp["$.poolsData.charas"][0],
      waifus: resp["$.waifusData.waifus.*"],
      tracklists: resp["$.waifusData.tracklists"][0],
    },
  };
};

const Pool: NextPage<PoolProps> = ({ pools, charas, waifus, tracklists }) => {
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
    <CollageLayout
      name="Pool"
      main={
        filters.players.length > 0 ? (
          <CharaCollage
            charas={selectedCharas}
            selected={selected}
            setSelected={setSelected}
          />
        ) : (
          <p className="p-2">Select a player</p>
        )
      }
      leftPanel={
        <PoolFiltersHeader
          pools={pools}
          filters={filters}
          setFilters={setFilters}
          mediaCharas={mediaCharas}
          setMediaCharas={setMediaCharas}
        />
      }
      rightPanel={
        <InfosPanel
          charaId={selected}
          waifus={waifus}
          tracklists={tracklists}
          filters={filters}
          setFilters={setFilters}
        />
      }
    />
  );
};

export default Pool;
