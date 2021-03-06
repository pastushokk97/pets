import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { UserRepository } from '../../repositories/User.repository';
import { expiresIn, JwtSecret } from '../../app-constants/auth';

@Module({
  imports: [
    JwtModule.register({
      secret: JwtSecret,
      signOptions: { expiresIn },
    }),
    TypeOrmModule.forFeature([UserRepository]),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
