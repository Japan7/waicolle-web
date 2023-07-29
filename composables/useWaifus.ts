import { WaifusExport } from "server/utils/nanapi-client";

export const useWaifus = (clientId: string) => {
  const key = `waifus-${clientId}`;
  const { data } = useNuxtData<WaifusExport>(key);
  if (!data.value) clearNuxtData(key); // FIXME: ???
  const fetch = useLazyFetch("/api/waifus", {
    params: { clientId },
    server: false,
    key,
    default: () => data,
  });
  return fetch;
};
