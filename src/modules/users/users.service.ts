import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument, UserRole } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<GetUserDto> {
    const email = createUserDto.email.toLowerCase();
    const existingUser = await this.userModel.findOne({ email });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = new this.userModel({
      ...createUserDto,
      email,
      password: hashedPassword,
      role: createUserDto.role || UserRole.Student,
    });

    const savedUser = await newUser.save();
    return this.mapToGetUserDto(savedUser);
  }

  async validateUser(email: string, password: string): Promise<UserDocument> {
    const user = await this.findByEmail(email.toLowerCase());
    if (!user) {
      throw new UnauthorizedException('Неверные учетные данные');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверные учетные данные');
    }
    return user;
  }

  async findAll(): Promise<GetUserDto[]> {
    const users = await this.userModel.find().exec();
    return users.map((user) => this.mapToGetUserDto(user));
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findOne(id: string): Promise<GetUserDto> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return this.mapToGetUserDto(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<GetUserDto> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!updatedUser) throw new NotFoundException('User not found');

    return this.mapToGetUserDto(updatedUser);
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('User not found');
  }

  private mapToGetUserDto(user: UserDocument): GetUserDto {
    return {
      id: user._id as string,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      role: user.role,
      isActive: user.isActive,
    };
  }
}
