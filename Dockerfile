# Base stage

FROM node:22-alpine3.21 AS base

WORKDIR /usr/src/server

COPY package*.json ./

COPY prisma ./prisma

RUN npm install

RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "start"]
