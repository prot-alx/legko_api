import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class TimeSlot {
  @ApiProperty({ example: 1, description: 'Lesson number' })
  @Prop({ required: true })
  lessonNumber: number;

  @ApiProperty({ example: '08:00', description: 'Start time' })
  @Prop({ required: true })
  startTime: string;

  @ApiProperty({ example: '09:00', description: 'End time' })
  @Prop({ required: true })
  endTime: string;
}

export type ScheduleTemplateDocument = ScheduleTemplate & Document;

@Schema({ timestamps: true })
export class ScheduleTemplate {
  @ApiProperty({ example: 'Default Template', description: 'Template name' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ type: [TimeSlot], description: 'Time slots for lessons' })
  @Prop({
    type: [{ lessonNumber: Number, startTime: String, endTime: String }],
  })
  timeSlots: TimeSlot[];

  @ApiProperty({
    type: [String],
    description: 'Room IDs available in this template',
  })
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Room' }] })
  rooms: string[];

  @ApiProperty({
    type: [String],
    description: 'Subject IDs available in this template',
  })
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Subject' }] })
  subjects: string[];

  @ApiProperty({ example: true, description: 'Template active status' })
  @Prop({ default: true })
  isActive: boolean;
}

export const ScheduleTemplateSchema =
  SchemaFactory.createForClass(ScheduleTemplate);
