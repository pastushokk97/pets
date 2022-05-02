import { Request } from 'express';
import { UserEntity } from '../entities/User.entity';

export interface IAuthenticateReq extends Request {
  user: UserEntity;
}
