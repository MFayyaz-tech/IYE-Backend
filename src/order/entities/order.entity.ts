import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { BaseEntity } from "../../common/entities/base.entity";
import { User } from "../../users/entities/user.entity";
import { Store } from "../../store/entities/store.entity";
import { Product } from "../../product/entities/product.entity";
import { Address } from "../../address/entities/address.entity";

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export enum PaymentMethod {
  CASH = "cash",
  CARD = "card",
  ONLINE = "online",
  WALLET = "wallet",
  OTHER = "other",
}

@Entity("orders")
export class Order extends BaseEntity {
  @Column({ type: "int" })
  store_id: number;

  @Column({ type: "int" })
  user_id: number;

  @Column({
    type: "enum",
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({ type: "boolean", default: false })
  is_paid: boolean;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  total_bill: number;

  @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
  discount: number;

  @Column({ type: "varchar", length: 50, nullable: true, default: null })
  payment_method: string | null;

  /** Delivery/shipping address (user's saved address) */
  @Column({ type: "int", nullable: true, default: null })
  address_id: number | null;

  @ManyToOne(() => Store, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "store_id" })
  store: Store;

  @ManyToOne(() => User, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Address, { onDelete: "SET NULL" })
  @JoinColumn({ name: "address_id" })
  address: Address | null;

  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];
}

@Entity("order_items")
export class OrderItem extends BaseEntity {
  @Column({ type: "int" })
  order_id: number;

  @Column({ type: "int" })
  product_id: number;

  @Column({ type: "int" })
  quantity: number;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  price: number;

  @ManyToOne(() => Order, { onDelete: "CASCADE" })
  @JoinColumn({ name: "order_id" })
  order: Order;

  @ManyToOne(() => Product, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "product_id" })
  product: Product;
}
