import type { Chara } from "~/server/utils/nanapi-client";

export interface MediaData extends BaseMediaData {
  siteUrl: string;
  characters: CharacterConnection;
}

export interface MediaTitle {
  romaji: string;
}

export interface CharacterConnection {
  pageInfo: PageInfo;
  nodes: { id: number }[];
}

export interface PageInfo {
  currentPage: number;
  hasNextPage: boolean;
}

export interface BaseCharaData {
  id: number;
  favourites: number;
}

export interface CharaData extends BaseCharaData {
  name: Name;
  image: CharacterImage;
  description: string | null;
  gender: string | null;
  dateOfBirth: FuzzyDate;
  age: string | null;
  siteUrl: string;
  media: MediaConnection | null;
}

export interface Name {
  userPreferred: string;
  native: string | null;
}

export interface CharacterImage {
  large: string | null;
}

export interface FuzzyDate {
  year: number | null;
  month: number | null;
  day: number | null;
}

export interface MediaConnection {
  edges: MediaEdge[];
}

export interface MediaEdge {
  node: BaseMediaData;
  voiceActors: Staff[];
  characterRole: "MAIN" | "SUPPORTING" | "BACKGROUND";
}

export interface BaseMediaData {
  type: "ANIME" | "MANGA";
  id: number;
  title: MediaTitle;
}

export interface Staff {
  name: Name;
}

export function getRank(chara: CharaData) {
  if (chara.favourites >= 3000) {
    return "S";
  }
  if (chara.favourites >= 1000) {
    return "A";
  }
  if (chara.favourites >= 200) {
    return "B";
  }
  if (chara.favourites >= 20) {
    return "C";
  }
  if (chara.favourites >= 1) {
    return "D";
  }
  return "E";
}

export function compareCharaFavourites(a: Chara, b: Chara) {
  if (a.favourites > b.favourites) {
    return -1;
  }
  if (a.favourites < b.favourites) {
    return 1;
  }
  if (a.id_al > b.id_al) {
    return -1;
  }
  if (a.id_al < b.id_al) {
    return 1;
  }
  return 0;
}

function compareEdges(a: MediaEdge, b: MediaEdge) {
  if (a.characterRole !== "BACKGROUND" && b.characterRole === "BACKGROUND") {
    return -1;
  }
  if (a.characterRole === "BACKGROUND" && b.characterRole !== "BACKGROUND") {
    return 1;
  }
  return 0;
}

export function getCharaMedias(chara: CharaData) {
  const edges = (chara.media?.edges.slice() ?? []).sort(compareEdges);
  const animes: BaseMediaData[] = [];
  const mangas: BaseMediaData[] = [];
  let seiyuu: string | null = null;

  edges.forEach((e) => {
    const node = e.node;
    if (node.type === "ANIME") {
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
