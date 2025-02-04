import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class ScheduleEntry {
  @ApiProperty({ description: 'Time slot number' })
  @Prop({ required: true })
  timeSlotNumber: number;

  @ApiProperty({ description: 'Student ID' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  studentId: string;

  @ApiProperty({ description: 'Room ID' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Room' })
  roomId: string;

  @ApiProperty({ description: 'Subject ID' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Subject' })
  subjectId: string;

  @ApiProperty({ description: 'Whether this entry is locked' })
  @Prop({ default: false })
  isLocked: boolean;
}

export type ScheduleDocument = Schedule & Document;

@Schema({ timestamps: true })
export class Schedule {
  @ApiProperty({ description: 'Template ID' })
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'ScheduleTemplate',
    required: true,
  })
  templateId: string;

  @ApiProperty({ type: [ScheduleEntry], description: 'Schedule entries' })
  @Prop({ type: [ScheduleEntry] })
  entries: ScheduleEntry[];

  @ApiProperty({ example: 'Fall 2024', description: 'Schedule name' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ example: true, description: 'Schedule active status' })
  @Prop({ default: true })
  isActive: boolean;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
