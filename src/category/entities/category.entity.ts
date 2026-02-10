import { Entity, Column } from "typeorm";
import { BaseEntity } from "../../common/entities/base.entity";

@Entity("categories")
export class Category extends BaseEntity {
  @Column({ type: "varchar", length: 255 })
  name: string;

  /** Optional description */
  @Column({ type: "text", nullable: true, default: null })
  description: string | null;

  /** Path/URL to category icon */
  @Column({ type: "varchar", length: 500, nullable: true, default: null })
  icon: string | null;

  /** Path/URL to category image */
  @Column({ type: "varchar", length: 500, nullable: true, default: null })
  image: string | null;
}
