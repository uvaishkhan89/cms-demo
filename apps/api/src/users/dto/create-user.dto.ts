import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { GENDERS_LIST, USER_ROLES_TYPE } from '../../common/constants/user.constant';

export class CreateUserDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  profilePicId: number;

  @IsString()
  line_1: string;

  @IsString()
  line_2: string;

  @IsString()
  locality: string;

  @IsNotEmpty()
  @IsNumber()
  cityId: number;

  @IsNotEmpty()
  @IsString()
  @IsEnum(GENDERS_LIST)
  gender: string;

  @IsString()
  qualification:string;

  @IsString()
  latitude: string;

  @IsString()
  longitude: string;

  @IsString()
  linkedIn_url: string;

  @IsString()
  facebook_url: string;

  @IsNotEmpty()
  @IsNumber()
  zip: number;

}