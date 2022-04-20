FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm run build

RUN npm run create-ormconfig -- -h postgres -u postgres -p password -d pets_service

EXPOSE 8080

VOLUME /usr/src/app

CMD ["npm", "run", "start"]