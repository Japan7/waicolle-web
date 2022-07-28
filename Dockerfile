FROM node:16-alpine as builder

# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /app

COPY . .

RUN corepack enable &&\
    yarn rebuild &&\
    yarn --immutable --immutable-cache &&\
    yarn build


FROM node:16-alpine as runner

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/package.json /app/yarn.lock /app/.pnp.cjs /app/.pnp.loader.mjs ./
COPY --from=builder /app/.yarn/cache ./.yarn/cache
COPY --from=builder /app/.yarn/install-state.gz ./.yarn/install-state.gz
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["corepack", "yarn", "start"]
