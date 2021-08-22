import { useCallback, useEffect, useMemo, useState } from 'react';
import { CollageFilters, WCItem } from '../../lib/types';

export default function CollageHeader({ items, filters, setFilters, children }:
  {
    items: WCItem[],
    filters: CollageFilters,
    setFilters: React.Dispatch<React.SetStateAction<CollageFilters>>,
    children: React.ReactNode
  }) {

  const [showMenu, setShowMenu] = useState<boolean>(false);

  return (
    <div>
      <button
        className="w-full h-10 opacity-50 lg:hidden"
        onClick={() => setShowMenu(!showMenu)}
      >
        Toggle menu
      </button>

      <div className={`${showMenu ? 'flex' : 'hidden'} lg:flex flex-row flex-wrap my-1`}>
        <FiltersSelector filters={filters} setFilters={setFilters} />
        <UserSelector items={items} filters={filters} setFilters={setFilters} />
        <MediaSelector filters={filters} setFilters={setFilters} />
      </div>

      <div className="w-full flex justify-center">{children}</div>
    </div>
  );
}

function FiltersSelector({ filters, setFilters }:
  { filters: CollageFilters, setFilters: React.Dispatch<React.SetStateAction<CollageFilters>> }) {

  return (
    <div className="w-full grid grid-cols-3 grid-rows-3 lg:w-1/2">
      <label className="col-span-full m-auto">Filters and sort</label>
      <div className="checkbox">
        <input
          type="checkbox"
          id="unlocked"
          checked={filters.unlockedOnly}
          onChange={() => setFilters({ ...filters, unlockedOnly: !filters.unlockedOnly })}
        />
        <label htmlFor="unlocked">🔓 Unlocked</label>
      </div>
      <div className="checkbox">
        <input
          type="checkbox"
          id="locked"
          checked={filters.lockedOnly}
          onChange={() => setFilters({ ...filters, lockedOnly: !filters.lockedOnly })}
        />
        <label htmlFor="locked">🔒 Locked</label>
      </div>
      <div className="checkbox">
        <input
          type="checkbox"
          id="ascended"
          checked={filters.ascendedOnly}
          onChange={() => setFilters({ ...filters, ascendedOnly: !filters.ascendedOnly })}
        />
        <label htmlFor="ascended">🌟 Ascended</label>
      </div>
      <div className="checkbox">
        <input
          type="checkbox"
          id="nanaed"
          checked={filters.nanaedOnly}
          onChange={() => setFilters({ ...filters, nanaedOnly: !filters.nanaedOnly })}
        />
        <label htmlFor="nanaed">🌈 Nanaed</label>
      </div>
      <div className="checkbox">
        <input
          type="checkbox"
          id="blooded"
          checked={filters.blooded}
          onChange={() => setFilters({ ...filters, blooded: !filters.blooded })}
        />
        <label htmlFor="blooded">🩸 Show blooded</label>
      </div>
      <div className="checkbox">
        <input
          type="checkbox"
          id="lasts"
          checked={filters.lasts}
          onChange={() => setFilters({ ...filters, lasts: !filters.lasts })}
        />
        <label htmlFor="lasts">📆 Sort by lasts</label>
      </div>

      <style jsx>{`
        .checkbox {
          @apply m-auto flex flex-col items-center lg:flex-row;
          * {
            @apply cursor-pointer mx-0.5;
          }
        }
      `}</style>
    </div>
  );
}

function UserSelector({ items, filters, setFilters }:
  {
    items: WCItem[],
    filters: CollageFilters,
    setFilters: React.Dispatch<React.SetStateAction<CollageFilters>>
  }) {

  const users: string[] = useMemo(() => {
    const userSet = new Set<string>();
    items.forEach(item => userSet.add(item.waifu.owner));
    return Array.from(userSet).sort((a, b) => a.localeCompare(b, 'fr', { ignorePunctuation: true }));
  }, [items]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    let players: string[] | null = Array.from(e.target.selectedOptions, option => option.value);
    if (players.length == users.length) players = null;
    setFilters({ ...filters, players });
  }, [filters, setFilters, users.length]);

  return (
    <div className="w-1/2 m-auto flex flex-col items-center lg:w-1/4">
      <label>Players</label>
      <select
        multiple
        value={filters.players ?? users}
        onChange={handleChange}
      >
        {users.map(user => <option value={user} key={user}>{user}</option>)}
      </select>
    </div >
  );
}

function MediaSelector({ filters, setFilters }:
  { filters: CollageFilters, setFilters: React.Dispatch<React.SetStateAction<CollageFilters>> }) {

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const mediaId = Number.isNaN(e.target.valueAsNumber) ? null : e.target.valueAsNumber;
    setFilters({ ...filters, mediaId });
  }, [filters, setFilters]);

  return (
    <div className="w-1/2 m-auto flex flex-col items-center lg:w-1/4">
      <label>AniList media ID</label>
      <input
        type="number"
        value={filters.mediaId ?? ''}
        onChange={handleChange}
      />
    </div>
  );
}
