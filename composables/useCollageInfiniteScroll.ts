export const useCollageInfiniteScroll = <T>(
  array: Ref<T[]>,
  scrollDiv: Ref<HTMLDivElement | undefined>
) => {
  const limit = ref(200);
  useInfiniteScroll(
    scrollDiv,
    () => {
      if (limit.value < array.value.length) {
        limit.value += 100;
      }
    },
    { distance: 1000 }
  );
  return limit;
};
