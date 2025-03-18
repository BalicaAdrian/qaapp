import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDatabase1742277698482 implements MigrationInterface {
    name = 'CreateDatabase1742277698482'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createDatabase('question_db', true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropDatabase('question_db', true);
    }

}
