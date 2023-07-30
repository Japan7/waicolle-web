import { EventHandler } from "h3";
import { StorageValue } from "unstorage";

export function memoizeHandler<T extends StorageValue>(
  handler: EventHandler<T>
) {
  const wrapped = defineEventHandler(async (event) => {
    const storage = useStorage<T>();
    const cached = await storage.getItem(event.path);
    const fetchPromise = new Promise<T>(async (resolve, reject) => {
      const response = await handler(event);
      await storage.setItem(event.path, response);
      resolve(response);
    });
    const response = cached ?? (await fetchPromise);
    return response;
  });
  return wrapped;
}
