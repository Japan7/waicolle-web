import { Chara, Waifu } from "../../lib/nanapi-client";

export default function Pic({
  waifu,
  chara,
  selected,
  setSelected,
}: {
  waifu?: Waifu;
  chara: Chara;
  selected: Waifu | number | undefined;
  setSelected: React.Dispatch<React.SetStateAction<any | undefined>>;
}) {
  const src = `https://s4.anilist.co/file/anilistcdn/character/medium/${chara.image}`;
  const item = waifu ?? chara.id_al;

  return (
    <img
      className={
        "w-16 h-24 cursor-pointer object-cover" +
        (item === selected ? " border-2 border-purple-400" : "")
      }
      src={src}
      alt={chara.id_al.toString()}
      loading="lazy"
      onClick={() => setSelected(item !== selected ? item : undefined)}
    />
  );
}
