import { useQuery } from '@apollo/client';
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

  const setPlayer = useCallback((player: string | null) =>
    setFilters({ ...filters, player: player }), [filters, setFilters]);

  const setPlayerIsIncluded = useCallback((isIncluded: boolean) =>
    setFilters({ ...filters, playerIsIncluded: isIncluded }), [filters, setFilters]);

  const setCharas = useCallback((charas: number[] | null) =>
    setFilters({ ...filters, charas: charas }), [filters, setFilters]);

  return (
    <div className={styles.header}>
      <UserSelector
        data={data}
        setPlayer={setPlayer}
        playerIsIncluded={filters.playerIsIncluded}
        setPlayerIsIncluded={setPlayerIsIncluded}
      />
      <FiltersSelector filters={filters} setFilters={setFilters} />
      <MediaSelector charas={filters.charas} setCharas={setCharas} />
    </div>
  );
}

function UserSelector({ data, setPlayer, playerIsIncluded, setPlayerIsIncluded }:
  {
    data: WCItem[],
    setPlayer: (player: string | null) => void,
    playerIsIncluded: boolean,
    setPlayerIsIncluded: (isIncluded: boolean) => void
  }) {

  const users: string[] = useMemo(() => {
    const userSet = new Set<string>();
    data.forEach(item => userSet.add(item.waifu.owner));
    return Array.from(userSet).sort((a, b) => a.localeCompare(b));
  }, [data]);

  return (
    <div className={styles.userSelector}>
      <div>
        <input
          type="radio"
          id="include"
          checked={playerIsIncluded}
          onChange={() => setPlayerIsIncluded(true)}
        />
        <label htmlFor="include">Include</label>
      </div>
      <div>
        <input
          type="radio"
          id="exclude"
          checked={!playerIsIncluded}
          onChange={() => setPlayerIsIncluded(false)}
        />
        <label htmlFor="exclude">Exclude</label>
      </div>
      <div>
        <select onChange={e => setPlayer(e.target.value || null)}>
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
          defaultChecked={filters.unlockedOnly}
          onChange={() => setFilters({ ...filters, unlockedOnly: !filters.unlockedOnly })}
        />
        <label htmlFor="unlocked">🔓</label>
      </div>
      <div>
        <input
          type="checkbox"
          id="locked"
          defaultChecked={filters.lockedOnly}
          onChange={() => setFilters({ ...filters, lockedOnly: !filters.lockedOnly })}
        />
        <label htmlFor="locked">🔒</label>
      </div>
      <div>
        <input
          type="checkbox"
          id="ascended"
          defaultChecked={filters.ascendedOnly}
          onChange={() => setFilters({ ...filters, ascendedOnly: !filters.ascendedOnly })}
        />
        <label htmlFor="ascended">🌟</label>
      </div>
      <div>
        <input
          type="checkbox"
          id="nanaed"
          defaultChecked={filters.nanaedOnly}
          onChange={() => setFilters({ ...filters, nanaedOnly: !filters.nanaedOnly })}
        />
        <label htmlFor="nanaed">Nanaed</label>
      </div>
      <div>
        <input
          type="checkbox"
          id="lasts"
          defaultChecked={filters.lasts}
          onChange={() => setFilters({ ...filters, lasts: !filters.lasts })}
        />
        <label htmlFor="lasts">Lasts</label>
      </div>
    </div>
  );
}

function MediaSelector({ charas, setCharas }: { charas: number[] | null, setCharas: (charas: number[] | null) => void }) {
  const [mediaId, setMediaId] = useState<number | null>(null);
  const [charaPage, setCharaPage] = useState<number>(1);

  const { data, error } = useQuery<{ Media: MediaData }>(MEDIA_DATA_QUERY, {
    variables: { id: mediaId, chara_page: charaPage },
    skip: !mediaId,
    onCompleted: data => {
      setCharas([...charas!, ...data.Media.characters.nodes.map(n => n.id)]);
      if (data.Media.characters.pageInfo.hasNextPage) {
        setCharaPage(data.Media.characters.pageInfo.currentPage + 1);
      }
    }
  });

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = Number.isNaN(e.target.valueAsNumber) ? null : e.target.valueAsNumber;
    inputValue ? setCharas([]) : setCharas(null);
    setCharaPage(1);
    setMediaId(inputValue);
  }, [setCharas]);

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
        {error && <label>No media found with this ID</label>}
        {data?.Media &&
          <a href={data?.Media.siteUrl}>
            [{data?.Media.type}] {data?.Media.title.romaji}
          </a>}
      </div>
    </>
  );
}
