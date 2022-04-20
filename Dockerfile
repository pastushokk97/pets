FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm run build

EXPOSE 8080

#RUN npm run create-ormconfig -- -h postgres -u postgres -p password -d pets_service

#RUN npm run migration:run

VOLUME /usr/src/app

#CMD ["npm", "run", "test"]