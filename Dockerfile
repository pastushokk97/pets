FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 8080

RUN npm run build

VOLUME /usr/src/app

CMD ["npm", "run", "start:dev"]