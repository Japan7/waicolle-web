import { useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useCollageHotkeys } from "../../lib/hooks";
import { compareCharaFavourites } from "../../lib/utils";
import { CollageFilters } from "../../types/filters";
import { WCCharaData, WCWaifu } from "../../types/waicolle";
import Pic from "./Pic";

function compareTimestamp(a: WCWaifu, b: WCWaifu) {
  if (a.timestamp > b.timestamp) return -1;
  if (a.timestamp < b.timestamp) return 1;
  return 0;
}

export default function WaifuCollage({
  waifus,
  charas,
  filters,
  mediaCharas,
  selected,
  setSelected,
  scrollable,
}: {
  waifus: WCWaifu[];
  charas: { [key: number]: WCCharaData };
  filters: CollageFilters;
  mediaCharas: number[] | null;
  selected: WCWaifu | undefined;
  setSelected: React.Dispatch<React.SetStateAction<WCWaifu | undefined>>;
  scrollable: string;
}) {
  const [pics, setPics] = useState<JSX.Element[]>([]);
  const [shown, setShown] = useState<JSX.Element[]>([]);
  const [setFiltered] = useCollageHotkeys(selected, setSelected, scrollable);

  const isIncluded = useCallback(
    (waifu: WCWaifu) => {
      if (mediaCharas && !mediaCharas.includes(waifu.chara_id)) return false;
      if (
        !charas[waifu.chara_id].image ||
        charas[waifu.chara_id].image!.endsWith("default.jpg")
      )
        return false;

      if (filters.blooded !== waifu.blooded) return false;
      if (!filters.players.includes(waifu.owner)) return false;

      if (filters.ascendedOnly && waifu.level === 0) return false;
      if (filters.unlockedOnly && waifu.locked) return false;
      if (filters.lockedOnly && !waifu.locked) return false;
      if (filters.nanaedOnly && !waifu.nanaed) return false;

      return true;
    },
    [mediaCharas, charas, filters]
  );

  useEffect(() => {
    waifus.sort(
      filters.lasts
        ? compareTimestamp
        : (a, b) =>
            compareCharaFavourites(charas[a.chara_id], charas[b.chara_id])
    );
    const newFiltered = waifus.filter(isIncluded);
    const newPics = newFiltered.map((waifu) => (
      <Pic
        waifu={waifu}
        chara={charas[waifu.chara_id]}
        selected={selected}
        setSelected={setSelected}
        key={waifu.id}
      />
    ));
    setFiltered(newFiltered);
    setPics(newPics);
  }, [
    charas,
    filters.lasts,
    isIncluded,
    selected,
    setFiltered,
    setSelected,
    waifus,
  ]);

  useEffect(() => {
    setShown(pics.slice(0, Math.max(500, shown.length)));
  }, [pics, shown.length]);

  return (
    <InfiniteScroll
      className="flex flex-wrap justify-center"
      dataLength={shown.length}
      next={() => setShown(pics.slice(0, shown.length + 200))}
      hasMore={shown.length < pics.length}
      loader={null}
      scrollThreshold={0.25}
      scrollableTarget={scrollable}
    >
      {shown}
    </InfiniteScroll>
  );
}
