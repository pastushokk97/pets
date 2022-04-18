import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UserSignUpDTO {
  @IsString()
  @IsOptional()
  public firstname?: string;

  @IsString()
  @IsOptional()
  public lastname?: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @MaxLength(96)
  public email: string;

  @IsString()
  @IsOptional()
  @MaxLength(14)
  public phone?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  public password: string;
}
