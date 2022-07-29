import { BaseCharaData } from "./anilist";

export interface WCWaifusData {
  bot: number;
  waifus: WCWaifu[];
  tracklists: WCTracklists;
  charas: { [key: number]: WCCharaData };
}

export interface WCDailyData {
  bot: number;
  daily: number[];
  charas: { [key: number]: WCCharaData };
}

export interface WCPoolsData {
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
  media: { media_id: number; player: string }[];
  collection: { [key: number]: WCTLCollectionItem };
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
  service: "AniList" | "MyAnimeList";
}
