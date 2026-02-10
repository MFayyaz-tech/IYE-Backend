import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { UserRole } from '../../users/entities/user.entity';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  private readonly logger = new Logger(SuperAdminGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (user.role !== UserRole.SUPER_ADMIN) {
      this.logger.warn(
        `Unauthorized access attempt by user ${user.id} (${user.role})`,
      );
      throw new ForbiddenException('Only Super Admin can perform this action');
    }

    return true;
  }
}
