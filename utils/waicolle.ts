import type { Player, Waifu } from "~/server/utils/nanapi-client";
import type { CharaData } from "./anilist";

export interface CollageFilters {
  players: string[];
  mediaId?: number;
  ascendedOnly: boolean;
  unlockedOnly: boolean;
  lockedOnly: boolean;
  nanaedOnly: boolean;
  blooded: boolean;
  lasts: boolean;
}

export const DEFAULT_COLLAGE_FILTERS: CollageFilters = {
  players: [],
  mediaId: undefined,
  ascendedOnly: false,
  unlockedOnly: false,
  lockedOnly: false,
  nanaedOnly: false,
  blooded: false,
  lasts: false,
};

export interface TrackedFilters {
  player?: string;
  lasts: boolean;
  hideSingles: boolean;
}

export const DEFAULT_TRACKED_FILTERS: TrackedFilters = {
  player: undefined,
  hideSingles: true,
  lasts: false,
};

export function compareTimestamp(a: Waifu, b: Waifu) {
  if (a.timestamp > b.timestamp) {
    return -1;
  }
  if (a.timestamp < b.timestamp) {
    return 1;
  }
  return 0;
}

function formatOwners(category, category_emoji) {
  let counttext = "";
  if (
    category.count === 1 &&
    category.ascended === 0 &&
    category.double_ascended === 0
  ) {
    counttext += ` ${category_emoji}`;
  } else if (category.count > 0) {
    counttext += ` ${category_emoji}(`;
    if (category.double_ascended > 1) {
      counttext += `${category.double_ascended}`;
    }
    if (category.double_ascended > 0) {
      counttext += "🌟";
      category.count -= category.double_ascended;
      if (category.count > 0) {
        counttext += "+";
      }
    }
    if (category.ascended > 1) {
      counttext += `${category.ascended}`;
    }
    if (category.ascended > 0) {
      counttext += "⭐";
      category.count -= category.ascended;
      if (category.count > 0) {
        counttext += "+";
      }
    }
    if (category.count > 0) {
      counttext += `${category.count}`;
    }
    counttext += ")";
  }
  return counttext;
}

export function getOwners(charaId: number, players: Player[], waifus: Waifu[]) {
  const playerMap = new Map<string, Player>();
  players.forEach((p) => playerMap.set(p.discord_id, p));

  const filtered = waifus.filter((waifu) => waifu.character_id === charaId);
  const alive = filtered.filter((waifu) => !waifu.blooded);

  const owners = new Map<string, any>();
  alive.forEach((waifu) => {
    const owner_dict = owners.get(waifu.owner_discord_id) ?? {
      unlocked: {
        count: 0,
        ascended: 0,
        double_ascended: 0,
        in_trade: 0,
      },
      locked: {
        count: 0,
        ascended: 0,
        double_ascended: 0,
      },
      in_trade: {
        count: 0,
        ascended: 0,
        double_ascended: 0,
      },
    };
    const locked_str = waifu.locked ? "locked" : waifu.trade_locked ? "unlocked" : "in_trade";
    owner_dict[locked_str].count++;
    if (waifu.level === 1) {
      owner_dict[locked_str].ascended++;
    } else if (waifu.level > 1) {
      owner_dict[locked_str].double_ascended++;
    }
    owners.set(waifu.owner_discord_id, owner_dict);
  });

  const text: string[] = [];
  owners.forEach((entry, owner) => {
    let subtext = playerMap.get(owner)!.discord_username;
    let counttext = "";
    const locked = entry.locked;
    counttext += formatOwners(locked, "🔒");

    const unlocked = entry.unlocked;
    counttext += formatOwners(unlocked, "🔓");

    const in_trade = entry.in_trade;
    counttext += formatOwners(in_trade, "🔀");

    subtext += counttext;
    if (subtext) {
      text.push(subtext);
    }
  });

  text.sort((a, b) => a.localeCompare(b, "fr", { ignorePunctuation: true }));

  const blooded = filtered.filter((waifu) => waifu.blooded);
  const blooded_dict = {
    count: 0,
    ascended: 0,
    double_ascended: 0,
  };

  blooded.forEach((waifu) => {
    blooded_dict.count++;
    if (waifu.level === 1) {
      blooded_dict.ascended++;
    }
    if (waifu.level > 1) {
      blooded_dict.double_ascended++;
    }
  });

  let subtext = "";
  if (
    blooded_dict.count === 1 &&
    blooded_dict.ascended === 0 &&
    blooded_dict.double_ascended === 0
  ) {
    subtext += " 🩸";
  } else if (blooded_dict.count > 0) {
    subtext += " 🩸(";
    if (blooded_dict.double_ascended > 1) {
      subtext += `${blooded_dict.double_ascended}`;
    }
    if (blooded_dict.double_ascended > 0) {
      subtext += "🌟";
      blooded_dict.count -= blooded_dict.double_ascended;
      if (blooded_dict.count > 0) {
        subtext += "+";
      }
    }
    if (blooded_dict.ascended > 1) {
      subtext += `${blooded_dict.ascended}`;
    }
    if (blooded_dict.ascended > 0) {
      subtext += "⭐";
      blooded_dict.count -= blooded_dict.ascended;
      if (blooded_dict.count > 0) {
        subtext += "+";
      }
    }
    if (blooded_dict.count > 0) {
      subtext += `${blooded_dict.count}`;
    }
    subtext += ")";
  }

  if (subtext) {
    text.push(subtext);
  }

  return text;
}

export function getTracklisters(chara: CharaData, players: Player[]) {
  let names: string[] = [];

  players.forEach((p) => {
    if (p.tracked.includes(chara.id)) {
      names.push(p.discord_username);
    }
  });

  names = Array.from(new Set(names));
  names.sort((a, b) => a.localeCompare(b, "fr", { ignorePunctuation: true }));

  return names;
}
