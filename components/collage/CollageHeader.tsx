import { useCallback, useMemo } from 'react';
import { CollageFilters, WCItem } from '../../lib/types';
import styles from './CollageHeader.module.scss';

export default function CollageHeader({ items, filters, setFilters, children }:
  {
    items: WCItem[],
    filters: CollageFilters,
    setFilters: React.Dispatch<React.SetStateAction<CollageFilters>>,
    children: React.ReactNode
  }) {

  return (
    <div className={styles.header}>
      <UserSelector items={items} filters={filters} setFilters={setFilters} />
      <FiltersSelector filters={filters} setFilters={setFilters} />
      <MediaSelector filters={filters} setFilters={setFilters} />
      <div className={styles.infos}>{children}</div>
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
    <div className={styles.userSelector}>
      <label>Filter players</label>
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

function FiltersSelector({ filters, setFilters }:
  { filters: CollageFilters, setFilters: React.Dispatch<React.SetStateAction<CollageFilters>> }) {

  return (
    <div className={styles.filtersSelector}>
      <label>Filter by</label>
      <div>
        <input
          type="checkbox"
          id="unlocked"
          checked={filters.unlockedOnly}
          onChange={() => setFilters({ ...filters, unlockedOnly: !filters.unlockedOnly })}
        />
        <label htmlFor="unlocked">🔓 Unlocked</label>
      </div>
      <div>
        <input
          type="checkbox"
          id="locked"
          checked={filters.lockedOnly}
          onChange={() => setFilters({ ...filters, lockedOnly: !filters.lockedOnly })}
        />
        <label htmlFor="locked">🔒 Locked</label>
      </div>
      <div>
        <input
          type="checkbox"
          id="ascended"
          checked={filters.ascendedOnly}
          onChange={() => setFilters({ ...filters, ascendedOnly: !filters.ascendedOnly })}
        />
        <label htmlFor="ascended">🌟 Ascended</label>
      </div>
      <div>
        <input
          type="checkbox"
          id="nanaed"
          checked={filters.nanaedOnly}
          onChange={() => setFilters({ ...filters, nanaedOnly: !filters.nanaedOnly })}
        />
        <label htmlFor="nanaed">🌈 Nanaed</label>
      </div>
      <div>
        <input
          type="checkbox"
          id="blooded"
          checked={filters.blooded}
          onChange={() => setFilters({ ...filters, blooded: !filters.blooded })}
        />
        <label htmlFor="blooded">🩸 Show blooded</label>
      </div>
      <div>
        <input
          type="checkbox"
          id="lasts"
          checked={filters.lasts}
          onChange={() => setFilters({ ...filters, lasts: !filters.lasts })}
        />
        <label htmlFor="lasts">📆 Sort by lasts</label>
      </div>
    </div>
  );
}

function MediaSelector({ filters, setFilters }:
  { filters: CollageFilters, setFilters: React.Dispatch<React.SetStateAction<CollageFilters>> }) {

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const mediaId = Number.isNaN(e.target.valueAsNumber) ? null : e.target.valueAsNumber;
    setFilters({ ...filters, mediaId });
  }, [filters, setFilters]);

  return (
    <div className={styles.mediaSelector}>
      <label>AniList media ID</label>
      <input
        type="number"
        value={filters.mediaId ?? ''}
        onChange={handleChange}
      />
    </div>
  );
}
