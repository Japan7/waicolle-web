FROM node:current-alpine

ENV NODE_ENV=production

WORKDIR /app

COPY package.json package.json
COPY node_modules node_modules
COPY public public
COPY .next .next

EXPOSE 3000
CMD ["npm", "start"]
