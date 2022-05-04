import { DeleteResult } from 'typeorm';

import { CreateAnnouncementDTO } from '../dto/createAnnouncement.dto';
import { AnnouncementEntity } from '../../entities/Announcement.entity';

export interface IAnnouncementService {
  createAnnouncement(
    userId: string,
    body: CreateAnnouncementDTO,
  ): Promise<AnnouncementEntity>;
  deleteAnnouncement(
    announcementId: string,
    userId: string,
  ): Promise<DeleteResult>;
}
