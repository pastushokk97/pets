import {MigrationInterface, QueryRunner} from "typeorm";

export class alterUserTable1650285586130 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE users ALTER COLUMN phone TYPE varchar(14)")
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE users ALTER COLUMN phone TYPE varchar(11)")
    }

}
