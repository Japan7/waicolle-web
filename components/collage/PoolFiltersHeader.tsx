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
  const [mediaInfos, setMediaInfos] = useState<React.ReactNode>(null);

  const users: string[] = useMemo(() => {
    return Array.from(Object.keys(pools)).sort((a, b) =>
      a.localeCompare(b, "fr", { ignorePunctuation: true })
    );
  }, [pools]);

  return (
    <div className="flex flex-col justify-center gap-y-4">
      <UserSelector users={users} filters={filters} setFilters={setFilters} />
      <MediaSelector
        filters={filters}
        setFilters={setFilters}
        mediaCharas={mediaCharas}
        setMediaCharas={setMediaCharas}
        setMediaInfos={setMediaInfos}
      />
      {mediaInfos && <div className="text-center">{mediaInfos}</div>}
    </div>
  );
}
