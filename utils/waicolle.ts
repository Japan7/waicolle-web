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

class WaifuOwnershipTypes {
  contextChar: string;
  simple: number = 0;
  ascended: number = 0;
  doubleAscended: number = 0;

  constructor(context_char: string) {
    this.contextChar = context_char;
  }

  get count(): number {
    return this.simple + this.ascended + this.doubleAscended;
  }

  get hasOwnership(): boolean {
    return this.count > 0;
  }

  toString(): string {
    let out = this.contextChar;
    if (this.count === 1 && this.simple === 1) {
      return out;
    }

    out += "(";

    if (this.doubleAscended > 1) {
      out += `${this.doubleAscended}`;
    }
    if (this.doubleAscended > 0) {
      out += "🌟";

      if (this.ascended || this.simple) {
        out += "+";
      }
    }

    if (this.ascended > 1) {
      out += `${this.ascended}`;
    }
    if (this.ascended > 0) {
      out += "⭐";

      if (this.simple) {
        out += "+";
      }
    }

    if (this.simple && this.count > 1) {
      out += `${this.simple}`;
    }

    out += ")";
    return out;
  }
}

class WaifuOwnership {
  unlocked: WaifuOwnershipTypes = new WaifuOwnershipTypes("🔓");
  locked: WaifuOwnershipTypes = new WaifuOwnershipTypes("🔒");
  in_trade: WaifuOwnershipTypes = new WaifuOwnershipTypes("🔀");
}

export function getOwners(charaId: number, players: Player[], waifus: Waifu[]) {
  const playerMap = new Map<string, Player>();
  players.forEach((p) => playerMap.set(p.discord_id, p));

  const filtered = waifus.filter((waifu) => waifu.character_id === charaId);

  const notBlooded = filtered.filter((waifu) => !waifu.blooded);

  const owners = new Map<string, WaifuOwnership>();

  for (const waifu of notBlooded) {
    const owner = owners.get(waifu.owner_discord_id) || new WaifuOwnership();

    let ownership: WaifuOwnershipTypes;
    if (waifu.trade_locked) {
      ownership = owner.in_trade;
    } else if (waifu.locked) {
      ownership = owner.locked;
    } else {
      ownership = owner.unlocked;
    }

    if (waifu.level === 0) {
      ownership.simple += 1;
    }
    if (waifu.level === 1) {
      ownership.ascended += 1;
    }
    if (waifu.level > 1) {
      ownership.doubleAscended += 1;
    }

    owners.set(waifu.owner_discord_id, owner);
  }

  const text: string[] = [];
  for (const [id, entry] of owners.entries()) {
    let subtext = playerMap.get(id)?.discord_username ?? "";
    if (entry.locked.hasOwnership) {
      subtext += ` ${entry.locked}`;
    }
    if (entry.unlocked.hasOwnership) {
      subtext += ` ${entry.unlocked}`;
    }
    if (entry.in_trade.hasOwnership) {
      subtext += ` ${entry.in_trade}`;
    }

    if (subtext) {
      text.push(subtext);
    }
  }

  text.sort((a, b) => a.localeCompare(b, "fr", { ignorePunctuation: true }));

  const bloodedWaifus = filtered.filter((waifu) => waifu.blooded);

  const blooded = new WaifuOwnershipTypes("🩸");
  for (const bloodedWaifu of bloodedWaifus) {
    if (bloodedWaifu.level === 0) {
      blooded.simple += 1;
    }
    if (bloodedWaifu.level === 1) {
      blooded.ascended += 1;
    }
    if (bloodedWaifu.level > 1) {
      blooded.doubleAscended += 1;
    }
  }

  if (blooded.count) {
    text.push(blooded.toString());
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
