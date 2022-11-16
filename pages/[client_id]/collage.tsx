import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import FiltersMenu from "../../components/collage/FiltersMenu";
import InfosPanel from "../../components/collage/InfosPanel";
import WaifuCollage from "../../components/collage/WaifuCollage";
import CollageLayout from "../../components/layouts/CollageLayout";
import { useLocalStorageFilters } from "../../lib/hooks";
import { getWaifusExport, Waifu, WaifusExport } from "../../lib/nanapi-client";

export const getServerSideProps: GetServerSideProps<WaifusExport> = async (
  context
) => {
  context.res.setHeader(
    "Cache-Control",
    "public, s-maxage=60, stale-while-revalidate=600"
  );
  const CLIENT_ID = context.query.client_id as string;
  const { data } = await getWaifusExport({ client_id: CLIENT_ID });
  return { props: data };
};

const Collage: NextPage<WaifusExport> = ({ players, waifus, charas }) => {
  const router = useRouter();
  const [filters, setFilters] = useLocalStorageFilters(
    `collageFilters_${router.query.client_id}`
  );
  const [mediaCharas, setMediaCharas] = useState<number[] | null>(null);
  const [selected, setSelected] = useState<Waifu>();

  return (
    <CollageLayout
      name="Collage"
      main={(drawerContentDivId, setRightPanelActive) =>
        filters.players.length > 0 ? (
          <WaifuCollage
            waifus={waifus}
            charas={charas}
            filters={filters}
            mediaCharas={mediaCharas}
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
          charaId={selected?.character_id}
          waifu={selected}
          waifus={waifus}
          filters={filters}
          setFilters={setFilters}
        />
      }
    />
  );
};

export default Collage;
