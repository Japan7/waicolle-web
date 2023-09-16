import type { EventHandlerRequest } from "h3";

const TTL = 1000 * 60 * 5;

export function memoizeHandler<T extends EventHandlerRequest, U>(
  handler: ReturnType<typeof defineEventHandler<T, U>>
) {
  const wrapped = defineEventHandler(async (event) => {
    const storage = useStorage<{ data: U; refresh: number }>("memoizeHandler");
    const cached = await storage.getItem(event.path);
    const fetchPromise = new Promise<U>(async (resolve, reject) => {
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
