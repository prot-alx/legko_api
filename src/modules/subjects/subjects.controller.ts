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
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SubjectsService } from './subjects.service';
import { Subject } from './schemas/subject.schema';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

@ApiTags('Subjects Management')
@Controller('subjects')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  @Roles(UserRole.Admin)
  @ApiOperation({
    summary: 'Create a new subject',
    description:
      'Creates a new subject in the system. Only accessible by administrators.',
  })
  @ApiBody({
    type: CreateSubjectDto,
    description: 'Subject creation data',
    examples: {
      example1: {
        value: {
          name: 'Mathematics',
          code: 'MATH101',
          description: 'Introduction to Mathematics',
        },
        summary: 'Basic subject creation example',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The subject has been successfully created.',
    type: Subject,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Subject code already exists.',
  })
  async create(@Body() createSubjectDto: CreateSubjectDto): Promise<Subject> {
    return await this.subjectsService.create(createSubjectDto);
  }

  @Get()
  @Roles(UserRole.Admin, UserRole.Teacher, UserRole.Student)
  @ApiOperation({
    summary: 'Get all subjects',
    description: 'Retrieves a list of all subjects in the system.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all subjects.',
    type: [Subject],
  })
  async findAll(): Promise<Subject[]> {
    return await this.subjectsService.findAll();
  }

  @Get('code/:code')
  @Roles(UserRole.Admin, UserRole.Teacher, UserRole.Student)
  @ApiOperation({
    summary: 'Find subject by code',
    description: 'Retrieves a specific subject by its code.',
  })
  @ApiParam({
    name: 'code',
    description: 'Subject code to search for',
    example: 'MATH101',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The found subject.',
    type: Subject,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Subject with specified code was not found.',
  })
  async findByCode(@Param('code') code: string): Promise<Subject> {
    return await this.subjectsService.findByCode(code);
  }

  @Put(':id')
  @Roles(UserRole.Admin)
  @ApiOperation({
    summary: 'Update subject',
    description: 'Updates an existing subject with new data.',
  })
  @ApiParam({
    name: 'id',
    description: 'Subject ID',
  })
  @ApiBody({
    type: UpdateSubjectDto,
    description: 'Subject update data',
    examples: {
      example1: {
        value: {
          name: 'Advanced Mathematics',
          description: 'Updated description',
        },
        summary: 'Basic subject update example',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The subject has been successfully updated.',
    type: Subject,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Subject not found.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ): Promise<Subject> {
    return await this.subjectsService.update(id, updateSubjectDto);
  }

  @Delete(':id')
  @Roles(UserRole.Admin)
  @ApiOperation({
    summary: 'Delete subject',
    description: 'Deletes a subject from the system.',
  })
  @ApiParam({
    name: 'id',
    description: 'Subject ID to delete',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Subject has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Subject not found.',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.subjectsService.remove(id);
  }
}
