import { UserRole } from './entities/user.entity';

export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  shop_id?: number;
  organization_id?: number;
}

export class UpdateUserDto {
  name?: string;
  email?: string;
  role?: UserRole;
  shop_id?: number;
  organization_id?: number;
}

export class ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export class UserResponseDto {
  id: number;
  name: string;
  email: string;
  role: string;
  is_verified: boolean;
  is_active: boolean;
  profile?: any;
  last_login?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export class UserListResponseDto {
  success: boolean;
  message: string;
  data?: UserResponseDto[];
  error?: string;
}

export class UserSingleResponseDto {
  success: boolean;
  message: string;
  data?: UserResponseDto;
  error?: string;
}

export class GenericResponseDto {
  success: boolean;
  message: string;
  error?: string;
}
