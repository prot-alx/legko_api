import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsArray,
  IsNumber,
  ValidateNested,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class TimeSlotDto {
  @ApiProperty({ example: 1, description: 'Lesson number' })
  @IsNumber()
  lessonNumber: number;

  @ApiProperty({ example: '08:00', description: 'Start time' })
  @IsString()
  startTime: string;

  @ApiProperty({ example: '09:00', description: 'End time' })
  @IsString()
  endTime: string;
}

export class CreateScheduleTemplateDto {
  @ApiProperty({ example: 'Default Template', description: 'Template name' })
  @IsString()
  name: string;

  @ApiProperty({ type: [TimeSlotDto], description: 'Time slots for lessons' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeSlotDto)
  timeSlots: TimeSlotDto[];

  @ApiProperty({ type: [String], description: 'Room IDs' })
  @IsArray()
  @IsString({ each: true })
  rooms: string[];

  @ApiProperty({ type: [String], description: 'Subject IDs' })
  @IsArray()
  @IsString({ each: true })
  subjects: string[];

  @ApiProperty({ example: true, description: 'Template active status' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
