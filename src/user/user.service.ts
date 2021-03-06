import * as crypto from 'crypto';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Connection } from 'typeorm';

import { USER_ERROR } from '../app-constants/error-text';
import { UserEntity } from '../entities/User.entity';
import { UserRepository } from '../repositories/User.repository';
import { AuthService } from '../middlewares/auth/auth.service';
import { IUserLogin, UserLogin } from './interfaces/userLogin.interface';
import { IUserService } from './interfaces/userService.interface';

@Injectable()
export class UserService implements IUserService {
  private readonly userRepository: UserRepository;

  constructor(
    private readonly authService: AuthService,
    private readonly connection: Connection,
  ) {
    this.userRepository = this.connection.getCustomRepository(UserRepository);
  }

  static hashPassword(password: string): string {
    return crypto.createHash('md5').update(password).digest('hex');
  }

  async signUp(user: Partial<UserEntity>): Promise<UserEntity> {
    try {
      const isRegistered = await this.userRepository.findOne({
        email: user.email,
      });

      if (isRegistered) {
        throw new ConflictException(USER_ERROR.userExist);
      }

      const hash = UserService.hashPassword(user.password);

      return await this.userRepository.save(
        this.userRepository.create({
          ...user,
          password: hash,
        }),
      );
    } catch (err) {
      throw err;
    }
  }

  async login(user: IUserLogin): Promise<UserLogin> {
    const userInDB = await this.userRepository.findOneByEmail(user.email);

    if (!userInDB) {
      throw new NotFoundException(USER_ERROR.userNotFound);
    }

    const hash = UserService.hashPassword(user.password);

    if (userInDB.password !== hash) {
      throw new ForbiddenException(USER_ERROR.incorrectPassword);
    }

    const token = await this.authService.login(userInDB.userId);

    return { user: userInDB, token };
  }

  async getInfo(userId?: string, email?: string): Promise<UserEntity> {
    const userById = await this.userRepository.findOneById(userId);
    if (userById) {
      return userById;
    }

    const userByEmail = await this.userRepository.findOneByEmail(email);
    if (!userByEmail) {
      throw new NotFoundException(USER_ERROR.userNotFound);
    }

    return userByEmail;
  }
}
