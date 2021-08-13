import { useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CollageFilters, WCItem } from '../../lib/types';
import styles from './WaifuCollage.module.scss';

function sortFavourites(a: WCItem, b: WCItem) {
  if (a.alchara.favourites > b.alchara.favourites) return -1;
  if (a.alchara.favourites < b.alchara.favourites) return 1;
  if (a.alchara.id > b.alchara.id) return -1;
  if (a.alchara.id < b.alchara.id) return 1;
  return 0;
}

function sortLasts(a: WCItem, b: WCItem) {
  if (a.waifu.timestamp > b.waifu.timestamp) return -1;
  if (a.waifu.timestamp < b.waifu.timestamp) return 1;
  return 0;
}

export default function WaifuCollage({ data, filters, setSelected }:
  {
    data: WCItem[],
    filters: CollageFilters,
    setSelected: React.Dispatch<React.SetStateAction<WCItem | null>>
  }) {

  const [pics, setPics] = useState<JSX.Element[]>([]);
  const [shown, setShown] = useState<JSX.Element[]>([]);

  const isIncluded = useCallback((item: WCItem) => {
    if (item.waifu.blooded) return false;

    if (filters.playerIsIncluded) {
      if (filters.player && filters.player !== item.waifu.owner) return false;
    } else {
      if (!filters.player || filters.player === item.waifu.owner) return false;
    }

    if (filters.charas && !filters.charas.includes(item.alchara.id)) return false;

    if (!item.alchara.image || item.alchara.image.endsWith('default.jpg')) return false;

    if (filters.ascendedOnly && item.waifu.level === 0) return false;
    if (filters.unlockedOnly && item.waifu.locked) return false;
    if (filters.lockedOnly && !item.waifu.locked) return false;
    if (filters.nanaedOnly && !item.waifu.nanaed) return false;

    return true;
  }, [filters]);

  useEffect(() => {
    const newPics: JSX.Element[] = [];
    data.sort(filters.lasts ? sortLasts : sortFavourites);
    data.forEach(item => {
      if (isIncluded(item)) {
        newPics.push(
          <Pic item={item} setSelected={setSelected} key={item.waifu.id} />
        );
      }
    });
    setPics(newPics);
    setShown(newPics.slice(0, 200));
  }, [data, filters, isIncluded, setSelected]);

  useEffect(() => {
    document.getElementById("collage")?.dispatchEvent(new MouseEvent('scroll'));
  }, [shown.length]);

  return (
    <div className={styles.collageDiv} id="collage">
      <InfiniteScroll
        className={styles.collage}
        dataLength={shown.length}
        next={() => setShown(pics.slice(0, shown.length + 200))}
        hasMore={shown.length < pics.length}
        loader={null}
        scrollThreshold={0.5}
        scrollableTarget="collage"
      >
        {shown}
      </InfiniteScroll>
    </div>
  );
}

function Pic({ item, setSelected }:
  { item: WCItem, setSelected: React.Dispatch<React.SetStateAction<WCItem | null>> }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={styles.chara}
      src={item.alchara.image!}
      alt={item.alchara.name}
      loading="lazy"
      onClick={() => setSelected(item)}
    />
  );
}
