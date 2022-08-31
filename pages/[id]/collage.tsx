import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import InfosPanel from "../../components/collage/InfosPanel";
import WaifuCollage from "../../components/collage/WaifuCollage";
import WaifuFiltersHeader from "../../components/collage/WaifuFiltersHeader";
import CollageLayout from "../../components/layouts/CollageLayout";
import { useLocalStorageFilters } from "../../lib/hooks";
import redis from "../../lib/redis";
import { WCCharaData, WCTracklists, WCWaifu } from "../../types/waicolle";

interface CollageProps {
  waifus: WCWaifu[];
  charas: { [key: number]: WCCharaData };
  tracklists: WCTracklists;
}

export const getServerSideProps: GetServerSideProps<CollageProps> = async (
  context
) => {
  const key = `wc:${context.query.id}`;
  const resp: any = await redis.json.GET(key, {
    path: [
      "$.waifusData.waifus.*",
      "$.waifusData.charas",
      "$.waifusData.tracklists",
    ],
  });
  if (!resp) throw new Error("id not found");
  return {
    props: {
      waifus: resp["$.waifusData.waifus.*"],
      charas: resp["$.waifusData.charas"][0],
      tracklists: resp["$.waifusData.tracklists"][0],
    },
  };
};

const Collage: NextPage<CollageProps> = ({ waifus, charas, tracklists }) => {
  const router = useRouter();
  const [filters, setFilters] = useLocalStorageFilters(
    `collageFilters_${router.query.id}`
  );
  const [mediaCharas, setMediaCharas] = useState<number[] | null>(null);
  const [selected, setSelected] = useState<WCWaifu>();

  return (
    <CollageLayout
      name="Collage"
      main={
        filters.players.length > 0 ? (
          <WaifuCollage
            waifus={waifus}
            charas={charas}
            filters={filters}
            mediaCharas={mediaCharas}
            selected={selected}
            setSelected={setSelected}
          />
        ) : (
          <p className="p-2">Select a player</p>
        )
      }
      leftPanel={
        <WaifuFiltersHeader
          waifus={waifus}
          filters={filters}
          setFilters={setFilters}
          mediaCharas={mediaCharas}
          setMediaCharas={setMediaCharas}
        />
      }
      rightPanel={
        <InfosPanel
          charaId={selected?.chara_id}
          waifu={selected}
          waifus={waifus}
          tracklists={tracklists}
          filters={filters}
          setFilters={setFilters}
        />
      }
    />
  );
};

export default Collage;
