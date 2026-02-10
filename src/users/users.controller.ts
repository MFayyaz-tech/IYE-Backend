import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Logger,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  UpdateUserDto,
  ChangePasswordDto,
  UserSingleResponseDto,
  UserListResponseDto,
  GenericResponseDto,
} from './users.dto';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  /**
   * Get all users
   */
  @Get()
  async getAllUsers(): Promise<UserListResponseDto> {
    try {
      this.logger.log('[getAllUsers] Fetching all users');
      const users = await this.usersService.findAll();

      return {
        success: true,
        message: 'Users fetched successfully',
        data: users.map((user) => this.mapUserToResponse(user)),
      };
    } catch (error) {
      this.logger.error(`[getAllUsers] Error: ${error}`);
      return {
        success: false,
        message: 'Failed to fetch users',
        error: error.message,
      };
    }
  }

  /**
   * Get user by ID
   */
  @Get(':id')
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserSingleResponseDto> {
    try {
      this.logger.log(`[getUserById] Fetching user ${id}`);
      const user = await this.usersService.findById(id);

      if (!user) {
        return {
          success: false,
          message: 'User not found',
          error: `User with ID ${id} does not exist`,
        };
      }

      return {
        success: true,
        message: 'User fetched successfully',
        data: this.mapUserToResponse(user),
      };
    } catch (error) {
      this.logger.error(`[getUserById] Error: ${error}`);
      return {
        success: false,
        message: 'Failed to fetch user',
        error: error.message,
      };
    }
  }

  /**
   * Get user by email
   */
  @Get('email/:email')
  async getUserByEmail(
    @Param('email') email: string,
  ): Promise<UserSingleResponseDto> {
    try {
      this.logger.log(`[getUserByEmail] Fetching user ${email}`);
      const user = await this.usersService.findByEmail(email);

      if (!user) {
        return {
          success: false,
          message: 'User not found',
          error: `User with email ${email} does not exist`,
        };
      }

      return {
        success: true,
        message: 'User fetched successfully',
        data: this.mapUserToResponse(user),
      };
    } catch (error) {
      this.logger.error(`[getUserByEmail] Error: ${error}`);
      return {
        success: false,
        message: 'Failed to fetch user',
        error: error.message,
      };
    }
  }

  /**
   * Create new user
   */
  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserSingleResponseDto> {
    try {
      this.logger.log(`[createUser] Creating user ${createUserDto.email}`);

      // Check if user already exists
      const existingUser = await this.usersService.findByEmail(
        createUserDto.email,
      );
      if (existingUser) {
        return {
          success: false,
          message: 'User already exists',
          error: 'Email already registered',
        };
      }

      const user = await this.usersService.create(createUserDto);

      return {
        success: true,
        message: 'User created successfully',
        data: this.mapUserToResponse(user),
      };
    } catch (error) {
      this.logger.error(`[createUser] Error: ${error}`);
      return {
        success: false,
        message: 'Failed to create user',
        error: error.message,
      };
    }
  }

  /**
   * Update user details
   */
  @Put(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserSingleResponseDto> {
    try {
      this.logger.log(`[updateUser] Updating user ${id}`);

      const user = await this.usersService.findById(id);
      if (!user) {
        return {
          success: false,
          message: 'User not found',
          error: `User with ID ${id} does not exist`,
        };
      }

      const updatedUser = await this.usersService.update(id, updateUserDto);

      return {
        success: true,
        message: 'User updated successfully',
        data: this.mapUserToResponse(updatedUser),
      };
    } catch (error) {
      this.logger.error(`[updateUser] Error: ${error}`);
      return {
        success: false,
        message: 'Failed to update user',
        error: error.message,
      };
    }
  }

  /**
   * Update user profile
   */
  @Put(':id/profile')
  async updateProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProfileDto: UpdateUserDto,
  ): Promise<UserSingleResponseDto> {
    try {
      this.logger.log(`[updateProfile] Updating profile for user ${id}`);

      const updatedUser = await this.usersService.updateProfile(
        id,
        updateProfileDto,
      );

      if (!updatedUser) {
        return {
          success: false,
          message: 'User not found',
          error: `User with ID ${id} does not exist`,
        };
      }

      return {
        success: true,
        message: 'Profile updated successfully',
        data: this.mapUserToResponse(updatedUser),
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
   * Change password
   */
  @Post(':id/change-password')
  async changePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<GenericResponseDto> {
    try {
      this.logger.log(`[changePassword] Changing password for user ${id}`);

      const user = await this.usersService.findById(id);
      if (!user) {
        return {
          success: false,
          message: 'User not found',
          error: `User with ID ${id} does not exist`,
        };
      }

      // Verify current password
      const isPasswordValid = await this.usersService.validatePassword(
        changePasswordDto.currentPassword,
        user.password,
      );

      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid current password',
          error: 'Current password is incorrect',
        };
      }

      // Update password
      await this.usersService.updatePassword(
        user.email,
        changePasswordDto.newPassword,
      );

      return {
        success: true,
        message: 'Password changed successfully',
      };
    } catch (error) {
      this.logger.error(`[changePassword] Error: ${error}`);
      return {
        success: false,
        message: 'Failed to change password',
        error: error.message,
      };
    }
  }

  /**
   * Deactivate user account
   */
  @Post(':id/deactivate')
  async deactivateUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GenericResponseDto> {
    try {
      this.logger.log(`[deactivateUser] Deactivating user ${id}`);

      const user = await this.usersService.findById(id);
      if (!user) {
        return {
          success: false,
          message: 'User not found',
          error: `User with ID ${id} does not exist`,
        };
      }

      await this.usersService.deactivate(id);

      return {
        success: true,
        message: 'User account deactivated successfully',
      };
    } catch (error) {
      this.logger.error(`[deactivateUser] Error: ${error}`);
      return {
        success: false,
        message: 'Failed to deactivate user',
        error: error.message,
      };
    }
  }

  /**
   * Activate user account
   */
  @Post(':id/activate')
  async activateUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GenericResponseDto> {
    try {
      this.logger.log(`[activateUser] Activating user ${id}`);

      const user = await this.usersService.findById(id);
      if (!user) {
        return {
          success: false,
          message: 'User not found',
          error: `User with ID ${id} does not exist`,
        };
      }

      await this.usersService.activate(id);

      return {
        success: true,
        message: 'User account activated successfully',
      };
    } catch (error) {
      this.logger.error(`[activateUser] Error: ${error}`);
      return {
        success: false,
        message: 'Failed to activate user',
        error: error.message,
      };
    }
  }

  /**
   * Delete user
   */
  @Delete(':id')
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GenericResponseDto> {
    try {
      this.logger.log(`[deleteUser] Deleting user ${id}`);

      const user = await this.usersService.findById(id);
      if (!user) {
        return {
          success: false,
          message: 'User not found',
          error: `User with ID ${id} does not exist`,
        };
      }

      await this.usersService.delete(id);

      return {
        success: true,
        message: 'User deleted successfully',
      };
    } catch (error) {
      this.logger.error(`[deleteUser] Error: ${error}`);
      return {
        success: false,
        message: 'Failed to delete user',
        error: error.message,
      };
    }
  }

  /**
   * Map user entity to response DTO
   */
  private mapUserToResponse(user: any) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      api_key: user.api_key,
      is_verified: user.is_verified,
      is_active: user.is_active,
      profile: user.profile,
      last_login: user.last_login,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }
}
