FROM node:16-alpine as build

ENV PORT=3000

ENV WDS_SOCKET_PORT=80

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm","start"]