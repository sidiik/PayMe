import { $Enums } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  Min,
  MinLength,
  isNotEmpty,
  isString,
} from 'class-validator';

export class CreateUser {
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(6)
  password: string;
  @IsString()
  @IsNotEmpty()
  firstname: string;
  @IsString()
  @IsNotEmpty()
  lastname: string;
  @IsNumberString()
  @IsNotEmpty()
  phoneNumber: string;
}

export class LoginUserDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}

export class UserDto {
  @Expose()
  id: number;
  @Expose()
  email: string;
  @Expose()
  firstname: string;
  @Expose()
  lastname: string;
  @Expose()
  @Type(() => Phone)
  Phone: string;
  @Expose()
  role: string;
  @Expose()
  isVerified: boolean;
}
export class loginDto {
  @Expose()
  id: number;
  @Expose()
  email: string;
  @Expose()
  access_token: string;
  @Expose()
  role: string;
}

export class Phone {
  @Expose()
  number: string;
}

export class changeRoleDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  role: $Enums.Roles;
  @IsBoolean()
  isVerified: boolean;
}
