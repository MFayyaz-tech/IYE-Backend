import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "../../common/entities/base.entity";

export enum UserRole {
  USER = "user",
  VENDOR = "vendor",
  RAP = "rap",
}

export enum SocialLoginType {
  GOOGLE = "google",
  FACEBOOK = "facebook",
  APPLE = "apple",
}

@Entity("users")
export class User extends BaseEntity {
  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "varchar", length: 255, unique: true })
  email: string;

  @Column({ type: "varchar", length: 255 })
  phone: string;

  @Column({ type: "varchar", length: 255 })
  password: string;

  @Column({ type: "varchar", length: 6, nullable: true, default: null })
  otp: string | null;

  @Column({ type: "timestamp", nullable: true, default: null })
  otp_expiry: Date | null;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ type: "varchar", nullable: true, default: null })
  profile: string | null;

  @Column({ type: "boolean", default: false })
  is_verified: boolean;

  @Column({ type: "boolean", default: true })
  is_active: boolean;

  @Column({ type: "timestamp", nullable: true, default: null })
  last_login: Date | null;

  @Column({ type: "boolean", default: false })
  is_social_login: boolean;

  @Column({
    type: "enum",
    enum: SocialLoginType,
    nullable: true,
    default: null,
  })
  type: SocialLoginType | null;

  @Column({ type: "varchar", length: 255, nullable: true, default: null })
  social_provider_id: string | null;
}
