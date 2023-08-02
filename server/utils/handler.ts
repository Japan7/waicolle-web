import type { EventHandler } from "h3";
import type { StorageValue } from "unstorage";

const TTL = 1000 * 60 * 5;

export function memoizeHandler<T extends StorageValue>(
  handler: EventHandler<T>
) {
  const wrapped = defineEventHandler(async (event) => {
    const storage = useStorage<{ data: T; refresh: number }>("memoizeHandler");
    const cached = await storage.getItem(event.path);
    const fetchPromise = new Promise<T>(async (resolve, reject) => {
      if (cached && cached.refresh + TTL > Date.now()) {
        reject(`[memoizeHandler] ${event.path} is fresh`);
      } else {
        const response = await handler(event);
        await storage.setItem(event.path, {
          data: response,
          refresh: Date.now(),
        });
        resolve(response);
      }
    });
    const response = cached?.data ?? (await fetchPromise);
    return response;
  });
  return wrapped;
}
