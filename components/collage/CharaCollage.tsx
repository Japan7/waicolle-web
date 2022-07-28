import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useCollageHotkeys } from "../../lib/hooks";
import { compareCharaFavourites } from "../../lib/utils";
import { WCCharaData, WCWaifu } from "../../types";

export default function CharaCollage({
  charas,
  selected,
  setSelected,
}: {
  charas: WCCharaData[];
  selected: number | undefined;
  setSelected: React.Dispatch<React.SetStateAction<number | undefined>>;
}) {
  const [pics, setPics] = useState<JSX.Element[]>([]);
  const [shown, setShown] = useState<JSX.Element[]>([]);
  const [setFiltered] = useCollageHotkeys(selected, setSelected, "collage");

  useEffect(() => {
    const newFiltered = charas
      .filter((c) => c.image)
      .sort(compareCharaFavourites);
    const newPics = newFiltered.map((chara) => (
      <Pic
        chara={chara}
        selected={selected}
        setSelected={setSelected}
        key={chara.id}
      />
    ));
    setFiltered(newFiltered.map((c) => c.id));
    setPics(newPics);
  }, [charas, selected, setFiltered, setPics, setSelected]);

  useEffect(() => {
    setShown(pics.slice(0, Math.max(500, shown.length)));
  }, [pics, shown.length]);

  return (
    <div className="h-full overflow-y-scroll" id="collage">
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

export function Pic({
  waifu,
  chara,
  selected,
  setSelected,
}: {
  waifu?: WCWaifu;
  chara: WCCharaData;
  selected: WCWaifu | number | undefined;
  setSelected: React.Dispatch<React.SetStateAction<any | undefined>>;
}) {
  const src = `https://s4.anilist.co/file/anilistcdn/character/medium/${chara.image}`;
  const item = waifu ?? chara.id;

  return (
    <img
      className={
        "w-16 h-24 cursor-pointer object-cover" +
        (item === selected ? " border-2 border-purple-400" : "")
      }
      src={src}
      alt={chara.name}
      loading="lazy"
      onClick={() => setSelected(item !== selected ? item : undefined)}
    />
  );
}
