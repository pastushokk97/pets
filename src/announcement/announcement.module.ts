import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnnouncementRepository } from '../repositories/Announcement.repository';
import { AuthModule } from '../middlewares/auth/auth.module';
import { AnnouncementController } from './announcement.controller';
import { AnnouncementService } from './announcement.service';
import { UserRepository } from '../repositories/User.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([AnnouncementRepository, UserRepository]),
    AuthModule,
  ],
  controllers: [AnnouncementController],
  providers: [AnnouncementService, AnnouncementRepository],
})
export class AnnouncementModule {}
