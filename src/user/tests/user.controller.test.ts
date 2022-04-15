import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRepository } from '../../repositories/User.repository';
import { UserModule } from '../user.module';

const options = require('../../../ormconfig.json');

let app: INestApplication;
let userRepository: UserRepository;

describe('UserController', () => {
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        UserModule,
        TypeOrmModule.forRoot({ ...options, autoLoadEntities: true }),
      ],
    }).compile();

    app = module.createNestApplication();
    userRepository = module.get(UserRepository);
    await app.init();
  });

  afterAll(async () => {
    await userRepository.query('DELETE FROM users;');
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
      });
    });
  });
});
