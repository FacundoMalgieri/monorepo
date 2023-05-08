FROM node:18 AS builder
ENV NODE_ENV=development

WORKDIR /app

COPY ./packages/frontend .
COPY ./yarn.lock .

RUN yarn install
RUN yarn run build

FROM nginx:1.23.3-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/build ./build
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
