import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { UserRepository } from '../../repositories/User.repository';
import { IAuthLogin } from './interfaces/authLogin.interface';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async validateUser(req: Request): Promise<boolean> {
    try {
      const token = req.rawHeaders
        .find((item) => item.includes('Bearer'))
        .replace('Bearer ', '');
      const { userId } = await this.jwtService.verify(token);

      const user = await this.userRepository.findOne({
        userId,
      });

      if (user) {
        req['user'] = user;
        return true;
      }
      return false;
    } catch (err) {
      throw new HttpException(err, HttpStatus.UNAUTHORIZED);
    }
  }

  async login(userId: string): Promise<IAuthLogin> {
    return {
      access_token: this.jwtService.sign({ userId }),
    };
  }
}
