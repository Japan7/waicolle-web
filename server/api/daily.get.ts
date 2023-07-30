import { getDailyExport } from "../utils/nanapi-client";

const handler = defineEventHandler(async (event) => {
  const { data } = await getDailyExport({});
  return data;
});

export default memoizeHandler(handler);
