import { useCallback, useEffect } from 'react';
import { CollageFilters, WCCharaData, WCWaifu } from '../../lib/types';
import { compareCharaFavourites, useCollageScroll } from '../../lib/utils';
import { Pic } from './CharaCollage';

function compareTimestamp(a: WCWaifu, b: WCWaifu) {
  if (a.timestamp > b.timestamp) return -1;
  if (a.timestamp < b.timestamp) return 1;
  return 0;
}

export default function WaifuCollage({ waifus, charas, filters, mediaCharas, selected, setSelected }:
  {
    waifus: WCWaifu[],
    charas: { [key: number]: WCCharaData },
    filters: CollageFilters,
    mediaCharas: number[] | null,
    selected: WCWaifu | undefined,
    setSelected: React.Dispatch<React.SetStateAction<WCWaifu | undefined>>
  }) {

  const [setFiltered, setPics, infScroll] = useCollageScroll(selected, setSelected);

  const isIncluded = useCallback((waifu: WCWaifu) => {
    if (mediaCharas && !mediaCharas.includes(waifu.chara_id)) return false;
    if (!charas[waifu.chara_id].image || charas[waifu.chara_id].image!.endsWith('default.jpg')) return false;

    if (filters.blooded != waifu.blooded) return false;
    if (!filters.players.includes(waifu.owner)) return false;

    if (filters.ascendedOnly && waifu.level === 0) return false;
    if (filters.unlockedOnly && waifu.locked) return false;
    if (filters.lockedOnly && !waifu.locked) return false;
    if (filters.nanaedOnly && !waifu.nanaed) return false;

    return true;
  }, [mediaCharas, charas, filters]);

  useEffect(() => {
    waifus.sort(filters.lasts ? compareTimestamp :
      (a, b) => compareCharaFavourites(charas[a.chara_id], charas[b.chara_id]));
    const newFiltered = waifus.filter(isIncluded);
    const newPics = newFiltered.map(waifu =>
      <Pic
        waifu={waifu}
        chara={charas[waifu.chara_id]}
        selected={selected}
        setSelected={setSelected}
        key={waifu.id}
      />);
    setFiltered(newFiltered);
    setPics(newPics);
  }, [charas, filters.lasts, isIncluded, selected, setFiltered, setPics, setSelected, waifus]);

  return (
    <div className="h-full overflow-scroll" id="collage">
      {infScroll}
    </div>
  );
}
