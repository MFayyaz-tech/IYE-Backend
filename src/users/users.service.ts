import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UpdateUserDto } from './users.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    const result = await this.userRepository.query(
      `SELECT u.*, o.id as organization_id, s.id as shop_id
       FROM users u
       LEFT JOIN organizations o ON u.id = o.manager_user_id
       LEFT JOIN shops s ON u.id = s.manager_user_id
       WHERE u.email = $1`,
      [email],
    );
    return result[0] || null;
  }

  /**
   * Find user by ID
   */
  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  /**
   * Create new user
   */
  async create(data: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
    is_verified?: boolean;
    shop_id?: number;
    organization_id?: number;
  }): Promise<User> {
    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Generate API key

    const user = this.userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role || UserRole.CUSTOMER,
      is_verified: data.is_verified || true,
      shop_id: data.shop_id || null,
      organization_id: data.organization_id || null,
    });

    return this.userRepository.save(user);
  }

  /**
   * Validate password
   */
  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Generate OTP
   */
  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Generate OTP expiry (5 minutes from now)
   */
  generateOtpExpiry(): Date {
    const now = new Date();
    return new Date(now.getTime() + 5 * 60 * 1000);
  }

  /**
   * Generate API key
   */
  private generateApiKey(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Set OTP for user
   */
  async setOtp(email: string, otp: string, expiry: Date): Promise<void> {
    await this.userRepository.update({ email }, { otp, otp_expiry: expiry });
  }

  /**
   * Verify OTP
   */
  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const user = await this.findByEmail(email);

    if (!user || !user.otp || user.otp !== otp) {
      return false;
    }

    if (!user.otp_expiry || new Date() > user.otp_expiry) {
      return false;
    }

    // Clear OTP after successful verification
    await this.userRepository.update(
      { email },
      { otp: null, otp_expiry: null, is_verified: true },
    );

    return true;
  }

  /**
   * Update password
   */
  async updatePassword(email: string, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(
      { email },
      { password: hashedPassword, otp: null, otp_expiry: null },
    );
  }

  /**
   * Update profile
   */
  async updateProfile(
    id: number,
    profileData: UpdateUserDto,
  ): Promise<User | null> {
    const user = await this.findById(id);

    if (!user) {
      return null;
    }

    const updatedProfile = {
      ...profileData,
    };

    await this.userRepository.update({ id }, updatedProfile);

    return this.findById(id);
  }

  /**
   * Update user
   */
  async update(id: number, data: Partial<User>): Promise<User | null> {
    await this.userRepository.update(id, data);
    return this.findById(id);
  }

  /**
   * Update last login
   */
  async updateLastLogin(id: number): Promise<void> {
    await this.userRepository.update({ id }, { last_login: new Date() });
  }

  /**
   * Delete user
   */
  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  /**
   * Get all users
   */
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  /**
   * Deactivate user
   */
  async deactivate(id: number): Promise<void> {
    await this.userRepository.update({ id }, { is_active: false });
  }

  /**
   * Activate user
   */
  async activate(id: number): Promise<void> {
    await this.userRepository.update({ id }, { is_active: true });
  }
}
