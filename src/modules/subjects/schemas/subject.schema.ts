import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type SubjectDocument = Subject & Document;

@Schema({ timestamps: true })
export class Subject {
  @ApiProperty({ example: 'Mathematics', description: 'Subject name' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ example: 'MATH101', description: 'Subject code' })
  @Prop({ required: true, unique: true })
  code: string;

  @ApiProperty({ description: 'Subject description' })
  @Prop()
  description?: string;
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);
