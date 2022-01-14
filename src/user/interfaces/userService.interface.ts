import { UserEntity } from '../../entities/User.entity';
import { IUserLogin } from './userLogin.interface';
import { IAuthLogin } from '../../auth/interfaces/authLogin.interface';

export interface IUserService {
  signUp(user: Partial<UserEntity>): Promise<UserEntity>;
  login(user: IUserLogin): Promise<UserEntity & IAuthLogin>;
  getInfo(userId: string, email: string): Promise<UserEntity>;
}
