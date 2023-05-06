FROM node:18.12.1

WORKDIR /app/packages/frontend

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn global add serve

COPY ../../.eslintrc.js /app

RUN yarn build

WORKDIR /app/packages/frontend/build

CMD serve -p 3000 -s .
