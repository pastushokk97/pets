FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN npm run build

RUN npm ci

EXPOSE 8080

#RUN npm run create-ormconfig -- -h postgres -u postgres -p password -d pets_service

#RUN npm run migration:run

VOLUME /usr/src/app

#CMD ["npm", "run", "test"]