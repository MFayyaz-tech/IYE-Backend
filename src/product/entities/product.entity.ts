import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "../../common/entities/base.entity";
import { Category } from "../../category/entities/category.entity";
import { Store } from "../../store/entities/store.entity";

@Entity("products")
export class Product extends BaseEntity {
  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "int" })
  category_id: number;

  @Column({ type: "int" })
  store_id: number;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  price: number;

  @Column({ type: "int", default: 0 })
  quantity: number;

  @Column({ type: "text", nullable: true, default: null })
  description: string | null;

  /** e.g. "100%" */
  @Column({ type: "varchar", length: 50, nullable: true, default: null })
  purity: string | null;

  /** Unit for price/quantity: e.g. "kg", "piece", "bucket", "quantity", "litre", etc. */
  @Column({ type: "varchar", length: 50, nullable: true, default: null })
  unit: string | null;

  /** Path/URL to main product image */
  @Column({ type: "varchar", length: 500, nullable: true, default: null })
  main_image: string | null;

  /** Paths/URLs to additional product images (e.g. up to 4) */
  @Column({ type: "simple-array", nullable: true, default: null })
  additional_images: string[] | null;

  /** Number of users who rated this product */
  @Column({ type: "int", default: 0 })
  rating_count: number;

  /** Sum of all ratings (1–5); average = rating_total / rating_count */
  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  rating_total: number;

  @ManyToOne(() => Category, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "category_id" })
  category: Category;

  @ManyToOne(() => Store, { onDelete: "CASCADE" })
  @JoinColumn({ name: "store_id" })
  store: Store;
}
