import { useLazyQuery } from '@apollo/client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MEDIA_DATA_QUERY } from '../../lib/queries';
import { BaseFilters, CollageFilters, MediaData, WCWaifu } from '../../lib/types';

export default function WaifuFiltersHeader({waifus, filters, setFilters, mediaCharas, setMediaCharas}:
  {
    waifus: WCWaifu[],
    filters: CollageFilters,
    setFilters: React.Dispatch<React.SetStateAction<CollageFilters>>,
    mediaCharas: number[] | null,
    setMediaCharas: React.Dispatch<React.SetStateAction<number[] | null>>,
  }) {

  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [mediaInfos, setMediaInfos] = useState<React.ReactNode>(null);

  const users: string[] = useMemo(() => {
    const userSet = new Set<string>();
    waifus.forEach(waifu => userSet.add(waifu.owner));
    return Array.from(userSet).sort((a, b) => a.localeCompare(b, 'fr', { ignorePunctuation: true }));
  }, [waifus]);

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
        <UserSelector users={users} filters={filters} setFilters={setFilters} />
        <MediaSelector
          filters={filters}
          setFilters={setFilters}
          mediaCharas={mediaCharas}
          setMediaCharas={setMediaCharas}
          setMediaInfos={setMediaInfos}
        />
      </div>

      <div className="w-full flex justify-center">{mediaInfos}</div>
    </div>
  );
}

export function FiltersSelector({ filters, setFilters }:
  { filters: CollageFilters, setFilters: React.Dispatch<React.SetStateAction<CollageFilters>> }) {

  return (
    <div className="w-full grid grid-cols-3 grid-rows-3 grid-flow-col lg:w-1/2">
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
        <label htmlFor="blooded">🩸 Blooded</label>
      </div>
      <div className="checkbox">
        <input
          type="checkbox"
          id="lasts"
          checked={filters.lasts}
          onChange={() => setFilters({ ...filters, lasts: !filters.lasts })}
        />
        <label htmlFor="lasts">📆 ↓ Timestamp</label>
      </div>

      <style jsx>{`
        .checkbox {
          @apply m-auto space-x-1 flex flex-col items-center lg:flex-row text-sm lg:text-base;
          * {
            @apply cursor-pointer;
          }
        }
      `}</style>
    </div>
  );
}

export function UserSelector<T extends BaseFilters>({ users, filters, setFilters }:
  {
    users: string[],
    filters: T,
    setFilters: React.Dispatch<React.SetStateAction<T>>
  }) {

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

export function MediaSelector<T extends BaseFilters>({filters, setFilters, mediaCharas, setMediaCharas, setMediaInfos}:
  {
    filters: T,
    setFilters: React.Dispatch<React.SetStateAction<T>>,
    mediaCharas: number[] | null,
    setMediaCharas: React.Dispatch<React.SetStateAction<number[] | null>>,
    setMediaInfos: React.Dispatch<React.SetStateAction<React.ReactNode>>,
  }) {

  const [mediaId, setMediaId] = useState<number | null>(null);

  const [getMediaCharas, { data, error }] = useLazyQuery<{ Media: MediaData }>(MEDIA_DATA_QUERY, {
    variables: { id: mediaId },
    onCompleted: data => {
      setMediaCharas([...mediaCharas!, ...data.Media.characters.nodes.map(n => n.id)]);
      if (data.Media.characters.pageInfo.hasNextPage) {
        getMediaCharas({ variables: { chara_page: data.Media.characters.pageInfo.currentPage + 1 } });
      }
    }
  });

  useEffect(() => {
    setMediaId(filters.mediaId);
    if (filters.mediaId) {
      setMediaCharas([]);
      getMediaCharas({ variables: { chara_page: 1 } });
    } else {
      setMediaCharas(null);
    }
  }, [filters.mediaId, getMediaCharas, setMediaCharas]);

  useEffect(() => {
    if (mediaId) {
      if (data) {
        setMediaInfos(
          <a href={data.Media.siteUrl} className="font-bold">
            [{data.Media.type}] {data.Media.title.romaji}
          </a>);
      } else if (error) {
        setMediaInfos(<label className="font-bold">No media found with this ID</label>);
      }
    } else {
      setMediaInfos(null);
    }
  }, [data, error, mediaId, setMediaInfos]);

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
