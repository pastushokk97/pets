import 'reflect-metadata';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

let app: INestApplication;
describe('AppController', () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'postgres',
        port: 5432,
        username: 'postgres',
        password: 'password',
        database: 'pets_service',
        entities: ['./**/*.entity.ts'],
        synchronize: false,
      }),AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET cats`, () => {
    return request(app.getHttpServer()).get('/health').expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
