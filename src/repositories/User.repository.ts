import { EntityRepository, Repository } from 'typeorm';

import { UserEntity } from '../entities/User.entity';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  public async findOneByEmail(email: string): Promise<UserEntity> {
    return this.findOne({ email });
  }

  public async findOneById(userId: string): Promise<UserEntity> {
    return this.findOne({ userId });
  }
}
