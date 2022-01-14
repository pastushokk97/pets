import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UserLoginDTO {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(96)
  public email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  public password: string;
}
