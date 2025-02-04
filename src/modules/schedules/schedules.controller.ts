import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SchedulesService } from './schedules.service';
import { Schedule } from './schemas/schedule.schema';
import { GenerateScheduleDto } from './dto/generate-schedule.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@ApiTags('schedules')
@Controller('schedules')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post('generate')
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Generate a new schedule' })
  @ApiResponse({
    status: 201,
    description: 'Schedule has been successfully generated',
    type: Schedule,
  })
  async generateSchedule(
    @Body() generateDto: GenerateScheduleDto,
  ): Promise<Schedule> {
    return await this.schedulesService.generateSchedule(generateDto);
  }

  @Post(':id/regenerate')
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Regenerate an existing schedule' })
  @ApiResponse({
    status: 200,
    description: 'Schedule has been successfully regenerated',
    type: Schedule,
  })
  async regenerateSchedule(@Param('id') id: string): Promise<Schedule> {
    return await this.schedulesService.regenerateSchedule(id);
  }

  @Put(':id/edit')
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Edit a schedule manually' })
  @ApiResponse({
    status: 200,
    description: 'Schedule has been successfully updated',
    type: Schedule,
  })
  async editSchedule(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ): Promise<Schedule> {
    return await this.schedulesService.editSchedule(id, updateScheduleDto);
  }

  @Put(':id/lock')
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Lock a schedule entry' })
  @ApiResponse({
    status: 200,
    description: 'Schedule entry has been successfully locked',
    type: Schedule,
  })
  async lockEntry(
    @Param('id') id: string,
    @Body('entryIndex') entryIndex: number,
  ): Promise<Schedule> {
    return await this.schedulesService.lockEntry(id, entryIndex);
  }

  @Get()
  @Roles(UserRole.Admin, UserRole.Teacher, UserRole.Student)
  @ApiOperation({ summary: 'Get all schedules or filter by query' })
  @ApiResponse({
    status: 200,
    description: 'Returns all schedules',
    type: [Schedule],
  })
  async getSchedules(@Query() query: Schedule): Promise<Schedule[]> {
    return await this.schedulesService.findAll(query);
  }

  @Get(':id')
  @Roles(UserRole.Admin, UserRole.Teacher, UserRole.Student)
  @ApiOperation({ summary: 'Get a specific schedule by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the schedule',
    type: Schedule,
  })
  async getSchedule(@Param('id') id: string): Promise<Schedule> {
    const schedule = await this.schedulesService.findOne(id);
    if (!schedule) {
      throw new BadRequestException('Schedule not found');
    }
    return schedule;
  }

  @Delete(':id')
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Delete a schedule' })
  @ApiResponse({
    status: 200,
    description: 'Schedule has been successfully deleted',
  })
  async deleteSchedule(@Param('id') id: string): Promise<void> {
    await this.schedulesService.delete(id);
  }

  @Get('student/:studentId')
  @Roles(UserRole.Admin, UserRole.Teacher, UserRole.Student)
  @ApiOperation({ summary: 'Get schedules for a specific student' })
  @ApiResponse({
    status: 200,
    description: 'Returns schedules for the student',
    type: [Schedule],
  })
  async getStudentSchedules(
    @Param('studentId') studentId: string,
  ): Promise<Schedule[]> {
    return await this.schedulesService.findByStudent(studentId);
  }
}
