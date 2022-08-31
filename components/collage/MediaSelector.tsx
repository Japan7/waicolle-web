import { useLazyQuery } from "@apollo/client";
import React, { useCallback, useEffect, useState } from "react";
import { MEDIA_DATA_QUERY } from "../../lib/gql";
import { MediaData } from "../../types/anilist";
import { CollageFilters } from "../../types/filters";

export default function MediaSelector({
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
