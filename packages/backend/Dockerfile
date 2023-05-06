FROM node:18 AS builder
ENV NODE_ENV=development

WORKDIR /app

COPY ./packages/backend .
COPY ./yarn.lock .

RUN yarn install
RUN yarn run build

FROM node:18-alpine
ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/dist ./dist

RUN yarn install --production

EXPOSE 3010

CMD ["yarn", "run", "start:prod"]
