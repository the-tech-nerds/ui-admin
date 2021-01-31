FROM node:14-alpine
RUN mkdir /app
WORKDIR /app

EXPOSE 3000

COPY package*.json /app/

RUN npm install --production

COPY dist /app/
COPY build /app/

CMD [ "node dist/main.js" ]
ENTRYPOINT [ "sh", "-c" ]