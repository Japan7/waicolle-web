import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { useEffect, useMemo, useState } from "react";
import CharaCollage from "../../components/collage/CharaCollage";
import FiltersMenu from "../../components/collage/FiltersMenu";
import InfosPanel from "../../components/collage/InfosPanel";
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

  const users: string[] = useMemo(() => {
    return Array.from(Object.keys(pools)).sort((a, b) =>
      a.localeCompare(b, "fr", { ignorePunctuation: true })
    );
  }, [pools]);

  return (
    <CollageLayout
      name="Pool"
      main={(drawerContentDivId, setRightPanelActive) =>
        filters.players.length > 0 ? (
          <CharaCollage
            charas={selectedCharas}
            selected={selected}
            setSelected={(w) => {
              setSelected(w);
              setRightPanelActive(true);
            }}
            scrollable={drawerContentDivId}
          />
        ) : (
          <p className="p-2">Select a player</p>
        )
      }
      leftMenu={
        <FiltersMenu
          users={users}
          filters={filters}
          setFilters={setFilters}
          mediaCharas={mediaCharas}
          setMediaCharas={setMediaCharas}
          withoutFiltersSelector
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
