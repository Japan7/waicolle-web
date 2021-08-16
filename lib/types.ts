// Imported data
export interface WCItem {
  waifu: WCWaifu;
  alchara: WCCharaData;
}

export interface WCWaifu {
  id: number;
  chara_id: number;
  owner: string;
  original_owner: string;
  timestamp: string;
  level: number;
  locked: boolean;
  blooded: boolean;
  nanaed: boolean;
}

export interface WCCharaData extends BaseCharaData {
  name: string;
  image: string | null;
  siteUrl: string;
  favourites: number;
}

// Media filtering
export interface MediaData extends BaseMediaData {
  siteUrl: string;
  characters: CharacterConnection;
}

export interface MediaTitle {
  romaji: string;
}

export interface CharacterConnection {
  pageInfo: PageInfo;
  nodes: BaseCharaData[];
}

export interface PageInfo {
  currentPage: number;
  hasNextPage: boolean;
}

export interface BaseCharaData {
  id: number;
}

// Infos
export interface CharaData extends BaseCharaData {
  name: Name;
  image: CharacterImage;
  description: string | null;
  gender: string | null;
  dateOfBirth: FuzzyDate;
  age: string | null;
  siteUrl: string;
  favourites: number;
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
  characterRole: 'MAIN' | 'SUPPORTING' | 'BACKGROUND'
}

export interface BaseMediaData {
  type: 'ANIME' | 'MANGA';
  id: number;
  title: MediaTitle
}

export interface Staff {
  name: Name;
}

// Filtering
export interface CollageFilters {
  player: string | null,
  playerIsIncluded: boolean,
  charas: number[] | null;
  ascendedOnly: boolean;
  unlockedOnly: boolean;
  lockedOnly: boolean;
  nanaedOnly: boolean;
  lasts: boolean;
}

// Posts
export interface PostData {
  slug: string[];
  contentHtml: string;
  tags: PostTags;
}

export interface PostTags {
  title?: string;
  [key: string]: string | undefined;
}
