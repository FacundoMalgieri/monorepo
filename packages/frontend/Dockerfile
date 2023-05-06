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

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
