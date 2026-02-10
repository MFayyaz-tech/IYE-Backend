import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IJwtService, IJwtServicePayload } from 'src/adapters/jwt.interface';

@Injectable()
export class JwtTokenService implements IJwtService {
  constructor(private readonly jwtService: JwtService) {}

  async checkToken(token: string): Promise<any> {
    const decode = await this.jwtService.verifyAsync(token);
    return decode;
  }

  createToken(
    payload: IJwtServicePayload,
    secret: string,
    expiresIn: string | number,
  ): string {
    return this.jwtService.sign(payload as any, {
      secret: secret,
      expiresIn: expiresIn as any,
    });
  }
  verifyToken(token: string, secret: string): any {
    return this.jwtService.verify(token, { secret: secret });
  }
}
