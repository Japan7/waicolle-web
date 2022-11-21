import { useCallback, useEffect, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useCollageHotkeys } from "../../lib/hooks";
import { Chara, Waifu } from "../../lib/nanapi-client";
import { compareCharaFavourites } from "../../lib/utils";
import { CollageFilters } from "../../types/filters";
import Pic from "./Pic";

function compareTimestamp(a: Waifu, b: Waifu) {
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
  waifus: Waifu[];
  charas: Chara[];
  filters: CollageFilters;
  mediaCharas: number[] | undefined;
  selected: Waifu | undefined;
  setSelected: React.Dispatch<React.SetStateAction<Waifu | undefined>>;
  scrollable: string;
}) {
  const [pics, setPics] = useState<JSX.Element[]>([]);
  const [shown, setShown] = useState<JSX.Element[]>([]);
  const [setFiltered] = useCollageHotkeys(selected, setSelected, scrollable);

  const charasMap = useMemo(() => {
    const map = new Map<number, Chara>();
    charas.forEach((c) => map.set(c.id_al, c));
    return map;
  }, [charas]);

  const isIncluded = useCallback(
    (waifu: Waifu) => {
      if (mediaCharas && !mediaCharas.includes(waifu.character_id))
        return false;
      if (
        !charasMap.get(waifu.character_id)?.image ||
        charasMap.get(waifu.character_id)?.image!.endsWith("default.jpg")
      )
        return false;

      if (filters.blooded !== waifu.blooded) return false;
      if (filters.player !== waifu.owner_discord_id) return false;

      if (filters.ascendedOnly && waifu.level === 0) return false;
      if (filters.unlockedOnly && waifu.locked) return false;
      if (filters.lockedOnly && !waifu.locked) return false;
      if (filters.nanaedOnly && !waifu.nanaed) return false;

      return true;
    },
    [
      charasMap,
      filters.ascendedOnly,
      filters.blooded,
      filters.lockedOnly,
      filters.nanaedOnly,
      filters.player,
      filters.unlockedOnly,
      mediaCharas,
    ]
  );

  useEffect(() => {
    waifus.sort(
      filters.lasts
        ? compareTimestamp
        : (a, b) =>
            compareCharaFavourites(
              charasMap.get(a.character_id)!,
              charasMap.get(b.character_id)!
            )
    );
    const newFiltered = waifus.filter(isIncluded);
    const newPics = newFiltered.map((waifu) => (
      <Pic
        waifu={waifu}
        chara={charasMap.get(waifu.character_id)!}
        selected={selected}
        setSelected={setSelected}
        key={waifu.id}
      />
    ));
    setFiltered(newFiltered);
    setPics(newPics);
  }, [
    charasMap,
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
      loader={undefined}
      scrollThreshold={0.25}
      scrollableTarget={scrollable}
    >
      {shown}
    </InfiniteScroll>
  );
}
