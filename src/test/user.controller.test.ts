import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRepository } from '../repositories/User.repository';
import { UserModule } from '../user/user.module';

let app: INestApplication;
let userRepository: UserRepository;
describe('UserController', () => {
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        UserModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'postgres',
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
    userRepository = module.get(UserRepository);
    await app.init();
  }, 60000);
  beforeEach((): void => {
    jest.setTimeout(60000);
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
        jest.setTimeout(60000);
        const { status } = await request(app.getHttpServer())
          .post('/user/sign-up')
          .send({
            email: 'ihorpastushenko@gmail.ua',
            password: '123',
          })
          .set('Accept', 'application/json');

        const userDB = await userRepository.findOne({
          email: 'ihorpastushenko@gmail.ua',
        });

        expect(status).toStrictEqual(201);
        // expect(body.email).toStrictEqual(userDB.email);
      }, 60000);
    });
  });
});
