import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../middlewares/auth/auth.module';
import { UserEntity } from '../entities/User.entity';
import { AnnouncementModule } from '../announcement/announcement.module';
import { AnnouncementEntity } from '../entities/Announcement.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, AnnouncementEntity]),
    TypeOrmModule.forRoot(),
    UserModule,
    AuthModule,
    AnnouncementModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
