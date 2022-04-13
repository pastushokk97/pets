import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { UserRepository } from '../repositories/User.repository';
import { IAuthLogin } from './interfaces/authLogin.interface';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async validateUser(req: Request): Promise<boolean> {
    // TODO: find token
    try {
      const token = req.rawHeaders[1].replace('Bearer ', '');
      const verifyUser = await this.jwtService.verify(token);

      const user = await this.userRepository.findOne({
        userId: verifyUser.userId,
      });

      if (user) {
        req['user'] = user;
        return true;
      }
      return false;
      // TODO: описать ошибку
    } catch (err: any) {
      throw new HttpException(err.message, HttpStatus.UNAUTHORIZED);
    }
  }

  async login(user: any): Promise<IAuthLogin> {
    const payload = { userId: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
