import { DailyExport } from "server/utils/nanapi-client";

export const useDaily = () => {
  const key = "daily";
  const { data } = useNuxtData<DailyExport>(key);
  if (!data.value) clearNuxtData(key); // FIXME: ???
  const fetch = useLazyFetch("/api/daily", {
    server: false,
    key,
    default: () => data,
  });
  return fetch;
};
