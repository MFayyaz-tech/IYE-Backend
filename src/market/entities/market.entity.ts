import { Entity, Column } from "typeorm";
import { BaseEntity } from "../../common/entities/base.entity";

@Entity("markets")
export class Market extends BaseEntity {
  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "varchar", length: 500, nullable: true, default: null })
  location: string | null;

  @Column({ type: "text", nullable: true, default: null })
  description: string | null;
}
