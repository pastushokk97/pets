import { EntityRepository, Repository } from 'typeorm';

import { AnnouncementEntity } from '../entities/Announcement.entity';

@EntityRepository(AnnouncementEntity)
export class AnnouncementRepository extends Repository<AnnouncementEntity> {
  public async findDuplicates(title, city) {
    return this.findOne({ where: { title, city } });
  }
}
