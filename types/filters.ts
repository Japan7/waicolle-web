export const FILTERS_VERSION = 4;

export const DEFAULT_FILTERS: CollageFilters = {
  players: [],
  mediaId: null,
  ascendedOnly: false,
  unlockedOnly: false,
  lockedOnly: false,
  nanaedOnly: false,
  blooded: false,
  lasts: false,
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
