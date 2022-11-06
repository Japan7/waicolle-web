import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CharaCollage from "../../components/collage/CharaCollage";
import FiltersMenu from "../../components/collage/FiltersMenu";
import InfosPanel from "../../components/collage/InfosPanel";
import CollageLayout from "../../components/layouts/CollageLayout";
import { useLocalStorageFilters } from "../../lib/hooks";
import {
  Chara,
  getPoolsExport,
  getWaifusExport,
  Player,
  Pool,
  Waifu,
} from "../../lib/nanapi-client";

interface PoolProps {
  players: Player[];
  waifus: Waifu[];
  pools: Pool[];
  poolCharas: Chara[];
}

export const getServerSideProps: GetServerSideProps<PoolProps> = async (
  context
) => {
  context.res.setHeader(
    "Cache-Control",
    "public, s-maxage=60, stale-while-revalidate=600"
  );
  const CLIENT_ID = context.query.client_id as string;
  const {
    data: { players, waifus },
  } = await getWaifusExport({ client_id: CLIENT_ID });
  const {
    data: { pools, charas: poolCharas },
  } = await getPoolsExport({ client_id: CLIENT_ID });
  return {
    props: { players, waifus, pools, poolCharas },
  };
};

const Pool: NextPage<PoolProps> = ({ players, waifus, pools, poolCharas }) => {
  const router = useRouter();
  const [filters, setFilters] = useLocalStorageFilters(
    `poolFilters_${router.query.id}`
  );
  const [mediaCharas, setMediaCharas] = useState<number[] | null>(null);
  const [selectedCharas, setSelectedCharas] = useState<Chara[]>([]);
  const [selected, setSelected] = useState<number>();

  useEffect(() => {
    const poolMap = new Map<string, number[]>();
    for (const pool of pools) {
      poolMap.set(pool.discord_id, pool.pool);
    }
    const filteredIds = new Set<number>();
    filters.players.forEach((p) => {
      poolMap.get(p)!.forEach((id) => {
        if (!mediaCharas || mediaCharas.includes(id)) filteredIds.add(id);
      });
    });
    const charasMap = new Map<number, Chara>();
    for (const chara of poolCharas) {
      charasMap.set(chara.id_al, chara);
    }
    const newCharas: Chara[] = [];
    filteredIds.forEach((id) => newCharas.push(charasMap.get(id)!));
    setSelectedCharas(newCharas);
  }, [filters.players, mediaCharas, poolCharas, pools]);

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
          players={players}
          filters={filters}
          setFilters={setFilters}
          mediaCharas={mediaCharas}
          setMediaCharas={setMediaCharas}
        />
      }
      rightPanel={
        <InfosPanel
          players={players}
          charaId={selected}
          waifus={waifus}
          filters={filters}
          setFilters={setFilters}
        />
      }
    />
  );
};

export default Pool;
