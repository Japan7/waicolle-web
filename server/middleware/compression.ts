import compression from "compression";

const compress = compression();

export default defineEventHandler((event) => {
  compress(event.node.req as any, event.node.res as any, () => {});
});
