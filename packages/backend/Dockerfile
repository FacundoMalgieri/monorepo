FROM node:18.12.1

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . .

EXPOSE 3010

CMD ["yarn", "start"]
