import type { InternalApi as _InternalApi } from "nitropack";

type InternalApi<
  P extends keyof _InternalApi,
  M extends keyof _InternalApi[P]
> = _InternalApi[P][M] extends infer T | undefined ? T : never;

export type WaifusData = InternalApi<"/api/waifus", "get">;
export type DailyData = InternalApi<"/api/daily", "get">;
