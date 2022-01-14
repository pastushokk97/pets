import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRepository } from '../src/repositories/User.repository';
import { UserModule } from '../src/user/user.module';

describe('UserController', () => {
  let app: INestApplication;
  let userRepository: UserRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        UserModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: '127.0.0.1',
          port: 5432,
          username: 'postgres',
          password: 'password',
          database: 'pets_service',
          entities: ['./**/*.entity.ts'],
          synchronize: false,
        }),
      ],
    }).compile();

    app = module.createNestApplication();
    userRepository = module.get('UserRepository');
    await app.init();
  });
  afterEach(async () => {
    await userRepository.query('DELETE FROM users;');
  });

  afterAll(async () => {
    await app.close();
  });
  describe('signUp()', () => {
    describe('SUCCESS CASES', () => {
      it('should sign up user', async () => {
        const { status, body } = await request(app.getHttpServer())
          .post('/user/register')
          .send({
            email: 'ihorpastushenko@gmail.ua',
            password: '123',
          })
          .set('Accept', 'application/json');

        const userDB = await userRepository.findOne({
          email: 'ihorpastushenko@gmail.ua',
        });

        expect(status).toStrictEqual(200);
        expect(body.email).toStrictEqual(userDB.email);
      });
    });
  });
});
