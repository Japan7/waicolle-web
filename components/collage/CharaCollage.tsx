import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { WCCharaData } from '../../lib/types';
import { compareCharaFavourites, useCollageHotkeys } from '../../lib/utils';

export default function CharaCollage({ charas, selected, setSelected }:
  {
    charas: WCCharaData[],
    selected: number | undefined,
    setSelected: React.Dispatch<React.SetStateAction<number | undefined>>,
  }) {

  const [filtered, setFiltered] = useState<number[]>([]);
  const [pics, setPics] = useState<JSX.Element[]>([]);
  const [shown, setShown] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const newFiltered = charas.filter(c => c.image).sort(compareCharaFavourites);
    const newPics = newFiltered.map(chara =>
      <Pic
        chara={chara}
        selected={selected}
        setSelected={setSelected}
        key={chara.id}
      />);
    setFiltered(newFiltered.map(c => c.id));
    setPics(newPics);
    setShown(newPics.slice(0, 500));
  }, [charas, selected, setSelected]);

  useCollageHotkeys(filtered, selected, setSelected);

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

function Pic({ chara, selected, setSelected }:
  {
    chara: WCCharaData,
    selected: number | undefined,
    setSelected: React.Dispatch<React.SetStateAction<number | undefined>>
  }) {

  const src = `https://s4.anilist.co/file/anilistcdn/character/medium/${chara.image!}`;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={'w-16 h-24 cursor-pointer object-cover' + (chara.id === selected && ' border-2 border-purple-400')}
      src={src}
      alt={chara.name}
      loading="lazy"
      onClick={_ => setSelected(chara.id !== selected ? chara.id : undefined)}
    />
  );
}
