import { useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CollageFilters, WCCharaData, WCWaifu } from '../../lib/types';
import { compareCharaFavourites } from '../../lib/utils';

function compareTimestamp(a: WCWaifu, b: WCWaifu) {
  if (a.timestamp > b.timestamp) return -1;
  if (a.timestamp < b.timestamp) return 1;
  return 0;
}

export default function WaifuCollage({ waifus, charas, filters, mediaCharas, setSelected }:
  {
    waifus: WCWaifu[],
    charas: { [key: number]: WCCharaData },
    filters: CollageFilters,
    mediaCharas: number[] | null,
    setSelected: React.Dispatch<React.SetStateAction<WCWaifu | undefined>>
  }) {

  const [pics, setPics] = useState<JSX.Element[]>([]);
  const [shown, setShown] = useState<JSX.Element[]>([]);

  const isIncluded = useCallback((waifu: WCWaifu) => {
    if (mediaCharas && !mediaCharas.includes(waifu.chara_id)) return false;
    if (!charas[waifu.chara_id].image || charas[waifu.chara_id].image!.endsWith('default.jpg')) return false;

    if (filters.blooded != waifu.blooded) return false;
    if (filters.players && !filters.players.includes(waifu.owner)) return false;

    if (filters.ascendedOnly && waifu.level === 0) return false;
    if (filters.unlockedOnly && waifu.locked) return false;
    if (filters.lockedOnly && !waifu.locked) return false;
    if (filters.nanaedOnly && !waifu.nanaed) return false;

    return true;
  }, [mediaCharas, charas, filters]);

  useEffect(() => {
    const newPics: JSX.Element[] = [];
    waifus.sort(filters.lasts ?
      compareTimestamp : (a, b) => compareCharaFavourites(charas[a.chara_id], charas[b.chara_id]));
    waifus.forEach(waifu => {
      if (isIncluded(waifu)) {
        newPics.push(
          <Pic waifu={waifu} chara={charas[waifu.chara_id]} setSelected={setSelected} key={waifu.id} />
        );
      }
    });
    setPics(newPics);
    setShown(newPics.slice(0, 500));
  }, [filters.lasts, isIncluded, waifus, setSelected, charas]);

  return (
    <div className="h-full overflow-scroll" id="collage">
      <InfiniteScroll
        className="flex flex-wrap justify-center"
        dataLength={shown.length}
        next={() => setShown(pics.slice(0, shown.length + 200))}
        hasMore={shown.length < pics.length}
        loader={null}
        scrollThreshold={0.25}
        scrollableTarget="collage"
      >
        {shown}
      </InfiniteScroll>
    </div>
  );
}

function Pic({ waifu, chara, setSelected }:
  {
    waifu: WCWaifu,
    chara: WCCharaData,
    setSelected: React.Dispatch<React.SetStateAction<WCWaifu | undefined>>
  }) {

  const src = `https://s4.anilist.co/file/anilistcdn/character/medium/${chara.image}`;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="w-16 h-24 cursor-pointer object-cover"
      src={src}
      alt={chara.name}
      loading="lazy"
      onClick={() => setSelected(waifu)}
    />
  );
}
