import React, { useMemo, useState } from "react";
import { CollageFilters } from "../../types/filters";
import { WCWaifu } from "../../types/waicolle";
import MediaSelector from "./MediaSelector";
import UserSelector from "./UserSelector";

export default function WaifuFiltersHeader({
  waifus,
  filters,
  setFilters,
  mediaCharas,
  setMediaCharas,
}: {
  waifus: WCWaifu[];
  filters: CollageFilters;
  setFilters: React.Dispatch<React.SetStateAction<CollageFilters>>;
  mediaCharas: number[] | null;
  setMediaCharas: React.Dispatch<React.SetStateAction<number[] | null>>;
}) {
  const [mediaInfos, setMediaInfos] = useState<React.ReactNode>(null);

  const users: string[] = useMemo(() => {
    const userSet = new Set<string>();
    waifus.forEach((waifu) => userSet.add(waifu.owner));
    return Array.from(userSet).sort((a, b) =>
      a.localeCompare(b, "fr", { ignorePunctuation: true })
    );
  }, [waifus]);

  return (
    <div className="flex flex-col items-center gap-y-2">
      <FiltersSelector filters={filters} setFilters={setFilters} />
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

function FiltersSelector({
  filters,
  setFilters,
}: {
  filters: CollageFilters;
  setFilters: React.Dispatch<React.SetStateAction<CollageFilters>>;
}) {
  return (
    <div className="grid grid-cols-2 grid-rows-3 grid-flow-row w-fit">
      <label className="space-x-1">
        <input
          type="checkbox"
          id="unlocked"
          checked={filters.unlockedOnly}
          onChange={() =>
            setFilters({ ...filters, unlockedOnly: !filters.unlockedOnly })
          }
        />
        <span>🔓 Unlocked</span>
      </label>
      <label className="space-x-1">
        <input
          type="checkbox"
          id="locked"
          checked={filters.lockedOnly}
          onChange={() =>
            setFilters({ ...filters, lockedOnly: !filters.lockedOnly })
          }
        />
        <span>🔒 Locked</span>
      </label>
      <label className="space-x-1">
        <input
          type="checkbox"
          id="ascended"
          checked={filters.ascendedOnly}
          onChange={() =>
            setFilters({ ...filters, ascendedOnly: !filters.ascendedOnly })
          }
        />
        <span>⭐ Ascended</span>
      </label>
      <label className="space-x-1">
        <input
          type="checkbox"
          id="nanaed"
          checked={filters.nanaedOnly}
          onChange={() =>
            setFilters({ ...filters, nanaedOnly: !filters.nanaedOnly })
          }
        />
        <span>🌈 Nanaed</span>
      </label>
      <label className="space-x-1">
        <input
          type="checkbox"
          id="blooded"
          checked={filters.blooded}
          onChange={() => setFilters({ ...filters, blooded: !filters.blooded })}
        />
        <span>🩸 Blooded</span>
      </label>
      <label className="space-x-1">
        <input
          type="checkbox"
          id="lasts"
          checked={filters.lasts}
          onChange={() => setFilters({ ...filters, lasts: !filters.lasts })}
        />
        <span>📆 ↓ Timestamp</span>
      </label>
    </div>
  );
}
