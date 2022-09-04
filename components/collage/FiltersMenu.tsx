import { useLazyQuery } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";
import { MEDIA_DATA_QUERY } from "../../lib/gql";
import { MediaData } from "../../types/anilist";
import { CollageFilters } from "../../types/filters";

export default function FiltersMenu({
  users,
  filters,
  setFilters,
  mediaCharas,
  setMediaCharas,
  withoutFiltersSelector,
}: {
  users: string[];
  filters: CollageFilters;
  setFilters: React.Dispatch<React.SetStateAction<CollageFilters>>;
  mediaCharas: number[] | null;
  setMediaCharas: React.Dispatch<React.SetStateAction<number[] | null>>;
  withoutFiltersSelector?: boolean;
}) {
  const [mediaInfos, setMediaInfos] = useState<React.ReactNode>(null);

  return (
    <div className="flex flex-col items-center gap-y-2">
      {!withoutFiltersSelector && (
        <FiltersSelector filters={filters} setFilters={setFilters} />
      )}
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
          checked={filters.blooded}
          onChange={() => setFilters({ ...filters, blooded: !filters.blooded })}
        />
        <span>🩸 Blooded</span>
      </label>
      <label className="space-x-1">
        <input
          type="checkbox"
          checked={filters.lasts}
          onChange={() => setFilters({ ...filters, lasts: !filters.lasts })}
        />
        <span>📆 ↓ Timestamp</span>
      </label>
    </div>
  );
}

function UserSelector({
  users,
  filters,
  setFilters,
}: {
  users: string[];
  filters: CollageFilters;
  setFilters: React.Dispatch<React.SetStateAction<CollageFilters>>;
}) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const players = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      setFilters({ ...filters, players });
    },
    [filters, setFilters]
  );

  return (
    <div className="flex flex-col items-center">
      <select
        multiple
        value={filters.players ?? users}
        onChange={handleChange}
        className="select"
      >
        {users.map((user) => (
          <option key={user}>{user}</option>
        ))}
      </select>
    </div>
  );
}

function MediaSelector({
  filters,
  setFilters,
  mediaCharas,
  setMediaCharas,
  setMediaInfos,
}: {
  filters: CollageFilters;
  setFilters: React.Dispatch<React.SetStateAction<CollageFilters>>;
  mediaCharas: number[] | null;
  setMediaCharas: React.Dispatch<React.SetStateAction<number[] | null>>;
  setMediaInfos: React.Dispatch<React.SetStateAction<React.ReactNode>>;
}) {
  const [mediaId, setMediaId] = useState<number | null>(null);

  const [getMediaCharas, { data, error }] = useLazyQuery<{ Media: MediaData }>(
    MEDIA_DATA_QUERY,
    {
      onCompleted: (data) => {
        setMediaCharas([
          ...mediaCharas!,
          ...data.Media.characters.nodes.map((n) => n.id),
        ]);
        if (data.Media.characters.pageInfo.hasNextPage) {
          getMediaCharas({
            variables: {
              id: mediaId,
              chara_page: data.Media.characters.pageInfo.currentPage + 1,
            },
          });
        }
      },
    }
  );

  useEffect(() => {
    setMediaId(filters.mediaId);
    if (filters.mediaId) {
      setMediaCharas([]);
      getMediaCharas({ variables: { id: filters.mediaId } });
    } else {
      setMediaCharas(null);
    }
  }, [filters.mediaId, getMediaCharas, setMediaCharas]);

  useEffect(() => {
    if (mediaId) {
      if (data && data.Media) {
        setMediaInfos(
          <a href={data.Media.siteUrl}>
            [{data.Media.type}] {data.Media.title.romaji}
          </a>
        );
      } else if (error) {
        setMediaInfos(<label>No media found with this ID</label>);
      }
    } else {
      setMediaInfos(null);
    }
  }, [data, error, mediaId, setMediaInfos]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const mediaId = Number.isNaN(e.target.valueAsNumber)
        ? null
        : e.target.valueAsNumber;
      setFilters({ ...filters, mediaId });
    },
    [filters, setFilters]
  );

  return (
    <input
      type="number"
      placeholder="AniList media ID"
      value={filters.mediaId ?? ""}
      onChange={handleChange}
      className="input"
    />
  );
}
