import * as request from 'supertest';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnection } from 'typeorm';
import { omit } from 'lodash';

import { UserRepository } from '../../repositories/User.repository';
import { UserModule } from '../user.module';
import { user } from '../../fixtures/user.fixtures';
import { UserEntity } from '../../entities/User.entity';
import { USER_API } from '../../app-constants/routes';

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
    app.useGlobalPipes(new ValidationPipe());
    userRepository = module.get(UserRepository);
    await app.init();
  });

  afterAll(async () => {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(UserEntity)
      .execute();
    await app.close();
  });

  describe('signUp()', () => {
    describe('SUCCESS CASES', () => {
      it('should sign up user', async () => {
        const { status, body } = await request(app.getHttpServer())
          .post(`${USER_API}/sign-up`)
          .send(user)
          .set('Accept', 'application/json');

        const userDB = await userRepository.findOneByEmail(user.email);

        expect(status).toStrictEqual(HttpStatus.CREATED);
        expect(body.email).toStrictEqual(userDB.email);
      });
    });
    describe('ERROR CASES', () => {
      it('should return error if email is empty', async () => {
        const invalidUser = omit(user, 'email');
        const { status } = await request(app.getHttpServer())
          .post(`${USER_API}/sign-up`)
          .send(invalidUser)
          .set('Accept', 'application/json');

        expect(status).toStrictEqual(HttpStatus.BAD_REQUEST);
      });
      it('should return error if password is empty', async () => {
        const invalidUser = omit(user, 'password');
        const { status } = await request(app.getHttpServer())
          .post(`${USER_API}/sign-up`)
          .send(invalidUser)
          .set('Accept', 'application/json');

        expect(status).toStrictEqual(HttpStatus.BAD_REQUEST);
      });
    });
  });
});
