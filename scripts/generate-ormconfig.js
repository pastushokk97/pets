const fs = require('fs');
const { program } = require('commander');

const resultFileURL = 'ormconfig.json';

program
  .option("-h, --host <host>")
  .option("-u, --username <username>")
  .option("-p, --password <password>")
  .option("-d, --database <database>").parse(process.argv);
const options = program.opts();
const ormconfig = {
  "type": "postgres",
  "host": options.host,
  "port": 5432,
  "username": options.username,
  "password": options.password,
  "database": options.database,
  "synchronize": false,
  "logging": true,
  "schema": "public",
  "entities": ["dist/**/*.entity{.js,.ts}"],
  "migrations": ["dist/migrations/*.js"],
  "cli": {
    "entitiesDir": ",./src/entities",
    "migrationsDir": "./src/migrations"
  }
};

fs.writeFileSync(resultFileURL, JSON.stringify(ormconfig, null, ' '));

console.log('DB config written to ', resultFileURL);
