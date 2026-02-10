import {
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  IsNotEmpty,
} from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  role?: string;
}

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class RequestOtpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  otp: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  otp: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  newPassword: string;
}

export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  profile?: string;
}

export class AuthResponseDto {
  success: boolean;
  message: string;
  data?: {
    id?: number;
    email?: string;
    name?: string;
    role?: string;
    api_key?: string;
    token?: string;
    profile?: any;
  };
  authentication?: string;
  refresh?: string;
  error?: string;
}
