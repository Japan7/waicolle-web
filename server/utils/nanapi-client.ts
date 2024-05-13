import { ExponentialBackoff, handleType, retry } from "cockatiel";
import type {
  ApiResponse,
  FetchReturnType,
  Middleware,
} from "openapi-typescript-fetch";
import { ApiError, Fetcher } from "openapi-typescript-fetch";
import type { paths } from "./nanapi";

const runtimeConfig = useRuntimeConfig();
let token: string = "";

async function refreshToken() {
  const formData = new FormData();
  formData.append("grant_type", "password");
  formData.append("username", runtimeConfig.nanapiClientUsername);
  formData.append("password", runtimeConfig.nanapiClientPassword);
  const { access_token } = await $fetch<{ access_token: string }>(
    "/clients/token",
    {
      baseURL: runtimeConfig.nanapiUrl,
      method: "POST",
      body: formData,
    }
  );
  token = access_token;
}

function createAuthRetry(reject: (reason?: any) => void) {
  const authRetry = retry(
    handleType(ApiError, (e) => e.status == 401),
    { maxAttempts: 5, backoff: new ExponentialBackoff() }
  );
  authRetry.onFailure(refreshToken);
  authRetry.onGiveUp(reject);
  return authRetry;
}

const oAuth2Middleware: Middleware = (url, init, next) => {
  return new Promise<ApiResponse>(async (resolve, reject) => {
    const authRetry = createAuthRetry(reject);
    await authRetry.execute(async () => {
      init.headers.set("Authorization", `Bearer ${token}`);
      const resp = await next(url, { headers: init.headers });
      resolve(resp);
    });
  });
};

const nanapi = Fetcher.for<paths>();
nanapi.configure({
  baseUrl: runtimeConfig.nanapiUrl,
  use: [oAuth2Middleware],
});
export default nanapi;

export const getWaifusExport = nanapi
  .path("/waicolle/exports/waifus")
  .method("get")
  .create();
export type WaifusExport = FetchReturnType<typeof getWaifusExport>;

export const getDailyExport = nanapi
  .path("/waicolle/exports/daily")
  .method("get")
  .create();
export type DailyExport = FetchReturnType<typeof getDailyExport>;

export type Player = WaifusExport["players"][number];
export type Waifu = WaifusExport["waifus"][number];
export type Chara = WaifusExport["charas"][number] | DailyExport[number];
