import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type RoomDocument = Room & Document;

@Schema({ timestamps: true })
export class Room {
  @ApiProperty({ example: '101', description: 'Room number' })
  @Prop({ required: true, unique: true })
  number: string;

  @ApiProperty({ example: 30, description: 'Room capacity' })
  @Prop({ required: true })
  capacity: number;

  @ApiProperty({ example: 'Physics Lab', description: 'Room description' })
  @Prop()
  description?: string;

  @ApiProperty({ example: true, description: 'Room availability status' })
  @Prop({ default: true })
  isAvailable: boolean;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
