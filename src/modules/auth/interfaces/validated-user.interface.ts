import { UserRole } from 'src/modules/users/schemas/user.schema';

export interface ValidatedUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  role: UserRole;
  isActive: boolean;
}

export interface UserWithPassword extends ValidatedUser {
  password: string;
}

export type UserForAuth = Pick<ValidatedUser, 'email' | 'role' | 'isActive'>;
