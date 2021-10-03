import { useMemo, useState } from 'react';
import { BaseFilters } from '../../lib/types';
import { MediaSelector, UserSelector } from './WaifuFiltersHeader';

export default function PoolFiltersHeader({ pools, filters, setFilters, mediaCharas, setMediaCharas }:
  {
    pools: { [key: string]: number[] },
    filters: BaseFilters,
    setFilters: React.Dispatch<React.SetStateAction<BaseFilters>>,
    mediaCharas: number[] | null,
    setMediaCharas: React.Dispatch<React.SetStateAction<number[] | null>>,
  }) {

  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [mediaInfos, setMediaInfos] = useState<React.ReactNode>(null);

  const users: string[] = useMemo(() => {
    return Array.from(Object.keys(pools)).sort((a, b) => a.localeCompare(b, 'fr', { ignorePunctuation: true }));
  }, [pools]);

  return (
    <div>
      <button
        className="w-full h-10 opacity-75 lg:hidden"
        onClick={() => setShowMenu(!showMenu)}
      >
        Toggle menu
      </button>

      <div className={`${showMenu ? 'flex' : 'hidden'} lg:flex flex-row flex-wrap mb-1`}>
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
