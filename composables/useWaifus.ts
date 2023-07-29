import { WaifusExport } from "server/utils/nanapi-client";

export const useWaifus = (clientId: MaybeRefOrGetter<string>) => {
  const clientIdValue = toValue(clientId);
  const key = `waifus-${clientIdValue}`;
  const { data } = useNuxtData<WaifusExport>(key);
  if (!data.value) {
    clearNuxtData(key); // FIXME: ???
  }
  const fetch = useLazyFetch("/api/waifus", {
    params: { clientId: clientIdValue },
    server: false,
    key,
    default: () => data,
  });
  return fetch;
};
