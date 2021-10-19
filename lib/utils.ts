import { useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { BaseCharaData, BaseMediaData, CharaData, CollageFilters, DEFAULT_FILTERS, FILTERS_VERSION, MediaEdge, WCTracklists, WCWaifu } from './types';

export function useLocalStorageFilters(name: string):
  [CollageFilters, React.Dispatch<React.SetStateAction<CollageFilters>>] {

  const [state, setState] = useState<CollageFilters>(DEFAULT_FILTERS);

  useEffect(() => {
    const item = localStorage.getItem(name);
    if (item) {
      const parsed = JSON.parse(item);
      (parsed.version == FILTERS_VERSION) ?
        setState(parsed) : localStorage.removeItem(name);
    }
  }, [name]);

  useEffect(() => {
    localStorage.setItem(name,
      JSON.stringify({ ...state, version: FILTERS_VERSION }));
  }, [name, state]);

  return [state, setState];
}

export function useCollageHotkeys<T>(
  selected: T | undefined,
  setSelected: React.Dispatch<React.SetStateAction<T | undefined>>
) {

  const [filtered, setFiltered] = useState<T[]>([]);

  useHotkeys('up,down,left,right', (handler) => {
    const index = filtered.indexOf(selected!);
    const div = document.getElementById('collage');
    const nb_width = Math.floor(div!.offsetWidth / 64);
    switch (handler.key) {
    case 'ArrowUp':
      if (index > nb_width) setSelected(filtered[index - nb_width]);
      break;
    case 'ArrowDown':
      if (index < filtered.length - nb_width) setSelected(filtered[index + nb_width]);
      break;
    case 'ArrowLeft':
      if (index > 0) setSelected(filtered[index - 1]);
      break;
    case 'ArrowRight':
      if (index < filtered.length - 1) setSelected(filtered[index + 1]);
      break;
    }
  }, { enabled: selected !== undefined }, [selected, setSelected]);

  return [setFiltered];
}

export function getRank(chara: CharaData) {
  if (chara.favourites >= 10000) return 'SS';
  if (chara.favourites >= 3000) return 'S';
  if (chara.favourites >= 1000) return 'A';
  if (chara.favourites >= 200) return 'B';
  if (chara.favourites >= 20) return 'C';
  if (chara.favourites >= 1) return 'D';
  return 'E';
}

export function compareCharaFavourites(a: BaseCharaData, b: BaseCharaData) {
  if (a.favourites > b.favourites) return -1;
  if (a.favourites < b.favourites) return 1;
  if (a.id > b.id) return -1;
  if (a.id < b.id) return 1;
  return 0;
}

function compareEdges(a: MediaEdge, b: MediaEdge) {
  if (a.characterRole != 'BACKGROUND' && b.characterRole == 'BACKGROUND') return -1;
  if (a.characterRole == 'BACKGROUND' && b.characterRole != 'BACKGROUND') return 1;
  return 0;
}

export function getCharaMedias(chara: CharaData) {
  const edges = (chara.media?.edges.slice() ?? []).sort(compareEdges);
  const animes: BaseMediaData[] = [];
  const mangas: BaseMediaData[] = [];
  let seiyuu: string | null = null;

  edges.forEach(e => {
    const node = e.node;
    if (node.type == 'ANIME') {
      animes.push(node);
      if (!seiyuu && e.voiceActors.length > 0) {
        const name = e.voiceActors[0].name;
        seiyuu = `${name.userPreferred} (${name.native})`;
      }
    } else {
      mangas.push(node);
    }
  });

  return { seiyuu, animes, mangas };
}

export function getOwners(charaId: number, waifus: WCWaifu[]) {
  const filtered = waifus.filter(waifu => waifu.chara_id === charaId);
  let nbBlooded = 0;
  const alive: WCWaifu[] = [];
  filtered.forEach(waifu => waifu.blooded ? nbBlooded++ : alive.push(waifu));

  const owners: {
    [key: string]: {
      count: number,
      locked: number,
      ascended: number,
      nanaed: number
    }
  } = {};

  alive.forEach(waifu => {
    const entry = owners[waifu.owner] ?? { count: 0, locked: 0, ascended: 0, nanaed: 0 };
    entry.count++;
    if (waifu.locked) entry.locked++;
    if (waifu.level > 0) entry.ascended++;
    if (waifu.nanaed) entry.nanaed++;
    owners[waifu.owner] = entry;
  });

  const names: string[] = [];

  Object.entries(owners).forEach(([name, entry]) => {
    let subtext = name;
    if (entry.count > 1) subtext += ` (x${entry.count})`;

    let modifier = '';
    if (entry.locked === entry.count) modifier += '🔒';
    if (entry.ascended) modifier += '🌟';
    if (entry.nanaed) modifier += '🌈';
    if (modifier) subtext += ` ${modifier}`;

    names.push(subtext);
  });

  names.sort((a, b) => a.localeCompare(b, 'fr', { ignorePunctuation: true }));
  if (nbBlooded > 0) names.push(`🩸 (x${nbBlooded})`);
  return names;
}

export function getTracklisters(chara: CharaData, tracklists: WCTracklists) {
  const medias = chara.media?.edges.map(e => e.node.id);

  let names: string[] = [];

  tracklists.media.forEach(m => {
    if (medias?.includes(m.media_id)) names.push(m.player);
  });

  Object.values(tracklists.collection).forEach(c =>
    c.medias.forEach(m => {
      if (medias?.includes(m)) names.push(c.player);
    }));

  names = Array.from(new Set(names));
  names.sort((a, b) => a.localeCompare(b, 'fr', { ignorePunctuation: true }));

  return names;
}
