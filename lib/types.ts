// Imported data
export interface WCWaifus {
  bot: number;
  waifus: WCWaifu[];
  tracklists: WCTracklists;
  charas: { [key: number]: WCCharaData };
}

export interface WCDaily {
  bot: number;
  daily: number[];
  charas: { [key: number]: WCCharaData };
}

export interface WCPools {
  bot: number;
  pools: { [key: string]: number[] };
  lists: WCList[];
  charas: { [key: number]: WCCharaData };
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

export interface WCTracklists {
  media: WCTLMedia[];
  collection: { [key: number]: WCTLCollectionItem };
}

export interface WCTLMedia {
  media_id: number;
  player: string;
}

export interface WCCharaData extends BaseCharaData {
  name: string;
  image: string | null;
}


export interface WCTLCollectionItem {
  name: string;
  player: string;
  medias: number[];
}

export interface WCList {
  username: string;
  user: string;
  service: 'AniList' | 'MyAnimeList';
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

// Infos
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
export const FILTERS_VERSION = 4;

export const DEFAULT_FILTERS: CollageFilters = {
  players: [],
  mediaId: null,
  ascendedOnly: false,
  unlockedOnly: false,
  lockedOnly: false,
  nanaedOnly: false,
  blooded: false,
  lasts: false
};

export interface CollageFilters {
  players: string[];
  mediaId: number | null;
  ascendedOnly: boolean;
  unlockedOnly: boolean;
  lockedOnly: boolean;
  nanaedOnly: boolean;
  blooded: boolean;
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
