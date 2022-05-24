import { EntityRepository, Repository } from 'typeorm';

import { UserEntity } from '../entities/User.entity';
import { SELECT_USER_FIELDS } from '../app-constants/user';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  public async findOneByEmail(email: string): Promise<UserEntity> {
    return this.findOne({ email }, { select: SELECT_USER_FIELDS });
  }

  public async findOneById(userId: string): Promise<UserEntity> {
    return this.findOne({ userId });
  }
}
