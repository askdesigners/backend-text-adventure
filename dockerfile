FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

COPY yarn.lock ./

RUN yarn

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]