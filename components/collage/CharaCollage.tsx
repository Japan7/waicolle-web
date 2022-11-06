import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useCollageHotkeys } from "../../lib/hooks";
import { Chara } from "../../lib/nanapi-client";
import { compareCharaFavourites } from "../../lib/utils";
import Pic from "./Pic";

export default function CharaCollage({
  charas,
  selected,
  setSelected,
  scrollable,
}: {
  charas: Chara[];
  selected: number | undefined;
  setSelected: React.Dispatch<React.SetStateAction<number | undefined>>;
  scrollable: string;
}) {
  const [pics, setPics] = useState<JSX.Element[]>([]);
  const [shown, setShown] = useState<JSX.Element[]>([]);
  const [setFiltered] = useCollageHotkeys(selected, setSelected, scrollable);

  useEffect(() => {
    const newFiltered = charas
      .filter((c) => c.image)
      .sort(compareCharaFavourites);
    const newPics = newFiltered.map((chara) => (
      <Pic
        chara={chara}
        selected={selected}
        setSelected={setSelected}
        key={chara.id_al}
      />
    ));
    setFiltered(newFiltered.map((c) => c.id_al));
    setPics(newPics);
  }, [charas, selected, setFiltered, setPics, setSelected]);

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
