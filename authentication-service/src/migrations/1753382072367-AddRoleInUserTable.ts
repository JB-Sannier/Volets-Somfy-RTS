import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddRoleInUserTable1753382072367 implements MigrationInterface {
  name = "AddRoleInUserTable1753382072367";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const column: TableColumn = new TableColumn({
      name: "roles",
      type: "character varying",
      comment: "User Roles",
      isArray: true,
    });
    console.log("Je rajoute la colonne roles dans la table User");
    await queryRunner.addColumn("User", column);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropColumn("User", "roles");
  }
}
