import { Entity, Column, ManyToOne, JoinColumn, Unique } from "typeorm";
import { BaseEntity } from "../../common/entities/base.entity";
import { Product } from "../../product/entities/product.entity";
import { User } from "../../users/entities/user.entity";

@Entity("reviews")
@Unique(["product_id", "user_id"])
export class Review extends BaseEntity {
  @Column({ type: "int" })
  product_id: number;

  @Column({ type: "int" })
  user_id: number;

  /** Rating from 1 to 5 */
  @Column({ type: "smallint" })
  rating: number;

  @Column({ type: "text", nullable: true, default: null })
  comment: string | null;

  @ManyToOne(() => Product, { onDelete: "CASCADE" })
  @JoinColumn({ name: "product_id" })
  product: Product;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;
}
