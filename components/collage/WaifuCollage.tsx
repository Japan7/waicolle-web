import { useLazyQuery } from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { MEDIA_DATA_QUERY } from '../../lib/queries';
import { CollageFilters, MediaData, WCCharaData, WCWaifu } from '../../lib/types';
import { compareCharaFavourites } from '../../lib/utils';

function compareFavourites(charas: { [key: number]: WCCharaData }, a: WCWaifu, b: WCWaifu) {
  return compareCharaFavourites(charas[a.chara_id], charas[b.chara_id]);
}

function compareTimestamp(a: WCWaifu, b: WCWaifu) {
  if (a.timestamp > b.timestamp) return -1;
  if (a.timestamp < b.timestamp) return 1;
  return 0;
}

export default function WaifuCollage({ waifus, charas, filters, setSelected, setMediaInfos }:
  {
    waifus: WCWaifu[],
    charas: { [key: number]: WCCharaData },
    filters: CollageFilters,
    setSelected: React.Dispatch<React.SetStateAction<WCWaifu | undefined>>,
    setMediaInfos: React.Dispatch<React.SetStateAction<React.ReactNode>>
  }) {

  const [pics, setPics] = useState<JSX.Element[]>([]);
  const [shown, setShown] = useState<JSX.Element[]>([]);

  const [mediaId, setMediaId] = useState<number | null>(null);
  const [mediaCharas, setMediaCharas] = useState<number[] | null>(null);

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
  }, [filters.mediaId, getMediaCharas]);

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

  const isIncluded = useCallback((waifu: WCWaifu) => {
    if (mediaCharas && !mediaCharas.includes(waifu.chara_id)) return false;
    if (!charas[waifu.chara_id].image || charas[waifu.chara_id].image!.endsWith('default.jpg')) return false;

    if (filters.blooded != waifu.blooded) return false;
    if (filters.players && !filters.players.includes(waifu.owner)) return false;

    if (filters.ascendedOnly && waifu.level === 0) return false;
    if (filters.unlockedOnly && waifu.locked) return false;
    if (filters.lockedOnly && !waifu.locked) return false;
    if (filters.nanaedOnly && !waifu.nanaed) return false;

    return true;
  }, [mediaCharas, charas, filters]);

  useEffect(() => {
    const newPics: JSX.Element[] = [];
    waifus.sort(filters.lasts ? compareTimestamp : (a, b) => compareFavourites(charas, a, b));
    waifus.forEach(waifu => {
      if (isIncluded(waifu)) {
        newPics.push(
          <Pic waifu={waifu} chara={charas[waifu.chara_id]} setSelected={setSelected} key={waifu.id} />
        );
      }
    });
    setPics(newPics);
    setShown(newPics.slice(0, 500));
  }, [filters.lasts, isIncluded, waifus, setSelected, charas]);

  return (
    <div className="h-full overflow-scroll" id="collage">
      <InfiniteScroll
        className="flex flex-wrap justify-center"
        dataLength={shown.length}
        next={() => setShown(pics.slice(0, shown.length + 200))}
        hasMore={shown.length < pics.length}
        loader={null}
        scrollThreshold={0.25}
        scrollableTarget="collage"
      >
        {shown}
      </InfiniteScroll>
    </div>
  );
}

function Pic({ waifu, chara, setSelected }:
  { waifu: WCWaifu, chara: WCCharaData, setSelected: React.Dispatch<React.SetStateAction<WCWaifu | undefined>> }) {

  const src = `https://s4.anilist.co/file/anilistcdn/character/medium/${chara.image}`;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="w-16 h-24 cursor-pointer object-cover"
      src={src}
      alt={chara.name}
      loading="lazy"
      onClick={() => setSelected(waifu)}
    />
  );
}
