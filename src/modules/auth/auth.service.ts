import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { UserForAuth } from './interfaces/validated-user.interface';
import { LoginResponse } from './interfaces/login-response.interface';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserForAuth | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return { email: user.email, role: user.role, isActive: user.isActive };
    }
    return null;
  }

  async login(user: UserForAuth): Promise<LoginResponse> {
    const fullUser = await this.usersService.findByEmail(user.email);

    if (!fullUser) {
      throw new Error('User not found');
    }
    const payload: JwtPayload = {
      sub: fullUser._id as string,
      email: fullUser.email,
      role: fullUser.role,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRATION,
    });

    return {
      accessToken,
      user: {
        id: fullUser._id as string,
        email: fullUser.email,
        role: fullUser.role,
      },
    };
  }
}
