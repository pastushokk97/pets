import { ConflictException, Injectable } from '@nestjs/common';
import { Connection, DeleteResult } from 'typeorm';

import { AnnouncementRepository } from '../repositories/Announcement.repository';
import { UserRepository } from '../repositories/User.repository';
import { CreateAnnouncementDTO } from './dto/createAnnouncement.dto';
import { AnnouncementEntity } from '../entities/Announcement.entity';
import { IAnnouncementService } from './interfaces/announcement.interface';
import { ANNOUNCEMENT_ERROR } from '../app-constants/error-text';

@Injectable()
export class AnnouncementService implements IAnnouncementService {
  private readonly announcementRepository: AnnouncementRepository;

  private readonly userRepository: UserRepository;

  constructor(private readonly connection: Connection) {
    this.announcementRepository = this.connection.getCustomRepository(
      AnnouncementRepository,
    );
    this.userRepository = this.connection.getCustomRepository(UserRepository);
  }

  public async createAnnouncement(
    userId: string,
    body: CreateAnnouncementDTO,
  ): Promise<AnnouncementEntity> {
    try {
      const isDuplicateAnnouncement =
        await this.announcementRepository.findDuplicates(body.title, body.city);
      if (isDuplicateAnnouncement) {
        throw new ConflictException(ANNOUNCEMENT_ERROR.announcementExist);
      }

      return await this.announcementRepository.save({ userId, ...body });
    } catch (err) {
      throw err;
    }
  }

  deleteAnnouncement(
    announcementId: string,
    userId: string,
  ): Promise<DeleteResult> {
    return this.announcementRepository.delete({ announcementId, userId });
  }
}
