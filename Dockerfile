FROM node:14-alpine
RUN mkdir /app
WORKDIR /app

EXPOSE 3000

COPY package*.json /app/
COPY .npmrc /app/

RUN npm install --production
RUN rm -f .npmrc

COPY dist /app/dist
COPY build /app/build
COPY src /app/src
COPY public /app/public

CMD [ "cp /data/env /app/.env && node dist/main.js" ]
ENTRYPOINT [ "sh", "-c" ]
