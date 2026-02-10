import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User, UserRole } from '../users/entities/user.entity';
import {
  SignupDto,
  LoginDto,
  RequestOtpDto,
  VerifyOtpDto,
  ResetPasswordDto,
  UpdateProfileDto,
  AuthResponseDto,
} from './auth.dto';
import * as nodemailer from 'nodemailer';
import { EnvironmentConfigService } from 'src/config/environment-config/environment-config.service';
import { IJwtServicePayload } from 'src/adapters/jwt.interface';
import { JwtTokenService } from 'src/utils-services/jwt/jwt.service';
import { BcryptService } from 'src/utils-services/bcrypt/bcrypt.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtConfig: EnvironmentConfigService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly bcryptService: BcryptService,
  ) {
    // Initialize email transporter (configure with your email service)
    // this.transporter = nodemailer.createTransport({
    //   service: process.env.EMAIL_SERVICE || 'gmail',
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASSWORD,
    //   },02
    // });
  }

  async getCookieWithJwtToken(email: string) {
    const payload: IJwtServicePayload = { email };
    const secret = this.jwtConfig.getJwtSecret();
    const expiresIn = +this.jwtConfig.getJwtExpirationTime();
    const token = this.jwtTokenService.createToken(payload, secret, expiresIn);
    return token;
    // return `Authentication=${token}; SameSite=None;  Secure=true; HttpOnly; Path=/; Max-Age=${this.jwtConfig.getJwtExpirationTime()}`;
  }

  async getCookieWithJwtRefreshToken(email: string) {
    const payload: IJwtServicePayload = { email };
    const secret = this.jwtConfig.getJwtRefreshSecret();
    const expiresIn = +this.jwtConfig.getJwtRefreshExpirationTime();
    const token = this.jwtTokenService.createToken(payload, secret, expiresIn);
    await this.setCurrentRefreshToken(token, email);
    //set cookie
    return token;
    // const cookie = `Refresh=${token}; SameSite=None; Secure=true; HttpOnly; Path=/; Max-Age=${this.jwtConfig.getJwtRefreshExpirationTime()}`;
    // return cookie;
  }

  async setCurrentRefreshToken(refreshToken: string, email: string) {
    const currentHashedRefreshToken =
      await this.bcryptService.hash(refreshToken);
    // await this.userRepository.updateRefreshToken(
    //   email,
    //   currentHashedRefreshToken,
    // );
  }

  getCookieForAuthCheck() {
    const cookie = `AuthCheck=true; SameSite=None;  Secure=true; Path=/; Max-Age=${this.jwtConfig.getJwtRefreshExpirationTime()}`;
    return cookie;
  }
  /**
   * Signup user
   */
  async signup(signupDto: SignupDto): Promise<AuthResponseDto> {
    try {
      const { name, email, password, role } = signupDto;

      // Check if user already exists
      const existingUser = await this.usersService.findByEmail(email);
      console.log('Existing User:', existingUser);
      if (existingUser) {
        return {
          success: false,
          message: 'User already exists',
          error: 'Email already registered',
        };
      }

      // Create user
      const user = await this.usersService.create({
        name,
        email,
        password,
        role: (role as UserRole) || UserRole.CUSTOMER,
        is_verified: true,
      });

      // Generate and send OTP
      // const otp = this.usersService.generateOtp();
      // const otpExpiry = this.usersService.generateOtpExpiry();
      // await this.usersService.setOtp(email, 1111, otpExpiry);

      // Send OTP via email
      // await this.sendOtpEmail(email, otp, name);

      return {
        success: true,
        message: 'Signup successful. OTP sent to email.',
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      };
    } catch (error) {
      this.logger.error(`[signup] Error: ${error}`);
      return {
        success: false,
        message: 'Signup failed',
        error: error.message,
      };
    }
  }

  /**
   * Login user
   */
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    try {
      const { email, password } = loginDto;

      // Find user
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        return {
          success: false,
          message: 'Invalid credentials',
          error: 'User not found',
        };
      }

      // Check password
      const isPasswordValid = await this.usersService.validatePassword(
        password,
        user.password,
      );
      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid credentials',
          error: 'Incorrect password',
        };
      }

      // Check if user is verified
      if (!user.is_verified) {
        return {
          success: false,
          message: 'User not verified',
          error: 'Please verify your email first',
        };
      }

      // Update last login
      await this.usersService.updateLastLogin(user.id);
      const accessTokenCookie = await this.getCookieWithJwtToken(user.email);

      const refreshTokenCookie = await this.getCookieWithJwtRefreshToken(
        user.email,
      );

      const authCheckCookie = this.getCookieForAuthCheck();

      return {
        success: true,
        message: 'Login successful',
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          profile: user.profile,
        },
        authentication: accessTokenCookie,
        refresh: refreshTokenCookie,
      };
    } catch (error) {
      this.logger.error(`[login] Error: ${error}`);
      return {
        success: false,
        message: 'Login failed',
        error: error.message,
      };
    }
  }

  /**
   * Request OTP (for password reset or verification)
   */
  async requestOtp(requestOtpDto: RequestOtpDto): Promise<AuthResponseDto> {
    try {
      const { email } = requestOtpDto;

      // Find user
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        return {
          success: false,
          message: 'User not found',
          error: 'Email not registered',
        };
      }

      // Generate and send OTP
      const otp = this.usersService.generateOtp();
      const otpExpiry = this.usersService.generateOtpExpiry();
      await this.usersService.setOtp(email, String(1111), otpExpiry);

      // Send OTP via email
      // await this.sendOtpEmail(email, otp, user.name);

      return {
        success: true,
        message: 'OTP sent to email',
      };
    } catch (error) {
      this.logger.error(`[requestOtp] Error: ${error}`);
      return {
        success: false,
        message: 'Failed to send OTP',
        error: error.message,
      };
    }
  }

  /**
   * Verify OTP
   */
  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<AuthResponseDto> {
    try {
      const { email, otp } = verifyOtpDto;

      // Verify OTP
      const isValid = await this.usersService.verifyOtp(email, otp);
      if (!isValid) {
        return {
          success: false,
          message: 'Invalid or expired OTP',
          error: 'OTP verification failed',
        };
      }

      const user = await this.usersService.findByEmail(email);

      return {
        success: true,
        message: 'OTP verified successfully',
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      };
    } catch (error) {
      this.logger.error(`[verifyOtp] Error: ${error}`);
      return {
        success: false,
        message: 'OTP verification failed',
        error: error.message,
      };
    }
  }

  /**
   * Reset password (requires valid OTP)
   */
  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<AuthResponseDto> {
    try {
      const { email, otp, newPassword } = resetPasswordDto;

      // Verify OTP first
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        return {
          success: false,
          message: 'User not found',
          error: 'Email not registered',
        };
      }

      if (!user.otp || user.otp !== otp) {
        return {
          success: false,
          message: 'Invalid OTP',
          error: 'OTP does not match',
        };
      }

      if (!user.otp_expiry || new Date() > user.otp_expiry) {
        return {
          success: false,
          message: 'OTP expired',
          error: 'Please request a new OTP',
        };
      }

      // Update password
      await this.usersService.updatePassword(email, newPassword);

      return {
        success: true,
        message: 'Password reset successful',
      };
    } catch (error) {
      this.logger.error(`[resetPassword] Error: ${error}`);
      return {
        success: false,
        message: 'Password reset failed',
        error: error.message,
      };
    }
  }

  /**
   * Forgot password (sends OTP)
   */
  async forgotPassword(email: string): Promise<AuthResponseDto> {
    return this.requestOtp({ email });
  }

  /**
   * Update profile
   */
  async updateProfile(
    userId: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<AuthResponseDto> {
    try {
      const user = await this.usersService.updateProfile(
        userId,
        updateProfileDto,
      );

      if (!user) {
        return {
          success: false,
          message: 'User not found',
          error: 'Failed to update profile',
        };
      }

      const updatedUser = await this.usersService.findById(userId);

      return {
        success: true,
        message: 'Profile updated successfully',
        data: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          profile: updatedUser.profile,
        },
      };
    } catch (error) {
      this.logger.error(`[updateProfile] Error: ${error}`);
      return {
        success: false,
        message: 'Failed to update profile',
        error: error.message,
      };
    }
  }

  /**
   * Send OTP email
   */
  private async sendOtpEmail(
    email: string,
    otp: string,
    name: string,
  ): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        html: `
          <h2>Hello ${name},</h2>
          <p>Your OTP code is: <strong>${otp}</strong></p>
          <p>This code will expire in 5 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`[sendOtpEmail] OTP sent to ${email}`);
    } catch (error) {
      this.logger.error(`[sendOtpEmail] Error sending OTP: ${error}`);
      throw error;
    }
  }
}
