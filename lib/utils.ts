import { BaseCharaData, BaseMediaData, CharaData, MediaEdge } from './types';

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
