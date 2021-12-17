module.exports = {
  type: 'postgres',
  host: '127.0.0.1',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'pets_service',
  synchronize: false,
  logging: true,
  schema: 'public',
  entities: ['dist/**/*.entity{.js,.ts}'],
  migrations: ['dist/migrations/*.js'],
  cli: {
    entitiesDir: './**/entities',
    migrationsDir: './src/migrations',
  },
};
