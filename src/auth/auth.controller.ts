import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  SignupDto,
  LoginDto,
  RequestOtpDto,
  VerifyOtpDto,
  ResetPasswordDto,
  UpdateProfileDto,
  AuthResponseDto,
} from './auth.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  /**
   * Signup endpoint
   */
  @Post('signup')
  async signup(@Body() signupDto: SignupDto): Promise<AuthResponseDto> {
    this.logger.log(`[signup] Signup request for ${signupDto.email}`);
    return this.authService.signup({ role: 'super_admin', ...signupDto });
  }

  /**
   * Login endpoint
   */
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    this.logger.log(`[login] Login request for ${loginDto.email}`);
    return this.authService.login(loginDto);
  }

  /**
   * Request OTP endpoint
   */
  @Post('request-otp')
  async requestOtp(
    @Body() requestOtpDto: RequestOtpDto,
  ): Promise<AuthResponseDto> {
    this.logger.log(`[requestOtp] OTP request for ${requestOtpDto.email}`);
    return this.authService.requestOtp(requestOtpDto);
  }

  /**
   * Verify OTP endpoint
   */
  @Post('verify-otp')
  async verifyOtp(
    @Body() verifyOtpDto: VerifyOtpDto,
  ): Promise<AuthResponseDto> {
    this.logger.log(`[verifyOtp] OTP verification for ${verifyOtpDto.email}`);
    return this.authService.verifyOtp(verifyOtpDto);
  }

  /**
   * Reset password endpoint (requires valid OTP)
   */
  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<AuthResponseDto> {
    this.logger.log(
      `[resetPassword] Password reset for ${resetPasswordDto.email}`,
    );
    return this.authService.resetPassword(resetPasswordDto);
  }

  /**
   * Forgot password endpoint (sends OTP)
   */
  @Post('forgot-password')
  async forgotPassword(
    @Body() body: { email: string },
  ): Promise<AuthResponseDto> {
    this.logger.log(
      `[forgotPassword] Password reset request for ${body.email}`,
    );
    return this.authService.forgotPassword(body.email);
  }

  /**
   * Update profile endpoint
   */
  @Put('profile/:userId')
  async updateProfile(
    @Param('userId') userId: number,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<AuthResponseDto> {
    this.logger.log(`[updateProfile] Profile update for user ${userId}`);
    return this.authService.updateProfile(userId, updateProfileDto);
  }
}
