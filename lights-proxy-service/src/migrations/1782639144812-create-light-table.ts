import { type MigrationInterface, type QueryRunner, Table } from "typeorm";

export class CreateLightTable1782639144812 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table: Table = new Table({
      name: "Light",
      columns: [
        {
          name: "lightId",
          type: "character varying",
          comment: "Unique identifier for the light",
          isNullable: false,
          isPrimary: true,
          isUnique: true,
          length: "250",
        },
        {
          name: "lightName",
          type: "character varying",
          comment: "Name of the light",
          isNullable: false,
          isPrimary: false,
          isUnique: false,
          length: "250",
        },
        {
          name: "description",
          type: "character varying",
          comment: "Description of the light",
          isNullable: true,
          isPrimary: false,
          isUnique: false,
          length: "250",
        },
        {
          name: "type",
          type: "character varying",
          comment: "Type of the light",
          isNullable: true,
          isPrimary: false,
          isUnique: false,
          length: "50",
        },
        {
          name: "switchOnCode",
          type: "integer",
          comment: "Code to switch on the light",
          isNullable: false,
          isPrimary: false,
          isUnique: false,
        },
        {
          name: "switchOffCode",
          type: "integer",
          comment: "Code to switch off the light",
          isNullable: false,
          isPrimary: false,
          isUnique: false,
        },
        {
          name: "pulseLength",
          type: "integer",
          comment: "Pulse length for the light",
          isNullable: false,
          isPrimary: false,
          isUnique: false,
        },
        {
          name: "protocol",
          type: "integer",
          comment: "Protocol used for the light",
          isNullable: false,
          isPrimary: false,
          isUnique: false,
        },
        {
          name: "frequency",
          type: "integer",
          comment: "Frequency used for the light",
          isNullable: false,
          isPrimary: false,
          isUnique: false,
        },
      ],
    });
    console.log("Creating table Light");
    await queryRunner.createTable(table);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log("Deleting table Light");
    const table = new Table({ name: "Light" });
    await queryRunner.dropTable(table);
  }
}
