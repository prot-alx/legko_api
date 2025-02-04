import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSubjectDto {
  @ApiProperty({ example: 'Mathematics', description: 'Subject name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'MATH101', description: 'Subject code' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional({ description: 'Subject description' })
  @IsString()
  description?: string;
}
