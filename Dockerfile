FROM node:alpine

WORKDIR /app

COPY ./ /app

RUN yarn

ENV NODE_ENV production

RUN yarn build

CMD yarn start:prod

EXPOSE 3000