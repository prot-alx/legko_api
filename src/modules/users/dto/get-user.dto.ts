import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../schemas/user.schema';

export class GetUserDto {
  @ApiProperty({ example: 'asd123asd123', description: 'User ID' })
  id: string;

  @ApiProperty({ example: 'user@example.com', description: 'Email address' })
  email: string;

  @ApiProperty({ example: 'John', description: 'First name' })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  lastName: string;

  @ApiPropertyOptional({ example: 'James', description: 'Middle name' })
  middleName?: string;

  @ApiProperty({ enum: UserRole, description: 'User role' })
  role: UserRole;

  @ApiProperty({ default: true, description: 'User active status' })
  isActive: boolean;
}
