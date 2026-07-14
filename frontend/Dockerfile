FROM node:25.9-alpine3.23 AS build
RUN apk add --no-cache tini

WORKDIR /app

COPY package.json /app/
COPY package-lock.json /app/
COPY tsconfig.json /app/
COPY eslint.config.js /app/
COPY src /app/src
COPY public /app/public
COPY vite.config.docker.ts /app/
COPY vite.config.docker-values.ts /app/
COPY tsconfig.docker.json /app/
COPY index.html /app/
COPY tsconfig.app.json /app/
COPY tsconfig.node.json /app/

RUN npm i

#FROM node:25.9-alpine3.23


#COPY --from=build /app/bundle/backend-service.js /bundle/backend-service.js

EXPOSE 80

CMD [ \
  "/sbin/tini",\
  "--", \
  "npm", \
  "run", \
  "start:docker" \
]
