import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1742249082453 implements MigrationInterface {
    name = 'InitialMigration1742249082453'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE DATABASE IF NOT EXISTS \`user_db\`
            CHARACTER SET utf8mb4 
            COLLATE utf8mb4_unicode_ci
        `);
        await queryRunner.query(`USE \`user_db\``);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP DATABASE IF EXISTS \`user_db\``);

    }
}
