import { ApiProperty } from '@nestjs/swagger';

import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GuestDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  age: number;
}

export class ConfirmInviteDto {
  @ValidateNested({ each: true })
  @ApiProperty({ example: [{ name: 'Jhon', age: 22 }] })
  @Type(() => GuestDto)
  guests: GuestDto[];
}
