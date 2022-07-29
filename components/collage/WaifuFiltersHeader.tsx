import React, { useMemo, useState } from "react";
import styles from "../../styles/WaifuFiltersHeader.module.css";
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
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [mediaInfos, setMediaInfos] = useState<React.ReactNode>(null);

  const users: string[] = useMemo(() => {
    const userSet = new Set<string>();
    waifus.forEach((waifu) => userSet.add(waifu.owner));
    return Array.from(userSet).sort((a, b) =>
      a.localeCompare(b, "fr", { ignorePunctuation: true })
    );
  }, [waifus]);

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
        } lg:grid grid-cols-2 grid-rows-2 grid-flow-row lg:grid-cols-4 lg:grid-rows-1`}
      >
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

function FiltersSelector({
  filters,
  setFilters,
}: {
  filters: CollageFilters;
  setFilters: React.Dispatch<React.SetStateAction<CollageFilters>>;
}) {
  return (
    <div className="col-span-2 grid grid-cols-3 grid-rows-2 grid-flow-col">
      <div className={styles.checkbox}>
        <input
          type="checkbox"
          id="unlocked"
          checked={filters.unlockedOnly}
          onChange={() =>
            setFilters({ ...filters, unlockedOnly: !filters.unlockedOnly })
          }
        />
        <label htmlFor="unlocked">🔓 Unlocked</label>
      </div>
      <div className={styles.checkbox}>
        <input
          type="checkbox"
          id="locked"
          checked={filters.lockedOnly}
          onChange={() =>
            setFilters({ ...filters, lockedOnly: !filters.lockedOnly })
          }
        />
        <label htmlFor="locked">🔒 Locked</label>
      </div>
      <div className={styles.checkbox}>
        <input
          type="checkbox"
          id="ascended"
          checked={filters.ascendedOnly}
          onChange={() =>
            setFilters({ ...filters, ascendedOnly: !filters.ascendedOnly })
          }
        />
        <label htmlFor="ascended">⭐ Ascended</label>
      </div>
      <div className={styles.checkbox}>
        <input
          type="checkbox"
          id="nanaed"
          checked={filters.nanaedOnly}
          onChange={() =>
            setFilters({ ...filters, nanaedOnly: !filters.nanaedOnly })
          }
        />
        <label htmlFor="nanaed">🌈 Nanaed</label>
      </div>
      <div className={styles.checkbox}>
        <input
          type="checkbox"
          id="blooded"
          checked={filters.blooded}
          onChange={() => setFilters({ ...filters, blooded: !filters.blooded })}
        />
        <label htmlFor="blooded">🩸 Blooded</label>
      </div>
      <div className={styles.checkbox}>
        <input
          type="checkbox"
          id="lasts"
          checked={filters.lasts}
          onChange={() => setFilters({ ...filters, lasts: !filters.lasts })}
        />
        <label htmlFor="lasts">📆 ↓ Timestamp</label>
      </div>
    </div>
  );
}
