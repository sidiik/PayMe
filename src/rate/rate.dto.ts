import { Expose, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  ValidateNested,
} from 'class-validator';
import { accTypeDto } from 'src/account/dto/account.dto';

export class setRateDto {
  @Type(() => accTypeDto)
  @IsNotEmpty()
  @ValidateNested()
  fromAccType: accTypeDto;

  @Type(() => accTypeDto)
  @IsNotEmpty()
  @ValidateNested()
  toAccType: accTypeDto;

  @IsNumberString()
  @IsNotEmpty()
  amount: string;
}

export class getRateDto {
  @Type(() => accTypeDto)
  @IsNotEmpty()
  @ValidateNested()
  fromAccType: accTypeDto;

  @Type(() => accTypeDto)
  @IsNotEmpty()
  @ValidateNested()
  toAccType: accTypeDto;
}

export class RateDto {
  @Expose()
  id: number;
  @Expose()
  amount: number;
  @Expose()
  createdAt: string;
  @Expose()
  updatedAt: string;
  @Expose()
  fromAccountType: any;
  @Expose()
  toAccountType: any;
}
