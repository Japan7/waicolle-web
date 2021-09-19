import { useLazyQuery } from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { MEDIA_DATA_QUERY } from '../../lib/queries';
import { CollageFilters, MediaData, WCItem } from '../../lib/types';
import { compareCharaFavourites } from '../../lib/utils';

function compareFavourites(a: WCItem, b: WCItem) {
  return compareCharaFavourites(a.alchara, b.alchara);
}

function compareTimestamp(a: WCItem, b: WCItem) {
  if (a.waifu.timestamp > b.waifu.timestamp) return -1;
  if (a.waifu.timestamp < b.waifu.timestamp) return 1;
  return 0;
}

export default function WaifuCollage({ items, filters, setSelected, setMediaInfos }:
  {
    items: WCItem[],
    filters: CollageFilters,
    setSelected: React.Dispatch<React.SetStateAction<WCItem | undefined>>,
    setMediaInfos: React.Dispatch<React.SetStateAction<React.ReactNode>>
  }) {

  const [pics, setPics] = useState<JSX.Element[]>([]);
  const [shown, setShown] = useState<JSX.Element[]>([]);

  const [mediaId, setMediaId] = useState<number | null>(null);
  const [charas, setCharas] = useState<number[] | null>(null);

  const [getCharas, { data, error }] = useLazyQuery<{ Media: MediaData }>(MEDIA_DATA_QUERY, {
    variables: { id: mediaId },
    onCompleted: data => {
      setCharas([...charas!, ...data.Media.characters.nodes.map(n => n.id)]);
      if (data.Media.characters.pageInfo.hasNextPage) {
        getCharas({ variables: { chara_page: data.Media.characters.pageInfo.currentPage + 1 } });
      }
    }
  });

  useEffect(() => {
    setMediaId(filters.mediaId);
    if (filters.mediaId) {
      setCharas([]);
      getCharas({ variables: { chara_page: 1 } });
    } else {
      setCharas(null);
    }
  }, [filters.mediaId, getCharas]);

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

  const isIncluded = useCallback((item: WCItem) => {
    if (charas && !charas.includes(item.alchara.id)) return false;
    if (filters.blooded != item.waifu.blooded) return false;
    if (!item.alchara.image || item.alchara.image.endsWith('default.jpg')) return false;

    if (filters.players && !filters.players.includes(item.waifu.owner)) return false;

    if (filters.ascendedOnly && item.waifu.level === 0) return false;
    if (filters.unlockedOnly && item.waifu.locked) return false;
    if (filters.lockedOnly && !item.waifu.locked) return false;
    if (filters.nanaedOnly && !item.waifu.nanaed) return false;

    return true;
  }, [charas, filters.ascendedOnly, filters.blooded, filters.lockedOnly,
    filters.nanaedOnly, filters.players, filters.unlockedOnly]);

  useEffect(() => {
    const newPics: JSX.Element[] = [];
    items.sort(filters.lasts ? compareTimestamp : compareFavourites);
    items.forEach(item => {
      if (isIncluded(item)) {
        newPics.push(
          <Pic item={item} setSelected={setSelected} key={item.waifu.id} />
        );
      }
    });
    setPics(newPics);
    setShown(newPics.slice(0, 500));
  }, [filters.lasts, isIncluded, items, setSelected]);

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

function Pic({ item, setSelected }:
  { item: WCItem, setSelected: React.Dispatch<React.SetStateAction<WCItem | undefined>> }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="w-16 h-24 cursor-pointer object-cover"
      src={item.alchara.image!}
      alt={item.alchara.name}
      loading="lazy"
      onClick={() => setSelected(item)}
    />
  );
}
