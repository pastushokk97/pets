import { CreateAnnouncementDTO } from '../dto/createAnnouncement.dto';
import { AnnouncementEntity } from '../../entities/Announcement.entity';

export interface IAnnouncementService {
  createAnnouncement(
    userId: string,
    body: CreateAnnouncementDTO,
  ): Promise<AnnouncementEntity>;
}
