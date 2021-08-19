import { CharaData, MediaEdge } from './types';

export function getRank(chara: CharaData) {
  if (chara.favourites >= 10000) return 'SS';
  if (chara.favourites >= 3000) return 'S';
  if (chara.favourites >= 1000) return 'A';
  if (chara.favourites >= 200) return 'B';
  if (chara.favourites >= 20) return 'C';
  if (chara.favourites >= 1) return 'D';
  return 'E';
}

function compareEdges(a: MediaEdge, b: MediaEdge) {
  if (a.characterRole != 'BACKGROUND' && b.characterRole == 'BACKGROUND') return -1;
  if (a.characterRole == 'BACKGROUND' && b.characterRole != 'BACKGROUND') return 1;
  return 0;
}

export function getCharaMedias(chara: CharaData) {
  const edges = (chara.media?.edges.slice() ?? []).sort(compareEdges);
  const animes: string[] = [];
  const mangas: string[] = [];
  let seiyuu: string | null = null;

  edges.forEach(e => {
    const node = e.node;
    if (node.type == 'ANIME') {
      animes.push(node.title.romaji);
      if (!seiyuu && e.voiceActors.length > 0) {
        const name = e.voiceActors[0].name;
        seiyuu = `${name.userPreferred} (${name.native})`;
      }
    } else {
      mangas.push(node.title.romaji);
    }
  });

  return { seiyuu, animes, mangas };
}
