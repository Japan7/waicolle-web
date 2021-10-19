import { useEffect } from 'react';
import { WCCharaData, WCWaifu } from '../../lib/types';
import { compareCharaFavourites, useCollageScroll } from '../../lib/utils';

export default function CharaCollage({ charas, selected, setSelected }:
  {
    charas: WCCharaData[],
    selected: number | undefined,
    setSelected: React.Dispatch<React.SetStateAction<number | undefined>>,
  }) {

  const [setFiltered, setPics, scrollDiv] = useCollageScroll(selected, setSelected);

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
  }, [charas, selected, setFiltered, setPics, setSelected]);

  return scrollDiv;
}

export function Pic({ waifu, chara, selected, setSelected }:
  {
    waifu?: WCWaifu,
    chara: WCCharaData,
    selected: WCWaifu | number | undefined,
    setSelected: React.Dispatch<React.SetStateAction<any | undefined>>
  }) {

  const src = `https://s4.anilist.co/file/anilistcdn/character/medium/${chara.image}`;
  const item = waifu ?? chara.id;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={'w-16 h-24 cursor-pointer object-cover' + (item === selected ? ' border-2 border-purple-400' : '')}
      src={src}
      alt={chara.name}
      loading="lazy"
      onClick={() => setSelected(item !== selected ? item : undefined)}
    />
  );
}
