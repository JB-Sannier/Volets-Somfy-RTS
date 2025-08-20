import { MigrationInterface, QueryRunner, Table } from "typeorm";

const TABLE_NAME = "RefreshToken";

export class Migrations1755530698256 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table: Table = new Table({
      schema: process.env.DB_SCHEMA,
      name: TABLE_NAME,
      columns: [
        {
          name: "email",
          type: "character varying",
          comment: "Email of the username",
          isNullable: false,
          isPrimary: true,
          isUnique: false,
          length: "250",
        },
        {
          name: "refreshToken",
          type: "character varying",
          comment: "Refresh token created",
          isNullable: false,
          isPrimary: true,
          length: "250",
        },
        {
          name: "expiration",
          type: "timestamptz",
          comment: "refresh token expiration",
          isNullable: false,
        },
      ],
    });
    console.log("Creating table RefreshToken");
    await queryRunner.createTable(table);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log(`Deleting table ${TABLE_NAME}`);
    await queryRunner.dropTable(TABLE_NAME);
  }
}
