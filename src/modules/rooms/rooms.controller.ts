import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { RoomsService } from './rooms.service';
import { Room } from './schemas/room.schema';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

@ApiTags('Rooms Management')
@Controller('rooms')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @Roles(UserRole.Admin)
  @ApiOperation({
    summary: 'Create a new room',
    description:
      'Creates a new room with the provided details. Only accessible by administrators.',
  })
  @ApiBody({
    type: CreateRoomDto,
    description: 'Room creation data',
    examples: {
      example1: {
        value: {
          number: '101',
          capacity: 30,
          description: 'Physics Laboratory',
          isAvailable: true,
        },
        summary: 'Basic room creation example',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The room has been successfully created.',
    type: Room,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Room number already exists.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User is not authenticated.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User does not have admin privileges.',
  })
  async create(@Body() createRoomDto: CreateRoomDto): Promise<Room> {
    return await this.roomsService.create(createRoomDto);
  }

  @Get()
  @Roles(UserRole.Admin, UserRole.Teacher, UserRole.Student)
  @ApiOperation({
    summary: 'Get all rooms',
    description: 'Retrieves a list of all rooms in the system.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all rooms.',
    type: [Room],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User is not authenticated.',
  })
  async findAll(): Promise<Room[]> {
    return await this.roomsService.findAll();
  }

  @Get('available')
  @Roles(UserRole.Admin, UserRole.Teacher, UserRole.Student)
  @ApiOperation({
    summary: 'Get available rooms',
    description: 'Retrieves a list of all available rooms.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of available rooms.',
    type: [Room],
  })
  async findAvailable(): Promise<Room[]> {
    return await this.roomsService.findAvailable();
  }

  @Get('number/:number')
  @Roles(UserRole.Admin, UserRole.Teacher, UserRole.Student)
  @ApiOperation({
    summary: 'Find room by number',
    description: 'Retrieves a specific room by its number.',
  })
  @ApiParam({
    name: 'number',
    description: 'Room number to search for',
    example: '101',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The found room.',
    type: Room,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Room with specified number was not found.',
  })
  async findByNumber(@Param('number') number: string): Promise<Room> {
    return await this.roomsService.findByNumber(number);
  }

  @Put(':id')
  @Roles(UserRole.Admin)
  @ApiOperation({
    summary: 'Update room',
    description: 'Updates an existing room with new data.',
  })
  @ApiParam({
    name: 'id',
    description: 'Room ID',
  })
  @ApiBody({
    type: UpdateRoomDto,
    description: 'Room update data',
    examples: {
      example1: {
        value: {
          capacity: 35,
          description: 'Updated Physics Laboratory',
        },
        summary: 'Basic room update example',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The room has been successfully updated.',
    type: Room,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Room not found.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Room number already exists.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomDto,
  ): Promise<Room> {
    return await this.roomsService.update(id, updateRoomDto);
  }

  @Put(':id/availability')
  @Roles(UserRole.Admin)
  @ApiOperation({
    summary: 'Update room availability',
    description: 'Updates the availability status of a room.',
  })
  @ApiParam({
    name: 'id',
    description: 'Room ID',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        isAvailable: {
          type: 'boolean',
          description: 'Room availability status',
        },
      },
    },
    examples: {
      available: {
        value: { isAvailable: true },
        summary: 'Mark room as available',
      },
      unavailable: {
        value: { isAvailable: false },
        summary: 'Mark room as unavailable',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Room availability has been updated.',
    type: Room,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Room not found.',
  })
  async updateAvailability(
    @Param('id') id: string,
    @Body('isAvailable') isAvailable: boolean,
  ): Promise<Room> {
    return await this.roomsService.updateAvailability(id, isAvailable);
  }

  @Delete(':id')
  @Roles(UserRole.Admin)
  @ApiOperation({
    summary: 'Delete room',
    description: 'Deletes a room from the system.',
  })
  @ApiParam({
    name: 'id',
    description: 'Room ID to delete',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Room has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Room not found.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User does not have admin privileges.',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.roomsService.remove(id);
  }
}
