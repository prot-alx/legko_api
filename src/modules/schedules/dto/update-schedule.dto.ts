import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId, IsOptional } from 'class-validator';
import { ScheduleEntry } from '../schemas/schedule.schema';

export class UpdateScheduleDto {
  @ApiProperty({
    type: [ScheduleEntry],
    description: 'Updated schedule entries',
  })
  @IsArray()
  @IsOptional()
  entries?: ScheduleEntry[];

  @ApiProperty({ description: 'Template ID' })
  @IsMongoId()
  @IsOptional()
  templateId?: string;

  @ApiProperty({ description: 'Is schedule active' })
  @IsOptional()
  isActive?: boolean;
}
