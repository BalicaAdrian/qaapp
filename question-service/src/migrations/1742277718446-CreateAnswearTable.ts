import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAnswearTable1742277718446 implements MigrationInterface {
    name = 'CreateAnswearTable1742277718446'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`answear\` (
                \`id\` varchar(36) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`text\` text NOT NULL,
                \`userId\` varchar(255) NOT NULL,
                \`questionId\` varchar(36),
                PRIMARY KEY (\`id\`),
                FOREIGN KEY (\`questionId\`) REFERENCES \`question\`(\`id\`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`answear\``);
    }
}
