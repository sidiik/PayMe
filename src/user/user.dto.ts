import { Expose, Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  Min,
  MinLength,
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
}
export class loginDto {
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
  access_token: string;
}

export class Phone {
  @Expose()
  number: string;
}
