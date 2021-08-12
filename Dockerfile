FROM node:current-alpine

ENV NODE_ENV=production

WORKDIR /app

COPY public public
COPY .next .next
COPY node_modules node_modules
COPY package.json package.json

EXPOSE 3000
CMD ["npm", "start"]
