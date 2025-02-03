import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ScheduleTemplatesModule } from './modules/schedule-templates/schedule-templates.module';
import { SchedulesModule } from './modules/schedules/schedules.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { SubjectsModule } from './modules/subjects/subjects.module';
import { ExportModule } from './modules/export/export.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri:
          configService.get<string>('MONGODB_URL') ??
          'fallback_connection_string',
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    ScheduleTemplatesModule,
    SchedulesModule,
    RoomsModule,
    SubjectsModule,
    ExportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
