import { ExponentialBackoff, handleType, retry } from "cockatiel";
import {
  ApiError,
  ApiResponse,
  Fetcher,
  FetchReturnType,
  Middleware,
} from "openapi-typescript-fetch";
import { paths } from "../nanapi";

let token: string | undefined;

async function login() {
  const formData = new FormData();
  formData.append("grant_type", "password");
  formData.append("username", process.env.NANAPI_CLIENT_USERNAME!);
  formData.append("password", process.env.NANAPI_CLIENT_PASSWORD!);
  const resp = await fetch(`${process.env.NANAPI_URL}/clients/token`, {
    method: "POST",
    body: formData,
  });
  const json = await resp.json();
  token = json.access_token;
}

function getAuthRetry(reject: (reason?: any) => void) {
  const authRetry = retry(
    handleType(ApiError, (e) => e.status == 401),
    { maxAttempts: 3, backoff: new ExponentialBackoff() }
  );
  authRetry.onFailure(login);
  authRetry.onGiveUp(reject);
  return authRetry;
}

const oauth2: Middleware = (url, init, next) => {
  return new Promise<ApiResponse>(async (resolve, reject) => {
    const authRetry = getAuthRetry(reject);
    await authRetry.execute(async () => {
      if (!token) await login();
      const resp = await next(url, {
        headers: new Headers({
          ...init.headers,
          Authorization: `Bearer ${token}`,
        }),
      });
      resolve(resp);
    });
  });
};

const nanapi = Fetcher.for<paths>();

nanapi.configure({
  baseUrl: process.env.NANAPI_URL,
  use: [oauth2],
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
