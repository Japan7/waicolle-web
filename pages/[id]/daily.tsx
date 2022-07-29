import Head from "next/head";
import { useState } from "react";
import CharaCollage from "../../components/collage/CharaCollage";
import InfosPanel from "../../components/collage/InfosPanel";
import CollageLayout from "../../components/layouts/CollageLayout";
import redis from "../../lib/redis";
import {
  WCCharaData,
  WCDaily,
  WCTracklists,
  WCWaifu,
  WCWaifus
} from "../../types";

export async function getServerSideProps(context: any) {
  const key = `wc:${context.query.id}`;
  const resp: any = await redis.json.GET(key, {
    path: [
      ".waifus.waifus",
      ".waifus.tracklists",
      ".daily.daily",
      ".daily.charas",
    ],
  });
  if (!resp) throw new Error("id not found");
  const daily = resp[".daily.daily"] as WCDaily["daily"];
  const charas = resp[".daily.charas"] as WCDaily["charas"];
  const reducedCharas = daily.map((id) => charas[id]);
  return {
    props: {
      charas: reducedCharas,
      waifus: resp[".waifus.waifus"] as WCWaifus["waifus"],
      tracklists: resp[".waifus.tracklists"] as WCWaifus["tracklists"],
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
