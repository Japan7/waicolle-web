import { useQuery } from '@apollo/client';
import { CHARA_DATA_QUERY } from '../../lib/queries';
import { CharaData, WCItem, WCWaifu } from '../../lib/types';
import { getRank } from '../../lib/utils';
import styles from './WaifuInfos.module.scss';

export default function WaifuInfos({ item }: { item: WCItem | null }) {
  const { data, loading } = useQuery<{ Character: CharaData }>(CHARA_DATA_QUERY, {
    skip: !item,
    variables: { id: item?.waifu.chara_id }
  });

  if (!item) return <p>Choose a chara to inspect</p>;
  if (loading || !data) return <p>Loading...</p>;
  return <CharaInfos waifu={item.waifu} chara={data.Character} />;
}

function CharaInfos({ waifu, chara }: { waifu: WCWaifu, chara: CharaData }) {
  return (
    <div className={styles.infos}>
      <CharaName chara={chara} />
      <CharaImage chara={chara} />
      <WaifuProps waifu={waifu} />
      <CharaProps chara={chara} />
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
    <div className={styles.image}>
      <a href={chara.siteUrl} target="_blank" rel="noreferrer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={chara.image.large ?? ''}
          alt={chara.name.userPreferred}
          loading="lazy"
        />
      </a>
    </div>
  );
}

function WaifuProps({ waifu }: { waifu: WCWaifu }) {
  return (
    <>
      <div className={styles.waifu}>
        <h2>Owner</h2>
        <p>{waifu.owner}</p>
        <h2>Original owner</h2>
        <p>{waifu.original_owner}</p>
        <h2>Timestamp</h2>
        <p>{waifu.timestamp.slice(0, 16)}</p>
      </div>
      <div className={styles.modifiers}>
        <p>{waifu.locked && '🔒'}</p>
        {(waifu.level > 0) && <p>🌟</p>}
      </div>
    </>
  );
}

function CharaProps({ chara }: { chara: CharaData }) {
  return (
    <div className={styles.chara}>
      <h2>ID</h2>
      <p>{chara.id}</p>
      <h2>Favourites</h2>
      <p>{chara.favourites} [<b>{getRank(chara)}</b>]</p>
    </div>
  );
}
