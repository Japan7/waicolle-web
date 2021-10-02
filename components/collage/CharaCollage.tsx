import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { WCCharaData } from '../../lib/types';
import { compareCharaFavourites } from '../../lib/utils';

export default function CharaCollage({ charas, setSelected }:
  {
    charas: WCCharaData[],
    setSelected: React.Dispatch<React.SetStateAction<number | undefined>>,
  }) {

  const [pics, setPics] = useState<JSX.Element[]>([]);
  const [shown, setShown] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const filtered = charas.filter(c => c.image).sort(compareCharaFavourites);
    const newPics = filtered.map(chara => <Pic chara={chara} setSelected={setSelected} key={chara.id} />);
    setPics(newPics);
    setShown(newPics.slice(0, 500));
  }, [charas, setSelected]);

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

function Pic({ chara, setSelected }:
  { chara: WCCharaData, setSelected: React.Dispatch<React.SetStateAction<number | undefined>> }) {

  const src = `https://s4.anilist.co/file/anilistcdn/character/medium/${chara.image!}`;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="w-16 h-24 cursor-pointer object-cover"
      src={src}
      alt={chara.name}
      loading="lazy"
      onClick={_ => setSelected(chara.id)}
    />
  );
}
