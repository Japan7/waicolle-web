FROM node:lts-alpine as builder
WORKDIR /src
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:lts-alpine as runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder --chown=node /src/.output .
USER node
CMD [ "server/index.mjs" ]
EXPOSE 3000
