import { Entity, Column, ManyToOne, JoinColumn, Unique } from "typeorm";
import { BaseEntity } from "../../common/entities/base.entity";
import { User } from "../../users/entities/user.entity";

@Entity("wallets")
@Unique(["user_id"])
export class Wallet extends BaseEntity {
  @Column({ type: "int" })
  user_id: number;

  @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
  balance: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;
}
