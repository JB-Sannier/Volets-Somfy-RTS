import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class InitialMigration1753360597960 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table: Table = new Table({
      name: "User",
      columns: [
        {
          name: "email",
          type: "character varying",
          comment: "Email of the username",
          isNullable: false,
          isPrimary: true,
          isUnique: true,
          length: "250",
        },
        {
          name: "password",
          type: "character varying",
          comment: "Hashed password of the username",
          isNullable: false,
          isPrimary: false,
          isUnique: false,
          length: "250",
        },
        {
          name: "is_active",
          type: "character varying",
          comment: "Is the user active",
          isNullable: true,
          isPrimary: false,
          isUnique: false,
        },
      ],
    });
    console.log("Creation de la table User");
    await queryRunner.createTable(table);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({ name: "User" });
    queryRunner.dropTable(table);
  }
}
