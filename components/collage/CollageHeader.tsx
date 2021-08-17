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

  const setPlayer = useCallback((player: string | null) =>
    setFilters({ ...filters, player }), [filters, setFilters]);

  const setPlayerIsIncluded = useCallback((playerIsIncluded: boolean) =>
    setFilters({ ...filters, playerIsIncluded }), [filters, setFilters]);

  return (
    <div className={styles.userSelector}>
      <div>
        <input
          type="radio"
          id="include"
          checked={filters.playerIsIncluded}
          onChange={() => setPlayerIsIncluded(true)}
        />
        <label htmlFor="include">Include</label>
      </div>
      <div>
        <input
          type="radio"
          id="exclude"
          checked={!filters.playerIsIncluded}
          onChange={() => setPlayerIsIncluded(false)}
        />
        <label htmlFor="exclude">Exclude</label>
      </div>
      <div>
        <select value={filters.player ?? ''} onChange={e => setPlayer(e.target.value || null)} >
          <option value="">All players</option>
          {users.map(user =>
            <option value={user} key={user}>{user}</option>)}
        </select>
      </div>
    </div >
  );
}

function FiltersSelector({ filters, setFilters }:
  { filters: CollageFilters, setFilters: React.Dispatch<React.SetStateAction<CollageFilters>> }) {

  return (
    <div className={styles.filtersSelector}>
      <div>
        <input
          type="checkbox"
          id="unlocked"
          checked={filters.unlockedOnly}
          onChange={() => setFilters({ ...filters, unlockedOnly: !filters.unlockedOnly })}
        />
        <label htmlFor="unlocked">🔓</label>
      </div>
      <div>
        <input
          type="checkbox"
          id="locked"
          checked={filters.lockedOnly}
          onChange={() => setFilters({ ...filters, lockedOnly: !filters.lockedOnly })}
        />
        <label htmlFor="locked">🔒</label>
      </div>
      <div>
        <input
          type="checkbox"
          id="ascended"
          checked={filters.ascendedOnly}
          onChange={() => setFilters({ ...filters, ascendedOnly: !filters.ascendedOnly })}
        />
        <label htmlFor="ascended">🌟</label>
      </div>
      <div>
        <input
          type="checkbox"
          id="nanaed"
          checked={filters.nanaedOnly}
          onChange={() => setFilters({ ...filters, nanaedOnly: !filters.nanaedOnly })}
        />
        <label htmlFor="nanaed">Nanaed</label>
      </div>
      <div>
        <input
          type="checkbox"
          id="lasts"
          checked={filters.lasts}
          onChange={() => setFilters({ ...filters, lasts: !filters.lasts })}
        />
        <label htmlFor="lasts">Lasts</label>
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

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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
          onChange={onChange}
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
