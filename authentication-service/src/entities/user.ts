import { Column, Entity } from "typeorm";
import { UserRole } from "../models/models";

@Entity({ name: "User" })
export class UserEntity {
  @Column({ name: "email", type: "character varying", primary: true })
  email: string;

  @Column({ name: "password", type: "character varying" })
  password: string;

  @Column({ name: "is_active", type: "character varying" })
  isActive: boolean;

  @Column({
    name: "roles",
    type: "character varying",
    array: true,
    default: [],
  })
  roles: UserRole[];

  constructor() {
    this.email = "";
    this.password = "";
    this.isActive = false;
    this.roles = [];
  }
}
