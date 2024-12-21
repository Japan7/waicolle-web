const handler = defineEventHandler(async (event) => {
  const { clientId } = getQuery(event) as { clientId: string };
  const { data } = await authRetry(() =>
    nanapi.GET("/waicolle/exports/waifus", {
      params: {
        query: { client_id: clientId },
      },
    })
  );
  return data;
});

export default memoizeHandler(handler);
