import { ValidatedUser } from './validated-user.interface';

export interface UserWithPassword extends ValidatedUser {
  password: string;
}
