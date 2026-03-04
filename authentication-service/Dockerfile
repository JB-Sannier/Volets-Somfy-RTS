FROM node:25.6.1-alpine3.23 AS build

WORKDIR /app

COPY package.json /app/
COPY package-lock.json /app/
COPY tsconfig.json /app/
COPY eslint.config.mjs /app/
COPY .prettier-rc.json /app/
COPY src /app/src

RUN npm i
RUN npm run bundle

FROM node:25.6.1-alpine3.23

RUN apk add --no-cache tini

ENV NODE_ENV=production

COPY --from=build /app/bundle/authentication-service.js /bundle/authentication-service.js

WORKDIR /bundle

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "--max-old-space-size=192", "--max-semi-space-size=2", "--optimize-for-size", "/bundle/authentication-service.js"]
