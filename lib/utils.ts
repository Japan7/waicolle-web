import { useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { BaseCharaData, BaseMediaData, CharaData, CollageFilters, DEFAULT_FILTERS, FILTERS_VERSION, MediaEdge, WCTracklists, WCWaifu } from './types';

export function useLocalStorageFilters(name: string):
  [CollageFilters, React.Dispatch<React.SetStateAction<CollageFilters>>] {

  const [state, setState] = useState<CollageFilters>(DEFAULT_FILTERS);

  useEffect(() => {
    const item = localStorage.getItem(name);
    if (item) {
      const parsed = JSON.parse(item);
      (parsed.version === FILTERS_VERSION) ?
        setState(parsed) : localStorage.removeItem(name);
    }
  }, [name]);

  useEffect(() => {
    localStorage.setItem(name,
      JSON.stringify({ ...state, version: FILTERS_VERSION }));
  }, [name, state]);

  return [state, setState];
}

export function useCollageHotkeys<T>(
  selected: T | undefined,
  setSelected: React.Dispatch<React.SetStateAction<T | undefined>>,
  elementId: string = "collage"
) {
  const [filtered, setFiltered] = useState<T[]>([]);

  useHotkeys(
    "up,down,left,right",
    (handler) => {
      handler.preventDefault();
      const index = filtered.indexOf(selected!);
      const div = document.getElementById(elementId)!;
      const nb_width = Math.floor(div!.offsetWidth / 64);
      switch (handler.key) {
      case "ArrowUp":
        if (index > nb_width) setSelected(filtered[index - nb_width]);
        div.scrollBy(0, -96);
        break;
      case "ArrowDown":
        if (index < filtered.length - nb_width)
          setSelected(filtered[index + nb_width]);
        div.scrollBy(0, 96);
        break;
      case "ArrowLeft":
        if (index > 0) setSelected(filtered[index - 1]);
        break;
      case "ArrowRight":
        if (index < filtered.length - 1) setSelected(filtered[index + 1]);
        break;
      }
    },
    { enabled: selected !== undefined },
    [selected, setSelected]
  );

  return [setFiltered];
}

export function getRank(chara: CharaData) {
  if (chara.favourites >= 10000) return 'SS';
  if (chara.favourites >= 3000) return 'S';
  if (chara.favourites >= 1000) return 'A';
  if (chara.favourites >= 200) return 'B';
  if (chara.favourites >= 20) return 'C';
  if (chara.favourites >= 1) return 'D';
  return 'E';
}

export function compareCharaFavourites(a: BaseCharaData, b: BaseCharaData) {
  if (a.favourites > b.favourites) return -1;
  if (a.favourites < b.favourites) return 1;
  if (a.id > b.id) return -1;
  if (a.id < b.id) return 1;
  return 0;
}

function compareEdges(a: MediaEdge, b: MediaEdge) {
  if (a.characterRole !== 'BACKGROUND' && b.characterRole === 'BACKGROUND') return -1;
  if (a.characterRole === 'BACKGROUND' && b.characterRole !== 'BACKGROUND') return 1;
  return 0;
}

export function getCharaMedias(chara: CharaData) {
  const edges = (chara.media?.edges.slice() ?? []).sort(compareEdges);
  const animes: BaseMediaData[] = [];
  const mangas: BaseMediaData[] = [];
  let seiyuu: string | null = null;

  edges.forEach(e => {
    const node = e.node;
    if (node.type === 'ANIME') {
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

export function getOwners(charaId: number, waifus: WCWaifu[]) {
  const filtered = waifus.filter((waifu) => waifu.chara_id === charaId);
  const alive = filtered.filter((waifu) => !waifu.blooded);

  const owners = new Map<string, any>();
  alive.forEach((waifu) => {
    const owner_dict = owners.get(waifu.owner) ?? {
      unlocked: {
        count: 0,
        ascended: 0,
        double_ascended: 0,
      },
      locked: {
        count: 0,
        ascended: 0,
        double_ascended: 0,
      },
    };
    const locked_str = waifu.locked ? "locked" : "unlocked";
    owner_dict[locked_str].count++;
    if (waifu.level === 1) {
      owner_dict[locked_str].ascended++;
    } else if (waifu.level > 1) {
      owner_dict[locked_str].double_ascended++;
    }
    owners.set(waifu.owner, owner_dict);
  });

  const text: string[] = [];
  owners.forEach((entry, owner) => {
    let subtext = owner;
    let counttext = "";
    const locked = entry.locked;
    if (
      locked.count === 1 &&
      locked.ascended === 0 &&
      locked.double_ascended === 0
    ) {
      counttext += " 🔒";
    } else if (locked.count > 0) {
      counttext += " 🔒(";
      if (locked.double_ascended > 1) {
        counttext += `${locked.double_ascended}`;
      }
      if (locked.double_ascended > 0) {
        counttext += "🌟";
        locked.count -= locked.double_ascended;
        if (locked.count > 0) {
          counttext += "+";
        }
      }
      if (locked.ascended > 1) {
        counttext += `${locked.ascended}`;
      }
      if (locked.ascended > 0) {
        counttext += "⭐";
        locked.count -= locked.ascended;
        if (locked.count > 0) {
          counttext += "+";
        }
      }
      if (locked.count > 0) {
        counttext += `${locked.count}`;
      }
      counttext += ")";
    }

    const unlocked = entry.unlocked;
    if (
      unlocked.count === 1 &&
      unlocked.ascended === 0 &&
      unlocked.double_ascended === 0
    ) {
      counttext += " 🔓";
    } else if (unlocked.count > 0) {
      counttext += " 🔓(";
      if (unlocked.double_ascended > 1) {
        counttext += `${unlocked.double_ascended}`;
      }
      if (unlocked.double_ascended > 0) {
        counttext += "🌟";
        unlocked.count -= unlocked.double_ascended;
        if (unlocked.count > 0) {
          counttext += "+";
        }
      }
      if (unlocked.ascended > 1) {
        counttext += `${unlocked.ascended}`;
      }
      if (unlocked.ascended > 0) {
        counttext += "⭐";
        unlocked.count -= unlocked.ascended;
        if (unlocked.count > 0) {
          counttext += "+";
        }
      }
      if (unlocked.count > 0) {
        counttext += `${unlocked.count}`;
      }
      counttext += ")";
    }

    subtext += counttext;
    if (subtext) text.push(subtext);
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

  if (subtext) text.push(subtext);

  return text;
}

export function getTracklisters(chara: CharaData, tracklists: WCTracklists) {
  const medias = chara.media?.edges.map(e => e.node.id);

  let names: string[] = [];

  tracklists.media.forEach(m => {
    if (medias?.includes(m.media_id)) names.push(m.player);
  });

  Object.values(tracklists.collection).forEach(c =>
    c.medias.forEach(m => {
      if (medias?.includes(m)) names.push(c.player);
    }));

  names = Array.from(new Set(names));
  names.sort((a, b) => a.localeCompare(b, 'fr', { ignorePunctuation: true }));

  return names;
}
