import { useQuery } from "@apollo/client";
import { CHARA_DATA_QUERY } from "../../lib/gql";
import {
  getCharaMedias,
  getOwners,
  getRank,
  getTracklisters,
} from "../../lib/utils";
import { CharaData } from "../../types/anilist";
import { CollageFilters } from "../../types/filters";
import { WCTracklists, WCWaifu } from "../../types/waicolle";

export default function InfosPanel({
  charaId,
  waifu,
  waifus,
  tracklists,
  filters,
  setFilters,
}: {
  charaId?: number;
  waifu?: WCWaifu;
  waifus: WCWaifu[];
  tracklists?: WCTracklists;
  filters?: CollageFilters;
  setFilters?: React.Dispatch<React.SetStateAction<CollageFilters>>;
}) {
  const { data, loading } = useQuery<{ Character: CharaData }>(
    CHARA_DATA_QUERY,
    {
      skip: !charaId,
      variables: { id: charaId },
    }
  );

  if (!charaId) return <p>Select a character to inspect</p>;
  if (loading || !data) return <p>Loading...</p>;
  return (
    <CharaInfos
      chara={data.Character}
      waifu={waifu}
      waifus={waifus}
      tracklists={tracklists}
      filters={filters}
      setFilters={setFilters}
    />
  );
}

function CharaInfos({
  chara,
  waifu,
  waifus,
  tracklists,
  filters,
  setFilters,
}: {
  chara: CharaData;
  waifu?: WCWaifu;
  waifus: WCWaifu[];
  tracklists?: WCTracklists;
  filters?: CollageFilters;
  setFilters?: React.Dispatch<React.SetStateAction<CollageFilters>>;
}) {
  return (
    <div className="flex flex-col">
      <CharaName chara={chara} />
      <CharaImage chara={chara} />
      <WaifuCharaProps chara={chara} waifu={waifu} />
      <WaifuOwners chara={chara} waifus={waifus} />
      {tracklists && (
        <WaifuTracklisters chara={chara} tracklists={tracklists} />
      )}
      <CharaMedias chara={chara} filters={filters} setFilters={setFilters} />
    </div>
  );
}

function CharaName({ chara }: { chara: CharaData }) {
  return (
    <div className="flex flex-col m-auto">
      <h1 className="m-auto font-bold">{chara.name.userPreferred}</h1>
      <h2 className="m-auto font-bold">{chara.name.native}</h2>
    </div>
  );
}

function CharaImage({ chara }: { chara: CharaData }) {
  return (
    <a
      href={chara.siteUrl}
      target="_blank"
      rel="noreferrer"
      className="block mx-auto my-4 w-2/3 object-contain cursor-pointer"
    >
      <img
        src={chara.image.large ?? ""}
        alt={chara.name.userPreferred}
        loading="lazy"
      />
    </a>
  );
}

function WaifuCharaProps({
  chara,
  waifu,
}: {
  chara: CharaData;
  waifu?: WCWaifu;
}) {
  return (
    <>
      <div className="grid grid-cols-2">
        <h2>ID</h2>
        <p>{chara.id}</p>
        <h2>Favourites</h2>
        <p>
          {chara.favourites} [<b>{getRank(chara)}</b>]
        </p>
        {waifu && (
          <>
            <h2>Owner</h2>
            <p>{waifu.owner}</p>
            <h2>Original owner</h2>
            <p>{waifu.original_owner}</p>
            <h2>Timestamp</h2>
            <p>{waifu.timestamp.slice(0, 16)}</p>
          </>
        )}
      </div>

      {waifu && (
        <div className="flex text-3xl my-2">
          {waifu.locked && <p className="mx-auto">🔒</p>}
          {waifu.level === 1 && <p className="mx-auto">⭐</p>}
          {waifu.level > 1 && <p className="mx-auto">🌟</p>}
          {waifu.nanaed && <p className="mx-auto">🌈</p>}
          {waifu.blooded && <p className="mx-auto">🩸</p>}
        </div>
      )}
    </>
  );
}

function CharaMedias({
  chara,
  filters,
  setFilters,
}: {
  chara: CharaData;
  filters?: CollageFilters;
  setFilters?: React.Dispatch<React.SetStateAction<CollageFilters>>;
}) {
  const { seiyuu, animes, mangas } = getCharaMedias(chara);

  return (
    <div>
      {seiyuu && (
        <>
          <h2 className="my-2 font-bold">Character Voice</h2>
          <p>{seiyuu}</p>
        </>
      )}

      {animes.length > 0 && (
        <>
          <h2 className="my-2 font-bold">Animeography Top 5</h2>
          {animes.slice(0, 5).map((a) => (
            <p
              key={a.id}
              onClick={() => setFilters?.({ ...filters!, mediaId: a.id })}
              className={setFilters && "cursor-pointer"}
            >
              {a.title.romaji}
            </p>
          ))}
        </>
      )}

      {mangas.length > 0 && (
        <>
          <h2 className="my-2 font-bold">Mangaography Top 5</h2>
          {mangas.slice(0, 5).map((m) => (
            <p
              key={m.id}
              onClick={() => setFilters?.({ ...filters!, mediaId: m.id })}
              className={setFilters && "cursor-pointer"}
            >
              {m.title.romaji}
            </p>
          ))}
        </>
      )}
    </div>
  );
}

function WaifuOwners({
  chara,
  waifus,
}: {
  chara: CharaData;
  waifus: WCWaifu[];
}) {
  const names = getOwners(chara.id, waifus);
  return (
    <div>
      {names.length > 0 && (
        <>
          <h2 className="my-2 font-bold">Owned by</h2>
          <p>{names.join(" • ")}</p>
        </>
      )}
    </div>
  );
}

function WaifuTracklisters({
  chara,
  tracklists,
}: {
  chara: CharaData;
  tracklists: WCTracklists;
}) {
  const names = getTracklisters(chara, tracklists);
  return (
    <div>
      {names.length > 0 && (
        <>
          <h2 className="my-2 font-bold">In tracking list of</h2>
          <p>{names.join(" • ")}</p>
        </>
      )}
    </div>
  );
}
