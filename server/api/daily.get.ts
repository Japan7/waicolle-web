export default defineEventHandler(async (event) => {
  const { data } = await getDailyExport({});
  return data;
});
