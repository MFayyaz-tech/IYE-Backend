import { Entity, Column } from "typeorm";
import { BaseEntity } from "../../common/entities/base.entity";

@Entity("kyc")
export class Kyc extends BaseEntity {
  /** Path/URL to BVN document */
  @Column({ type: "varchar", length: 500, nullable: true, default: null })
  bvn: string | null;

  /** Path/URL to NIN front image */
  @Column({ type: "varchar", length: 500, nullable: true, default: null })
  nin_front: string | null;

  /** Path/URL to NIN back image */
  @Column({ type: "varchar", length: 500, nullable: true, default: null })
  nin_back: string | null;

  /** BVN number (e.g. 11-digit Bank Verification Number) */
  @Column({ type: "varchar", length: 20, nullable: true, default: null })
  bvn_number: string | null;
}
