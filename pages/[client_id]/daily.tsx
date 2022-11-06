import { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import CharaCollage from "../../components/collage/CharaCollage";
import InfosPanel from "../../components/collage/InfosPanel";
import CollageLayout from "../../components/layouts/CollageLayout";
import {
  DailyExport,
  getDailyExport,
  getWaifusExport,
  Player,
  Waifu,
} from "../../lib/nanapi-client";

interface DailyProps {
  players: Player[];
  waifus: Waifu[];
  dailyCharas: DailyExport;
}

export const getServerSideProps: GetServerSideProps<DailyProps> = async (
  context
) => {
  context.res.setHeader(
    "Cache-Control",
    "public, s-maxage=60, stale-while-revalidate=600"
  );
  const CLIENT_ID = context.query.client_id as string;
  const {
    data: { players, waifus },
  } = await getWaifusExport({
    client_id: CLIENT_ID,
  });
  const { data: dailyCharas } = await getDailyExport({});
  return {
    props: { players, waifus, dailyCharas },
  };
};

const Daily: NextPage<DailyProps> = ({ players, waifus, dailyCharas }) => {
  const [selected, setSelected] = useState<number>();

  return (
    <CollageLayout
      name="Daily"
      main={(drawerContentDivId, setRightPanelActive) => (
        <CharaCollage
          charas={dailyCharas}
          selected={selected}
          setSelected={(w) => {
            setSelected(w);
            setRightPanelActive(true);
          }}
          scrollable={drawerContentDivId}
        />
      )}
      rightPanel={
        <InfosPanel players={players} charaId={selected} waifus={waifus} />
      }
    />
  );
};

export default Daily;
