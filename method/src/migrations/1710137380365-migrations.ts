import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1710137380365 implements MigrationInterface {
    name = 'Migrations1710137380365'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`content\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(100) NULL, \`body\` varchar(2000) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`content\``);
    }

}
