import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleTemplatesController } from './schedule-templates.controller';
import { ScheduleTemplatesService } from './schedule-templates.service';
import {
  ScheduleTemplate,
  ScheduleTemplateSchema,
} from './schemas/schedule-template.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ScheduleTemplate.name, schema: ScheduleTemplateSchema },
    ]),
  ],
  controllers: [ScheduleTemplatesController],
  providers: [ScheduleTemplatesService],
  exports: [ScheduleTemplatesService],
})
export class ScheduleTemplatesModule {}
