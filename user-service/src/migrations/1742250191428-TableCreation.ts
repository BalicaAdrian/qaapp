import { MigrationInterface, QueryRunner } from "typeorm";

export class TableCreation1742250191428 implements MigrationInterface {
    name = 'TableCreation1742250191428'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS \`user\` (
                \`id\` varchar(36) NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`email\` varchar(255) NOT NULL,
                \`password\` varchar(255) NOT NULL,
                \`oauthId\` varchar(255) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
  
        await queryRunner.query(`
            CREATE UNIQUE INDEX \`IDX_USER_EMAIL\` ON \`user\` (\`email\`)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_USER_EMAIL\` ON \`user\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`user\``);
    }

}
