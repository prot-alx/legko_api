import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  Matches,
} from 'class-validator';

export enum UserRole {
  Admin = 'admin',
  Teacher = 'teacher',
  Student = 'student',
}

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @ApiProperty({ example: 'user@example.com', description: 'Email address' })
  @Prop({
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Hashed password' })
  @Prop({ required: true })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  @IsString()
  password: string;

  @ApiProperty({ example: 'John', description: 'First name' })
  @Prop({ required: true, trim: true })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  @Prop({ required: true, trim: true })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({ example: 'James', description: 'Middle name' })
  @Prop({ required: false, trim: true })
  @IsString()
  @IsOptional()
  middleName?: string;

  @ApiProperty({
    enum: UserRole,
    default: UserRole.Student,
    description: 'User role',
  })
  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.Student,
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ default: true, description: 'User active status' })
  @Prop({ default: true })
  @IsBoolean()
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ role: 1 });

UserSchema.virtual('fullName').get(function (this: UserDocument) {
  return `${this.firstName} ${this.middleName ? this.middleName + ' ' : ''}${this.lastName}`;
});
