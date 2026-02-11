import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "../../common/entities/base.entity";
import { User } from "../../users/entities/user.entity";
import { Market } from "../../market/entities/market.entity";

@Entity("stores")
export class Store extends BaseEntity {
  /** Path/URL to store logo */
  @Column({ type: "varchar", length: 500, nullable: true, default: null })
  logo: string | null;

  /** Path/URL to store cover image */
  @Column({ type: "varchar", length: 500, nullable: true, default: null })
  cover_image: string | null;

  @Column({ type: "int" })
  market_id: number;

  @ManyToOne(() => Market, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "market_id" })
  market: Market;

  @Column({ type: "varchar", length: 255 })
  store_name: string;

  /** Opening time (e.g. "09:00" or "09:00:00") */
  @Column({ type: "time", nullable: true, default: null })
  open_time: string | null;

  /** Closing time (e.g. "18:00" or "18:00:00") */
  @Column({ type: "time", nullable: true, default: null })
  closed_time: string | null;

  @Column({ type: "int" })
  vendor_id: number;

  /** Whether the store has been approved (e.g. by admin) */
  @Column({ type: "boolean", default: false })
  is_approved: boolean;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "vendor_id" })
  vendor: User;
}
