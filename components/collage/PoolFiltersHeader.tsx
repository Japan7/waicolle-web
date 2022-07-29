import { useMemo, useState } from "react";
import { CollageFilters } from "../../types/filters";
import MediaSelector from "./MediaSelector";
import UserSelector from "./UserSelector";

export default function PoolFiltersHeader({
  pools,
  filters,
  setFilters,
  mediaCharas,
  setMediaCharas,
}: {
  pools: { [key: string]: number[] };
  filters: CollageFilters;
  setFilters: React.Dispatch<React.SetStateAction<CollageFilters>>;
  mediaCharas: number[] | null;
  setMediaCharas: React.Dispatch<React.SetStateAction<number[] | null>>;
}) {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [mediaInfos, setMediaInfos] = useState<React.ReactNode>(null);

  const users: string[] = useMemo(() => {
    return Array.from(Object.keys(pools)).sort((a, b) =>
      a.localeCompare(b, "fr", { ignorePunctuation: true })
    );
  }, [pools]);

  return (
    <div className="mb-2">
      <button
        className="w-full opacity-75 text-sm lg:hidden"
        onClick={() => setShowMenu(!showMenu)}
      >
        Toggle menu
      </button>

      <div
        className={`${
          showMenu ? "grid" : "hidden"
        } lg:grid grid-cols-2 grid-flow-row`}
      >
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
