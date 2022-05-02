import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { USER_ENTITY } from '../app-constants/entities';
import { AnnouncementEntity } from './Announcement.entity';

@Entity(USER_ENTITY)
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'user_id',
  })
  public userId!: string;

  @Column({
    type: 'varchar',
    length: '255',
    name: 'firstname',
    nullable: true,
  })
  public firstname?: string;

  @Column({
    type: 'varchar',
    length: '255',
    name: 'lastname',
    nullable: true,
  })
  public lastname?: string;

  @Column({
    type: 'varchar',
    length: '96',
    name: 'email',
    nullable: false,
  })
  public email!: string;

  @Column({
    type: 'varchar',
    length: '11',
    name: 'phone',
    nullable: true,
  })
  public phone?: string;

  @Column({
    type: 'varchar',
    length: '255',
    name: 'password',
    nullable: false,
  })
  public password!: string;

  @Column({
    type: 'date',
    name: 'created_date',
    nullable: false,
    default: new Date(),
  })
  public createdDate!: Date;

  @Column({
    type: 'date',
    name: 'updated_date',
    nullable: true,
  })
  public updatedDate?: Date;

  @OneToMany(() => AnnouncementEntity, (announcement) => announcement.user)
  public announcements?: AnnouncementEntity[];
}
