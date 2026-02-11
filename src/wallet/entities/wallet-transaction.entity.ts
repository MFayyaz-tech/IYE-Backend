import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "../../common/entities/base.entity";
import { Wallet } from "./wallet.entity";

export enum WalletTransactionType {
  CREDIT = "credit",
  DEBIT = "debit",
}

@Entity("wallet_transactions")
export class WalletTransaction extends BaseEntity {
  @Column({ type: "int" })
  wallet_id: number;

  /** Positive for credit, negative for debit; or use type + absolute amount */
  @Column({ type: "decimal", precision: 12, scale: 2 })
  amount: number;

  @Column({
    type: "enum",
    enum: WalletTransactionType,
  })
  type: WalletTransactionType;

  /** e.g. 'order', 'deposit', 'withdrawal', 'refund' */
  @Column({ type: "varchar", length: 50, nullable: true, default: null })
  reference_type: string | null;

  @Column({ type: "int", nullable: true, default: null })
  reference_id: number | null;

  @Column({ type: "text", nullable: true, default: null })
  description: string | null;

  /** Balance after this transaction (snapshot) */
  @Column({
    type: "decimal",
    precision: 12,
    scale: 2,
    nullable: true,
    default: null,
  })
  balance_after: number | null;

  @ManyToOne(() => Wallet, { onDelete: "CASCADE" })
  @JoinColumn({ name: "wallet_id" })
  wallet: Wallet;
}
