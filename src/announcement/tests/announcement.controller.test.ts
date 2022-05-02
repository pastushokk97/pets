import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { omit } from 'lodash';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { getConnection } from 'typeorm';

import { UserRepository } from '../../repositories/User.repository';
import { AuthService } from '../../middlewares/auth/auth.service';
import { UserEntity } from '../../entities/User.entity';
import { AnnouncementEntity } from '../../entities/Announcement.entity';
import {
  FAIL_CASES,
  SUCCESS_CASES,
  VALIDATION_ERROR_CASES,
} from '../../app-constants/tests';
import { ANNOUNCEMENT_API } from '../../app-constants/routes';
import { announcement } from '../../fixtures/announcement.fixtures';
import { user } from '../../fixtures/user.fixtures';
import { IAuthLogin } from '../../middlewares/auth/interfaces/authLogin.interface';
import { AnnouncementRepository } from '../../repositories/Announcement.repository';
import { ANNOUNCEMENT_ERROR } from '../../app-constants/error-text';
import { AnnouncementModule } from '../announcement.module';
import { AuthModule } from '../../middlewares/auth/auth.module';
import { UserModule } from '../../user/user.module';

const options = require('../../../ormconfig.json');

let app: INestApplication;
let userRepository: UserRepository;
let announcementRepository: AnnouncementRepository;
let authService: AuthService;

describe('AnnouncementController', () => {
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        UserModule,
        AnnouncementModule,
        AuthModule,
        TypeOrmModule.forRoot({ ...options, autoLoadEntities: true }),
        TypeOrmModule.forFeature([UserRepository]),
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    userRepository = module.get(UserRepository);
    authService = module.get(AuthService);
    announcementRepository = module.get(AnnouncementRepository);
    await app.init();
  });

  afterAll(async () => {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(UserEntity)
      .execute();
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(AnnouncementEntity)
      .execute();
    await app.close();
  });
  describe('createAnnouncement()', () => {
    describe(SUCCESS_CASES, () => {
      let testUser: UserEntity;
      let token: IAuthLogin;
      beforeAll(async () => {
        testUser = await userRepository.save(user);
        token = await authService.login(testUser.userId);
      });
      afterAll(async () => {
        await userRepository.remove(testUser);
      });
      it('should add announcement', async () => {
        const { status, body } = await request(app.getHttpServer())
          .post(`${ANNOUNCEMENT_API}/add`)
          .send(announcement)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token.access_token}`);

        expect(status).toStrictEqual(HttpStatus.CREATED);
        expect(body.userId).toStrictEqual(testUser.userId);
        expect(body.title).toStrictEqual(announcement.title);
        expect(body.city).toStrictEqual(announcement.city);
        expect(body.photos).toStrictEqual(announcement.photos);
        expect(body.region).toStrictEqual(announcement.region);
      });
    });
    describe(FAIL_CASES, () => {
      let testUser: UserEntity;
      let token: IAuthLogin;
      let duplicateAnnouncement: AnnouncementEntity;
      beforeAll(async () => {
        testUser = await userRepository.save(user);
        token = await authService.login(testUser.userId);
        duplicateAnnouncement = await announcementRepository.save({
          ...announcement,
          userId: testUser.userId,
        });
      });
      afterAll(async () => {
        await userRepository.remove(testUser);
        await announcementRepository.remove(duplicateAnnouncement);
      });
      it('should return an error if announcement exists', async () => {
        const { status, body } = await request(app.getHttpServer())
          .post(`${ANNOUNCEMENT_API}/add`)
          .send(announcement)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token.access_token}`);

        expect(status).toStrictEqual(HttpStatus.CONFLICT);
        expect(body.message).toStrictEqual(
          ANNOUNCEMENT_ERROR.announcementExist,
        );
      });
    });
    describe(VALIDATION_ERROR_CASES, () => {
      let testUser: UserEntity;
      let token: IAuthLogin;
      beforeAll(async () => {
        testUser = await userRepository.save(user);
        token = await authService.login(testUser.userId);
      });
      afterAll(async () => {
        await userRepository.remove(testUser);
      });
      it('should return an error if title is empty', async () => {
        const invalidAnnouncement = omit(announcement, 'title');
        const { status } = await request(app.getHttpServer())
          .post(`${ANNOUNCEMENT_API}/add`)
          .send(invalidAnnouncement)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token.access_token}`);

        expect(status).toStrictEqual(HttpStatus.BAD_REQUEST);
      });
      it('should return an error if city is empty', async () => {
        const invalidAnnouncement = omit(announcement, 'city');
        const { status } = await request(app.getHttpServer())
          .post(`${ANNOUNCEMENT_API}/add`)
          .send(invalidAnnouncement)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token.access_token}`);

        expect(status).toStrictEqual(HttpStatus.BAD_REQUEST);
      });
      it('should return an error if region is empty', async () => {
        const invalidAnnouncement = omit(announcement, 'region');
        const { status } = await request(app.getHttpServer())
          .post(`${ANNOUNCEMENT_API}/add`)
          .send(invalidAnnouncement)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token.access_token}`);

        expect(status).toStrictEqual(HttpStatus.BAD_REQUEST);
      });
      it('should return an error if photos is empty', async () => {
        const invalidAnnouncement = omit(announcement, 'photos');
        const { status } = await request(app.getHttpServer())
          .post(`${ANNOUNCEMENT_API}/add`)
          .send(invalidAnnouncement)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token.access_token}`);

        expect(status).toStrictEqual(HttpStatus.BAD_REQUEST);
      });
    });
  });
});
