import { IsOptional } from 'class-validator';

export class UserInfoDto {
  @IsOptional()
  public userId: string;

  @IsOptional()
  public email: string;
}
