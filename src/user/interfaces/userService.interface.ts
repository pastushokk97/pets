import { UserEntity } from '../../entities/User.entity';
import { IUserLogin, UserLogin } from './userLogin.interface';

export interface IUserService {
  signUp(user: Partial<UserEntity>): Promise<UserEntity>;
  login(user: IUserLogin): Promise<UserLogin>;
  getInfo(userId: string, email: string): Promise<UserEntity>;
}
