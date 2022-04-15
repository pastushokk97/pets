import { UserEntity } from '../../entities/User.entity';
import { IAuthLogin } from '../../middlewares/auth/interfaces/authLogin.interface';

export interface IUserLogin {
  email: string;
  password: string;
}

export type UserLogin = {
  token: IAuthLogin;
  user: UserEntity;
};
