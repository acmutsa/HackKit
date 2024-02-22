FROM node:20.11.1-alpine AS build

ENV NPM_CONFIG_UPDATE_NOTIFIER=false
ENV NPM_CONFIG_FUND=false

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src

RUN npm i
RUN npm run build
RUN npm prune --production

FROM node:20.11.1-alpine

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

RUN apk add --update --no-cache postgresql16-client --repository=https://dl-cdn.alpinelinux.org/alpine/edge/main

ENTRYPOINT ["node", "dist/index.js"]