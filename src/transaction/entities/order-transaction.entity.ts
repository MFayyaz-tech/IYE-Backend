import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "../../common/entities/base.entity";
import { Order } from "../../order/entities/order.entity";
import { User } from "../../users/entities/user.entity";
import { Store } from "../../store/entities/store.entity";

export enum TransactionStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  REFUNDED = "refunded",
  CANCELLED = "cancelled",
}

@Entity("order_transactions")
export class OrderTransaction extends BaseEntity {
  /** External or internal transaction reference (e.g. payment gateway id) */
  @Column({ type: "varchar", length: 255 })
  transaction_id: string;

  @Column({ type: "int" })
  order_id: number;

  @Column({ type: "int" })
  user_id: number;

  @Column({ type: "int" })
  store_id: number;

  /** Payment method used (e.g. cash, card, online, wallet) */
  @Column({ type: "varchar", length: 50 })
  payment_method: string;

  /** Amount transacted */
  @Column({ type: "decimal", precision: 12, scale: 2 })
  amount: number;

  @Column({
    type: "enum",
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  /** Optional note or gateway response */
  @Column({ type: "text", nullable: true, default: null })
  notes: string | null;

  @ManyToOne(() => Order, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "order_id" })
  order: Order;

  @ManyToOne(() => User, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Store, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "store_id" })
  store: Store;
}
