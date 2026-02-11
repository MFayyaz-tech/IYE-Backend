import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "../../common/entities/base.entity";
import { User } from "../../users/entities/user.entity";

@Entity("user_addresses")
export class Address extends BaseEntity {
  @Column({ type: "int" })
  user_id: number;

  /** Contact phone for this address */
  @Column({ type: "varchar", length: 50 })
  phone: string;

  /** Full address (street, city, area, etc.) */
  @Column({ type: "text" })
  address: string;

  /** Title/label for the address (e.g. "Home", "Office", "Work") */
  @Column({ type: "varchar", length: 100 })
  title: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;
}
