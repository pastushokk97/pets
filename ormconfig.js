module.exports = {
  type: 'postgres',
  host: 'postgres',
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
    entitiesDir: './src/entities',
    migrationsDir: './src/migrations',
  },
};
