import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ScheduleTemplatesService } from './schedule-templates.service';
import { CreateScheduleTemplateDto } from './dto/create-schedule-template.dto';
import { ScheduleTemplate } from './schemas/schedule-template.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

@ApiTags('schedule-templates')
@Controller('schedule-templates')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ScheduleTemplatesController {
  constructor(private readonly templatesService: ScheduleTemplatesService) {}

  @Post()
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Create a new schedule template' })
  @ApiResponse({
    status: 201,
    description: 'The template has been successfully created',
    type: ScheduleTemplate,
  })
  async create(
    @Body() createDto: CreateScheduleTemplateDto,
  ): Promise<ScheduleTemplate> {
    return await this.templatesService.create(createDto);
  }

  @Get()
  @Roles(UserRole.Admin, UserRole.Teacher)
  @ApiOperation({ summary: 'Get all schedule templates' })
  @ApiResponse({
    status: 200,
    description: 'Returns all schedule templates',
    type: [ScheduleTemplate],
  })
  async findAll(): Promise<ScheduleTemplate[]> {
    return await this.templatesService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.Admin, UserRole.Teacher)
  @ApiOperation({ summary: 'Get a specific schedule template' })
  @ApiResponse({
    status: 200,
    description: 'Returns the schedule template',
    type: ScheduleTemplate,
  })
  async findOne(@Param('id') id: string): Promise<ScheduleTemplate> {
    return await this.templatesService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Update a schedule template' })
  @ApiResponse({
    status: 200,
    description: 'The template has been successfully updated',
    type: ScheduleTemplate,
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: CreateScheduleTemplateDto,
  ): Promise<ScheduleTemplate> {
    return await this.templatesService.update(id, updateDto);
  }

  @Delete(':id')
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Delete a schedule template' })
  @ApiResponse({
    status: 200,
    description: 'The template has been successfully deleted',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.templatesService.remove(id);
  }
}
