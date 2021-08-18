import { useLazyQuery } from '@apollo/client';
import { useCallback, useMemo, useState } from 'react';
import { MEDIA_DATA_QUERY } from '../../lib/queries';
import { CollageFilters, MediaData, WCItem } from '../../lib/types';
import styles from './CollageHeader.module.scss';

export default function CollageHeader({ data, filters, setFilters }:
  {
    data: WCItem[],
    filters: CollageFilters,
    setFilters: React.Dispatch<React.SetStateAction<CollageFilters>>
  }) {

  const setCharas = useCallback((charas: number[] | null) =>
    setFilters({ ...filters, charas }), [filters, setFilters]);

  return (
    <div className={styles.header}>
      <UserSelector data={data} filters={filters} setFilters={setFilters} />
      <FiltersSelector filters={filters} setFilters={setFilters} />
      <MediaSelector charas={filters.charas} setCharas={setCharas} />
    </div>
  );
}

function UserSelector({ data, filters, setFilters }:
  {
    data: WCItem[],
    filters: CollageFilters,
    setFilters: React.Dispatch<React.SetStateAction<CollageFilters>>
  }) {

  const users: string[] = useMemo(() => {
    const userSet = new Set<string>();
    data.forEach(item => userSet.add(item.waifu.owner));
    return Array.from(userSet).sort((a, b) => a.localeCompare(b, 'fr', { ignorePunctuation: true }));
  }, [data]);

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

function MediaSelector({ charas, setCharas }:
  { charas: number[] | null, setCharas: (charas: number[] | null) => void }) {

  const [mediaId, setMediaId] = useState<number | null>(null);

  const [getCharas, { data, error }] = useLazyQuery<{ Media: MediaData }>(MEDIA_DATA_QUERY, {
    variables: { id: mediaId },
    onCompleted: data => {
      setCharas([...charas!, ...data.Media.characters.nodes.map(n => n.id)]);
      if (data.Media.characters.pageInfo.hasNextPage) {
        getCharas({ variables: { chara_page: data.Media.characters.pageInfo.currentPage + 1 } });
      }
    }
  });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = Number.isNaN(e.target.valueAsNumber) ? null : e.target.valueAsNumber;
    setMediaId(inputValue);
    if (inputValue) {
      setCharas([]);
      getCharas({ variables: { chara_page: 1 } });
    } else {
      setCharas(null);
    }
  }, [getCharas, setCharas]);

  return (
    <>
      <div className={styles.mediaSelector}>
        <label>AniList media ID</label>
        <input
          type="number"
          onChange={handleChange}
        />
      </div>
      <div className={styles.infos}>
        {mediaId &&
          (data ?
            <a href={data.Media.siteUrl}>[{data.Media.type}] {data.Media.title.romaji}</a> :
            error && <label>No media found with this ID</label>)}
      </div>
    </>
  );
}
