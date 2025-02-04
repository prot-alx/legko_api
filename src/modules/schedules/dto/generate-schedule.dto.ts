import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId, IsNumber, IsString, Min } from 'class-validator';

export class StudentLessonsDto {
  @ApiProperty({ description: 'Student ID' })
  @IsMongoId()
  studentId: string;

  @ApiProperty({ description: 'Number of lessons required' })
  @IsNumber()
  @Min(1)
  numberOfLessons: number;
}

export class GenerateScheduleDto {
  @ApiProperty({ description: 'Schedule template ID' })
  @IsMongoId()
  templateId: string;

  @ApiProperty({ description: 'Schedule name' })
  @IsString()
  name: string;

  @ApiProperty({
    type: [StudentLessonsDto],
    description: 'Students and their required lessons',
  })
  @IsArray()
  students: StudentLessonsDto[];
}
