import { BaseCharaData, BaseMediaData, CharaData, MediaEdge, WCItem, WCTracklists } from './types';

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

export function getOwners(charaId: number, items: WCItem[]) {
  const filtered = items.filter(item => item.waifu.chara_id === charaId);
  let nbBlooded = 0;
  const alive: WCItem[] = [];
  filtered.forEach(item => item.waifu.blooded ? nbBlooded++ : alive.push(item));

  const owners: {
    [key: string]: {
      count: number,
      locked: number,
      ascended: number,
      nanaed: number
    }
  } = {};

  alive.forEach(item => {
    const entry = owners[item.waifu.owner] ?? { count: 0, locked: 0, ascended: 0, nanaed: 0 };
    entry.count++;
    if (item.waifu.locked) entry.locked++;
    if (item.waifu.level > 0) entry.ascended++;
    if (item.waifu.nanaed) entry.nanaed++;
    owners[item.waifu.owner] = entry;
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

  if (nbBlooded > 0) names.push(`🩸 (x${nbBlooded})`);
  return names.join(' • ');
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

  return names.join(' • ');
}
