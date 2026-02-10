import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from 'src/users/users.service';
import { EnvironmentConfigService } from 'src/config/environment-config/environment-config.service';
import { JwtTokenService } from 'src/utils-services/jwt/jwt.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    private readonly jwtTokenService: JwtTokenService,
    private readonly configService: EnvironmentConfigService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Missing authorization header');
    }

    const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

    if (!token) {
      throw new UnauthorizedException('Invalid authorization header format');
    }

    try {
      const secret = this.configService.getJwtSecret();
      const decoded = this.jwtTokenService.verifyToken(token, secret);

      // Fetch user from database
      const user = await this.usersService.findByEmail(decoded.email);
      console.log('Authenticated user:', user);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Attach user to request
      request.user = user;
      return true;
    } catch (error) {
      this.logger.error(`JWT verification failed: ${error.message}`);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
