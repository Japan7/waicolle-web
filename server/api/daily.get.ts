export default defineEventHandler(async (event) => {
  const { data } = await authRetry(() => nanapi.GET("/waicolle/exports/daily"));
  return data;
});
