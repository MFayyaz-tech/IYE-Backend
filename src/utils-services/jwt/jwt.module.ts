import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtTokenService } from './jwt.service';

@Module({
  providers: [JwtTokenService, JwtService],
  exports: [JwtTokenService, JwtService],
})
export class JwtModule {}
