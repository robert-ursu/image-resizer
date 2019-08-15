FROM node:latest

WORKDIR /app

RUN mkdir ./images
RUN mkdir ./images-cache

COPY package*.json ./

ENV NODE_ENV=production
RUN npm install

COPY ./dist .

EXPOSE 3000

CMD ["node", "server.js"]