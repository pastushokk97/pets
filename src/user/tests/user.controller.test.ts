import * as request from 'supertest';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnection } from 'typeorm';
import { omit } from 'lodash';

import { UserRepository } from '../../repositories/User.repository';
import { UserModule } from '../user.module';
import { anotherUser, user } from '../../fixtures/user.fixtures';
import { UserEntity } from '../../entities/User.entity';
import { USER_API } from '../../app-constants/routes';
import {
  FAIL_CASES,
  SUCCESS_CASES,
  VALIDATION_ERROR_CASES,
} from '../../app-constants/tests';
import { USER_ERROR } from '../../app-constants/error-text';
import { UserService } from '../user.service';
import { AuthModule } from '../../middlewares/auth/auth.module';
import { AuthService } from '../../middlewares/auth/auth.service';
import { IAuthLogin } from '../../middlewares/auth/interfaces/authLogin.interface';
import { AnnouncementRepository } from '../../repositories/Announcement.repository';

const options = require('../../../ormconfig.json');

let app: INestApplication;
let userRepository: UserRepository;
let authService: AuthService;

describe('UserController', () => {
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        UserModule,
        AuthModule,
        TypeOrmModule.forRoot({ ...options, autoLoadEntities: true }),
        TypeOrmModule.forFeature([AnnouncementRepository]),
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    userRepository = module.get(UserRepository);
    authService = module.get(AuthService);
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
    afterAll(async () => {
      await getConnection()
        .createQueryBuilder()
        .delete()
        .from(UserEntity)
        .execute();
    });
    describe(SUCCESS_CASES, () => {
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
    describe(VALIDATION_ERROR_CASES, () => {
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
    describe(FAIL_CASES, () => {
      let testUser: UserEntity;
      beforeEach(async () => {
        testUser = await userRepository.save(user);
      });
      afterEach(async () => {
        await userRepository.remove(testUser);
      });
      it('should return error if user already exist', async () => {
        const { status, body } = await request(app.getHttpServer())
          .post(`${USER_API}/sign-up`)
          .send(user)
          .set('Accept', 'application/json');

        expect(status).toStrictEqual(HttpStatus.CONFLICT);
        expect(body.message).toStrictEqual(USER_ERROR.userExist);
      });
    });
  });
  describe('login()', () => {
    describe(SUCCESS_CASES, () => {
      let testUser: UserEntity;
      beforeEach(async () => {
        testUser = await userRepository.save({
          ...user,
          password: UserService.hashPassword(user.password),
        });
      });
      afterEach(async () => {
        await userRepository.remove(testUser);
      });
      it('should login user', async () => {
        const { status, body } = await request(app.getHttpServer())
          .post(`${USER_API}/login`)
          .send({ email: user.email, password: user.password })
          .set('Accept', 'application/json');

        expect(status).toStrictEqual(HttpStatus.OK);
        expect(body.user.email).toStrictEqual(user.email);
        expect(body.token.access_token).not.toBeUndefined();
      });
    });
    describe(FAIL_CASES, () => {
      let testUser: UserEntity;
      beforeEach(async () => {
        testUser = await userRepository.save({ ...user, firstname: 'I' });
      });
      afterEach(async () => {
        await userRepository.remove(testUser);
      });
      it('should return error if user is not register', async () => {
        const { status, body } = await request(app.getHttpServer())
          .post(`${USER_API}/login`)
          .send({ email: 'unregister@gmail.com', password: 'unregister' })
          .set('Accept', 'application/json');

        expect(status).toStrictEqual(HttpStatus.NOT_FOUND);
        expect(body.message).toStrictEqual(USER_ERROR.userNotFound);
      });
      it('should return error if password is not correct', async () => {
        const { status, body } = await request(app.getHttpServer())
          .post(`${USER_API}/login`)
          .send({ email: user.email, password: user.password })
          .set('Accept', 'application/json');

        expect(status).toStrictEqual(HttpStatus.FORBIDDEN);
        expect(body.message).toStrictEqual(USER_ERROR.incorrectPassword);
      });
    });
    describe(VALIDATION_ERROR_CASES, () => {
      it('should return error if email is undefined', async () => {
        const invalidUser = omit(user, 'email');
        const { status } = await request(app.getHttpServer())
          .post(`${USER_API}/login`)
          .send(invalidUser)
          .set('Accept', 'application/json');

        expect(status).toStrictEqual(HttpStatus.BAD_REQUEST);
      });
      it('should return error if password is undefined', async () => {
        const invalidUser = omit(user, 'password');
        const { status } = await request(app.getHttpServer())
          .post(`${USER_API}/login`)
          .send(invalidUser)
          .set('Accept', 'application/json');

        expect(status).toStrictEqual(HttpStatus.BAD_REQUEST);
      });
    });
  });
  describe('getInfo()', () => {
    describe(SUCCESS_CASES, () => {
      let testUser: UserEntity;
      let anotherTestUser: UserEntity;
      let token: IAuthLogin;
      beforeAll(async () => {
        testUser = await userRepository.save(user);
        anotherTestUser = await userRepository.save(anotherUser);
        token = await authService.login(testUser.userId);
      });
      afterAll(async () => {
        await userRepository.remove(testUser);
        await userRepository.remove(anotherTestUser);
      });
      it('should return information about user by email', async () => {
        const { status, body } = await request(app.getHttpServer())
          .get(`${USER_API}/info`)
          .query({ email: testUser.email })
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token.access_token}`);

        expect(status).toStrictEqual(HttpStatus.OK);
        expect(body.email).toStrictEqual(testUser.email);
      });
      it('should return information about user by userId', async () => {
        const { status, body } = await request(app.getHttpServer())
          .get(`${USER_API}/info`)
          .query({ userId: testUser.userId })
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token.access_token}`);

        expect(status).toStrictEqual(HttpStatus.OK);
        expect(body.userId).toStrictEqual(testUser.userId);
      });
      it('should return info about user by another user by email', async () => {
        const { status, body } = await request(app.getHttpServer())
          .get(`${USER_API}/info`)
          .query({ email: anotherTestUser.email })
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token.access_token}`);

        expect(status).toStrictEqual(HttpStatus.OK);
        expect(body.email).toStrictEqual(anotherTestUser.email);
      });
      it('should return error about user by another user by userId', async () => {
        const { status, body } = await request(app.getHttpServer())
          .get(`${USER_API}/info`)
          .query({ userId: anotherTestUser.userId })
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token.access_token}`);

        expect(status).toStrictEqual(HttpStatus.OK);
        expect(body.email).toStrictEqual(anotherTestUser.email);
      });
    });
    describe(FAIL_CASES, () => {
      let testUser: UserEntity;
      let token: IAuthLogin;
      beforeAll(async () => {
        testUser = await userRepository.save(user);
        token = await authService.login(testUser.userId);
      });
      afterAll(async () => {
        await userRepository.remove(testUser);
      });
      it('should return error about if query is empty', async () => {
        const { status } = await request(app.getHttpServer())
          .get(`${USER_API}/info`)
          .query({})
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token.access_token}`);

        expect(status).toStrictEqual(HttpStatus.BAD_REQUEST);
      });
      it('should return error about if user was not found by another user by email', async () => {
        const { status, body } = await request(app.getHttpServer())
          .get(`${USER_API}/info`)
          .query({ email: 'invalid@gmail.com' })
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token.access_token}`);

        expect(status).toStrictEqual(HttpStatus.NOT_FOUND);
        expect(body.message).toStrictEqual(USER_ERROR.userNotFound);
      });
      it('should return error about if user was not found by another user by userId', async () => {
        const INVALID_USER_ID = '7782cf9c-d928-4d94-8eee-196d227441da';
        const { status, body } = await request(app.getHttpServer())
          .get(`${USER_API}/info`)
          .query({ userId: INVALID_USER_ID })
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token.access_token}`);

        expect(status).toStrictEqual(HttpStatus.NOT_FOUND);
        expect(body.message).toStrictEqual(USER_ERROR.userNotFound);
      });
    });
    describe(VALIDATION_ERROR_CASES, () => {
      const INVALID_USER_ID = '7782cf9c-d928-4d94-8eee-196d227441da';
      let token: IAuthLogin;
      beforeAll(async () => {
        token = await authService.login(INVALID_USER_ID);
      });
      it('should return error if token is not valid', async () => {
        const { status } = await request(app.getHttpServer())
          .get(`${USER_API}/info`)
          .query({ email: 'register@gmail.com', password: 'register' })
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer INVALID_TOKEN');

        expect(status).toStrictEqual(HttpStatus.UNAUTHORIZED);
      });
      it('should return error if token is valid, but user was not found', async () => {
        const { status } = await request(app.getHttpServer())
          .get(`${USER_API}/info`)
          .query({ email: 'register@gmail.com', password: 'register' })
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token.access_token}`);

        expect(status).toStrictEqual(HttpStatus.FORBIDDEN);
      });
    });
  });
});
