import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Subject } from 'rxjs';
import { Room, RoomSchema } from '../rooms/schemas/room.schema';
import {
  ScheduleTemplate,
  ScheduleTemplateSchema,
} from '../schedule-templates/schemas/schedule-template.schema';
import { SubjectSchema } from '../subjects/schemas/subject.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Schedule, ScheduleSchema } from './schemas/schedule.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Schedule.name, schema: ScheduleSchema },
      { name: ScheduleTemplate.name, schema: ScheduleTemplateSchema },
      { name: Room.name, schema: RoomSchema },
      { name: Subject.name, schema: SubjectSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [SchedulesController],
  providers: [SchedulesService],
  exports: [SchedulesService],
})
export class SchedulesModule {}
