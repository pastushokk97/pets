import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ANNOUNCEMENT_ENTITY } from '../app-constants/entities';
import { UserEntity } from './User.entity';
import { AnnouncementMedia } from '../app-constants/types';

@Entity(ANNOUNCEMENT_ENTITY)
export class AnnouncementEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'announcement_id',
  })
  public announcementId!: string;

  @Column({
    type: 'varchar',
    length: '255',
    name: 'title',
    nullable: false,
  })
  public title!: string;

  @Column({
    type: 'text',
    name: 'description',
    nullable: true,
  })
  public description?: string;

  @Column({
    type: 'varchar',
    length: '255',
    name: 'region',
    nullable: false,
  })
  public region!: string;

  @Column({
    type: 'varchar',
    length: '255',
    name: 'city',
    nullable: false,
  })
  public city!: string;

  @Column('jsonb', {
    name: 'photos',
  })
  public photos!: AnnouncementMedia[];

  @Column({
    type: 'int',
    name: 'price',
    nullable: false,
  })
  public price?: number;

  @Column({
    type: 'varchar',
    length: '1',
    name: 'currency',
    nullable: true,
  })
  public currency?: string;

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

  @Column('uuid', {
    name: 'user_id',
  })
  public userId!: string;

  @ManyToOne(() => UserEntity, (user) => user.announcements, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  public user?: UserEntity;
}
