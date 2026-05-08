FROM node:25.9-alpine3.23 AS build

WORKDIR /app

COPY package.json /app/
COPY package-lock.json /app/
COPY tsconfig.json /app/
COPY eslint.config.mjs /app/
COPY .prettier-rc.json /app/
COPY src /app/src

RUN npm i
RUN npm run bundle

FROM node:25.9-alpine3.23

COPY --from=build /app/bundle/backend-service.js /bundle/backend-service.js

WORKDIR /bundle

EXPOSE 80

CMD [ "node", "/bundle/backend-service.js"]



