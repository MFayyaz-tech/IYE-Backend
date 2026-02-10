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
export class OrganizationAdminGuard implements CanActivate {
  private readonly logger = new Logger(OrganizationAdminGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const { organizationId } = request.params;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (!organizationId) {
      throw new BadRequestException('organizationId parameter is required');
    }

    // Super admin can access all organizations
    if (user.role === UserRole.SUPER_ADMIN) {
      return true;
    }

    // Organization admin can only access their own organization
    if (
      user.role === UserRole.ORGANIZATION_ADMIN &&
      user.organization_id == organizationId
    ) {
      return true;
    }

    this.logger.warn(
      `Unauthorized access attempt by user ${user.id} (${user.role}) to organization ${organizationId}`,
    );
    throw new ForbiddenException('You can only manage your own organization');
  }
}
