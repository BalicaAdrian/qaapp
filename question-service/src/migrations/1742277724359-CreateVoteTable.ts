import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateVoteTable1742277724359 implements MigrationInterface {
    name = 'CreateVoteTable1742277724359'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`vote\` (
                \`id\` varchar(36) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`userId\` varchar(255) NOT NULL,
                \`isUpVote\` tinyint NOT NULL DEFAULT 1,
                \`questionId\` varchar(36),
                \`answearid\` varchar(36),
                PRIMARY KEY (\`id\`),
                FOREIGN KEY (\`questionId\`) REFERENCES \`question\`(\`id\`) ON DELETE CASCADE,
                FOREIGN KEY (\`answearid\`) REFERENCES \`answear\`(\`id\`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`vote\``);
    }

}
