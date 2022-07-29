import Head from "next/head";
import { useState } from "react";
import CharaCollage from "../../components/collage/CharaCollage";
import InfosPanel from "../../components/collage/InfosPanel";
import CollageLayout from "../../components/layouts/CollageLayout";
import redis from "../../lib/redis";
import {
  WCCharaData,
  WCDailyData,
  WCTracklists,
  WCWaifu,
  WCWaifusData,
} from "../../types/waicolle";

export async function getServerSideProps(context: any) {
  const key = `wc:${context.query.id}`;
  const resp: any = await redis.json.GET(key, {
    path: [
      ".waifusData.waifus",
      ".waifusData.tracklists",
      ".dailyData.daily",
      ".dailyData.charas",
    ],
  });
  if (!resp) throw new Error("id not found");
  const daily = resp[".dailyData.daily"] as WCDailyData["daily"];
  const charas = resp[".dailyData.charas"] as WCDailyData["charas"];
  const reducedCharas = daily.map((id) => charas[id]);
  return {
    props: {
      charas: reducedCharas,
      waifus: resp[".waifusData.waifus"] as WCWaifusData["waifus"],
      tracklists: resp[".waifusData.tracklists"] as WCWaifusData["tracklists"],
    },
  };
}

export default function Daily({
  charas,
  waifus,
  tracklists,
}: {
  charas: WCCharaData[];
  waifus: WCWaifu[];
  tracklists: WCTracklists;
}) {
  const [selected, setSelected] = useState<number>();

  return (
    <CollageLayout page="daily">
      <div className="h-full grid grid-rows-3 grid-flow-col lg:grid-rows-none lg:grid-cols-4 lg:grid-flow-row">
        <Head>
          <title>Daily tag | Waifu Collection</title>
        </Head>

        <div className="overflow-hidden row-span-2 lg:row-span-full lg:col-span-3 flex flex-col">
          <CharaCollage
            charas={charas}
            selected={selected}
            setSelected={setSelected}
          />
        </div>

        <div className="overflow-y-scroll">
          <InfosPanel
            charaId={selected}
            waifus={waifus}
            tracklists={tracklists}
          />
        </div>
      </div>
    </CollageLayout>
  );
}
