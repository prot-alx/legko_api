import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { GetUserDto } from './dto/get-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: User,
  })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Returns the list of all users.',
    type: [GetUserDto],
  })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single user by ID' })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the user',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the user with the specified ID.',
    type: User,
  })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the user to be updated',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    type: GetUserDto,
  })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the user to be deleted',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
