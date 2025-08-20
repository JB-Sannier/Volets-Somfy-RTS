import { Column, Entity } from "typeorm";

@Entity({ name: "RefreshToken" })
export class RefreshTokenEntity {
  @Column({ name: "email", type: "character varying", primary: true })
  email: string;

  @Column({ name: "refreshToken", type: "character varying", primary: true })
  refreshToken: string;

  @Column({ name: "expiration", type: "timestamptz" })
  expiration: Date;

  constructor() {
    this.email = "";
    this.refreshToken = "";
    this.expiration = new Date();
  }
}
