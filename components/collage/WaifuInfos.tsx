import { useQuery } from '@apollo/client';
import { CHARA_DATA_QUERY } from '../../lib/queries';
import { CharaData, CollageFilters, WCItem, WCWaifu } from '../../lib/types';
import { getCharaMedias, getRank } from '../../lib/utils';
import styles from './WaifuInfos.module.scss';

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
    <div className={styles.infos}>
      <CharaName chara={chara} />
      <CharaImage chara={chara} />
      <WaifuCharaProps waifu={waifu} chara={chara} />
      <CharaMedias chara={chara} filters={filters} setFilters={setFilters} />
    </div>
  );
}

function CharaName({ chara }: { chara: CharaData }) {
  return (
    <div className={styles.name}>
      <h1>{chara.name.userPreferred}</h1>
      <h2>{chara.name.native}</h2>
    </div>
  );
}

function CharaImage({ chara }: { chara: CharaData }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={styles.image}
      src={chara.image.large ?? ''}
      alt={chara.name.userPreferred}
      loading="lazy"
      onClick={() => window.open(chara.siteUrl, '_blank')}
      style={{ cursor: 'pointer' }}
    />
  );
}

function WaifuCharaProps({ waifu, chara }: { waifu: WCWaifu, chara: CharaData }) {
  return (
    <>
      <div className={styles.props}>
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
      <div className={styles.modifiers}>
        {waifu.locked && <p>🔒</p>}
        {(waifu.level > 0) && <p>🌟</p>}
        {waifu.nanaed && <p>🌈</p>}
        {waifu.blooded && <p>🩸</p>}
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
    <div className={styles.medias}>
      {seiyuu &&
        <>
          <h2>Character Voice</h2>
          <p>{seiyuu}</p>
        </>}
      {animes &&
        <>
          <h2>Animeography Top 5</h2>
          {animes.slice(0, 5).map(a =>
            <p
              key={a.id}
              onClick={() => setFilters({ ...filters, mediaId: a.id })}
              style={{ cursor: 'pointer' }}
            >
              {a.title.romaji}
            </p>)}
        </>}
      {mangas &&
        <>
          <h2>Mangaography Top 5</h2>
          {mangas.slice(0, 5).map(m =>
            <p
              key={m.id}
              onClick={() => setFilters({ ...filters, mediaId: m.id })}
              style={{ cursor: 'pointer' }}
            >
              {m.title.romaji}
            </p>)}
        </>}
    </div>
  );
}
