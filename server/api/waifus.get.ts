import { getWaifusExport } from "../utils/nanapi-client";

const handler = defineEventHandler(async (event) => {
  const { clientId } = getQuery(event) as { clientId: string };
  const { data } = await getWaifusExport({ client_id: clientId });
  return data;
});

export default memoizeHandler(handler);
