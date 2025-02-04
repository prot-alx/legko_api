import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ example: '101', description: 'Room number' })
  @IsString()
  number: string;

  @ApiProperty({ example: 30, description: 'Room capacity' })
  @IsNumber()
  @Min(1)
  capacity: number;

  @ApiPropertyOptional({
    example: 'Physics Lab',
    description: 'Room description',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Room availability status',
  })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}
