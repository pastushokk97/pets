import 'reflect-metadata';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppModule } from '../app.module';
import { HEALTH_API } from '../../app-constants/routes';

const options = require('../../../ormconfig.json');

let app: INestApplication;
describe('AppController', () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({ ...options, autoLoadEntities: true }),
        AppModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('/health', () => {
    return request(app.getHttpServer()).get(`${HEALTH_API}`).expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
