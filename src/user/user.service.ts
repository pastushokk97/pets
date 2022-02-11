import * as crypto from 'crypto';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { USER_ERROR } from '../app-constants/error-text';
import { UserEntity } from '../entities/User.entity';
import { UserRepository } from '../repositories/User.repository';
import { AuthService } from '../auth/auth.service';
import { IUserLogin } from './interfaces/userLogin.interface';
import { IAuthLogin } from '../auth/interfaces/authLogin.interface';
import { IUserService } from './interfaces/userService.interface';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService implements IUserService {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

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

      const test = this.userRepository.create({ ...user, password: hash });

      const userTest = await this.userRepository.save(
        this.userRepository.create({
          ...user,
          password: hash,
          // createdDate: new Date(),
        }),
      );
      return userTest;
    } catch (e) {
      console.log(e);
    }
  }

  async login(user: IUserLogin): Promise<UserEntity & IAuthLogin> {
    const userInDB = await this.userRepository.findOneByEmail(user.email);

    if (!userInDB) {
      throw new NotFoundException(USER_ERROR.userNotFound);
    }

    const hash = UserService.hashPassword(user.password);

    if (userInDB.password !== hash) {
      throw new ForbiddenException(USER_ERROR.incorrectPassword);
    }

    const token = await this.authService.login(userInDB);

    return { ...userInDB, ...token } as any;
  }

  async getInfo(userId: string, email: string): Promise<UserEntity> {
    const userById = await this.userRepository.findOneById(userId);
    if (userById) {
      return userById;
    }

    const userByEmail = await this.userRepository.findOneByEmail(email);
    if (userByEmail) {
      return userByEmail;
    }

    throw new NotFoundException(USER_ERROR.userNotFound);
  }
}
