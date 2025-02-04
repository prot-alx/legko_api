import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../schemas/user.schema';

export class GetLoginedUserDto {
  @ApiProperty({ example: 'asd123asd123', description: 'User ID' })
  id: string;

  @ApiProperty({ example: 'user@example.com', description: 'Email address' })
  email: string;

  @ApiProperty({ enum: UserRole, description: 'User role' })
  role: UserRole;
}
