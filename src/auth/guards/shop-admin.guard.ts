import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { UserRole } from '../../users/entities/user.entity';

@Injectable()
export class ShopAdminGuard implements CanActivate {
  private readonly logger = new Logger(ShopAdminGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const { shopId } = request.params;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (!shopId) {
      throw new BadRequestException('shopId parameter is required');
    }

    // Super admin can access all shops
    if (user.role === UserRole.SUPER_ADMIN) {
      return true;
    }

    // Organization admin can access shops in their organization
    if (user.role === UserRole.ORGANIZATION_ADMIN) {
      // This will be validated by passing organization context
      request.requiredOrganizationId = user.organization_id;
      return true;
    }

    // Shop admin can only access their own shop
    if (user.role === UserRole.BRANCH_ADMIN && user.shop_id == shopId) {
      return true;
    }

    this.logger.warn(
      `Unauthorized access attempt by user ${user.id} (${user.role}) to shop ${shopId}`,
    );
    throw new ForbiddenException('You can only manage your own shop');
  }
}
