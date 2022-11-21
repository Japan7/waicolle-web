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
  description?: string;
  gender?: string;
  dateOfBirth: FuzzyDate;
  age?: string;
  siteUrl: string;
  media: MediaConnection;
}

export interface Name {
  userPreferred: string;
  native?: string;
}

export interface CharacterImage {
  large?: string;
}

export interface FuzzyDate {
  year?: number;
  month?: number;
  day?: number;
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
