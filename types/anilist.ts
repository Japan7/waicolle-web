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
