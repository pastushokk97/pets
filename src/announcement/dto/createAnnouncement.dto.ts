import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { AnnouncementMedia } from '../../app-constants/types';

export class CreateAnnouncementDTO {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  public title: string;

  @IsOptional()
  @IsString()
  public description?: string;

  @IsNotEmpty()
  @IsString()
  public city: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  public region: string;

  @IsNotEmpty()
  @IsArray()
  public photos: AnnouncementMedia[];

  @IsOptional()
  @IsNumber()
  public price: number;

  @IsOptional()
  @IsString()
  @MaxLength(1)
  public currency: string;
}
