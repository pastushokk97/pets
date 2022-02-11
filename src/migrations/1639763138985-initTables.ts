import { MigrationInterface, QueryRunner } from 'typeorm';

export class initTables1639763138985 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    await queryRunner.query(`CREATE TABLE users(
        user_id uuid DEFAULT uuid_generate_v4(),
        firstname varchar(255),
        lastname varchar(255),
        email varchar(96) NOT NULL,
        phone varchar(11),
        password varchar(255) NOT NULL,
        created_date date NOT NULL DEFAULT CURRENT_DATE,
        updated_date date,
        PRIMARY KEY(user_id)
      );`);
    await queryRunner.query(`CREATE TABLE announcement(
        announcement_id uuid DEFAULT uuid_generate_v4(),
        user_id uuid REFERENCES users(user_id) ON DELETE CASCADE NOT NULL,
        title varchar(255) NOT NULL,
        description text NOT NULL,
        region varchar(255) NOT NULL,
        city varchar(255) NOT NULL,
        photos jsonb,
        price int,
        currency varchar(1),
        created_date date NOT NULL DEFAULT CURRENT_DATE,
        updated_date date,
        PRIMARY KEY(announcement_id),
        CONSTRAINT fk_users FOREIGN KEY(user_id) REFERENCES users(user_id)
      );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP EXTENSION IF EXIST "uuid-ossp";`);
  }
}
