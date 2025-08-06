import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class InitialMigration1754473503534 implements MigrationInterface {
  name = "InitialMigration1754473503534";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const table: Table = new Table({
      name: "Shutter",
      columns: [
        {
          name: "shutterId",
          type: "character varying",
          comment: "Shutter ID",
          isNullable: false,
          isPrimary: true,
          isUnique: true,
          length: "250",
        },
        {
          name: "shutterName",
          type: "character varying",
          comment: "Shutter Name",
          isNullable: false,
          isPrimary: false,
          isUnique: false,
          length: "250",
        },
        {
          name: "proxyShutterId",
          type: "character varying",
          comment: "Shutter Id used on the RPi",
          isNullable: false,
          isPrimary: false,
          isUnique: false,
          length: "250",
        },
      ],
    });
    console.log("Creating table Shutters");
    await queryRunner.createTable(table);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({ name: "Shutter" });
    queryRunner.dropTable(table);
  }
}
