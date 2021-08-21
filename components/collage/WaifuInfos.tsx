import { useQuery } from '@apollo/client';
import { CHARA_DATA_QUERY } from '../../lib/queries';
import { CharaData, CollageFilters, WCItem, WCWaifu } from '../../lib/types';
import { getCharaMedias, getRank } from '../../lib/utils';

export default function WaifuInfos({ item, filters, setFilters }:
  {
    item: WCItem | null,
    filters: CollageFilters,
    setFilters: React.Dispatch<React.SetStateAction<CollageFilters>>
  }) {

  const { data, loading } = useQuery<{ Character: CharaData }>(CHARA_DATA_QUERY, {
    skip: !item,
    variables: { id: item?.waifu.chara_id }
  });

  if (!item) return <p>Choose a chara to inspect</p>;
  if (loading || !data) return <p>Loading...</p>;
  return <CharaInfos waifu={item.waifu} chara={data.Character} filters={filters} setFilters={setFilters} />;
}

function CharaInfos({ waifu, chara, filters, setFilters }:
  {
    waifu: WCWaifu,
    chara: CharaData,
    filters: CollageFilters,
    setFilters: React.Dispatch<React.SetStateAction<CollageFilters>>
  }) {

  return (
    <>
      <div className="infos grid p-2">
        <CharaName chara={chara} />
        <CharaImage chara={chara} />
        <WaifuCharaProps waifu={waifu} chara={chara} />
        <CharaMedias chara={chara} filters={filters} setFilters={setFilters} />
      </div>

      <style jsx>{`
        .infos {
          grid-template:
            "name name"
            "image props"
            "image modifiers"
            "medias medias"
            / 1fr 3fr;
        }

        @screen lg {
          .infos {
            grid-template:
              "name"
              "image"
              "props"
              "modifiers"
              "medias";
          }
        }
      `}</style>
    </>
  );
}

function CharaName({ chara }: { chara: CharaData }) {
  return (
    <div className="flex flex-col m-auto" style={{ gridArea: 'name' }}>
      <h1 className="m-auto font-bold">{chara.name.userPreferred}</h1>
      <h2 className="m-auto font-bold">{chara.name.native}</h2>
    </div>
  );
}

function CharaImage({ chara }: { chara: CharaData }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="mx-auto my-4 w-2/3 object-contain cursor-pointer"
      style={{ gridArea: 'image' }}
      src={chara.image.large ?? ''}
      alt={chara.name.userPreferred}
      loading="lazy"
      onClick={() => window.open(chara.siteUrl, '_blank')}
    />
  );
}

function WaifuCharaProps({ waifu, chara }: { waifu: WCWaifu, chara: CharaData }) {
  return (
    <>
      <div className="grid grid-cols-2" style={{ gridArea: 'props' }}>
        <h2>ID</h2>
        <p>{chara.id}</p>
        <h2>Favourites</h2>
        <p>{chara.favourites} [<b>{getRank(chara)}</b>]</p>
        <h2>Owner</h2>
        <p>{waifu.owner}</p>
        <h2>Original owner</h2>
        <p>{waifu.original_owner}</p>
        <h2>Timestamp</h2>
        <p>{waifu.timestamp.slice(0, 16)}</p>
      </div>
      <div className="flex text-3xl my-2" style={{ gridArea: 'modifiers' }}>
        {waifu.locked && <p className="mx-auto">🔒</p>}
        {(waifu.level > 0) && <p className="mx-auto">🌟</p>}
        {waifu.nanaed && <p className="mx-auto">🌈</p>}
        {waifu.blooded && <p className="mx-auto">🩸</p>}
      </div>
    </>
  );
}

function CharaMedias({ chara, filters, setFilters }:
  {
    chara: CharaData,
    filters: CollageFilters,
    setFilters: React.Dispatch<React.SetStateAction<CollageFilters>>
  }) {

  const { seiyuu, animes, mangas } = getCharaMedias(chara);

  return (
    <div style={{ gridArea: 'medias' }}>
      {seiyuu &&
        <>
          <h2 className="my-2 font-bold">Character Voice</h2>
          <p>{seiyuu}</p>
        </>}
      {animes.length > 0 &&
        <>
          <h2 className="my-2 font-bold">Animeography Top 5</h2>
          {animes.slice(0, 5).map(a =>
            <p
              key={a.id}
              onClick={() => setFilters({ ...filters, mediaId: a.id })}
              className="cursor-pointer"
            >
              {a.title.romaji}
            </p>)}
        </>}
      {mangas.length > 0 &&
        <>
          <h2 className="my-2 font-bold">Mangaography Top 5</h2>
          {mangas.slice(0, 5).map(m =>
            <p
              key={m.id}
              onClick={() => setFilters({ ...filters, mediaId: m.id })}
              className="cursor-pointer"
            >
              {m.title.romaji}
            </p>)}
        </>}
    </div>
  );
}
