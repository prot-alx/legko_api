import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Schedule, ScheduleDocument } from './schemas/schedule.schema';
import {
  ScheduleTemplate,
  ScheduleTemplateDocument,
} from '../schedule-templates/schemas/schedule-template.schema';
import { Room, RoomDocument } from '../rooms/schemas/room.schema';
import { Subject, SubjectDocument } from '../subjects/schemas/subject.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { GenerateScheduleDto } from './dto/generate-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectModel(Schedule.name)
    private readonly scheduleModel: Model<ScheduleDocument>,
    @InjectModel(ScheduleTemplate.name)
    private readonly templateModel: Model<ScheduleTemplateDocument>,
    @InjectModel(Room.name) private readonly roomModel: Model<RoomDocument>,
    @InjectModel(Subject.name)
    private readonly subjectModel: Model<SubjectDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  /**
   * Проверяет существование шаблона и валидность списка студентов.
   */
  private async validateScheduleData(
    templateId: string,
    students: { studentId: string; numberOfLessons: number }[],
  ) {
    // Проверяем существование шаблона
    const template = await this.templateModel.findById(templateId);
    if (!template) {
      throw new BadRequestException('Template not found');
    }

    // Проверяем существование всех студентов с ролью "student"
    const studentIds = students.map((s) => s.studentId);
    const foundStudents = await this.userModel.find({
      _id: { $in: studentIds },
      role: 'student',
    });

    if (foundStudents.length !== studentIds.length) {
      throw new BadRequestException(
        'Some students not found or are not valid students',
      );
    }

    return { template, students: foundStudents };
  }

  /**
   * Проверяет, доступен ли заданный временной слот для указанного студента и аудитории.
   */
  private isTimeSlotAvailable(
    schedule: Schedule,
    timeSlotNumber: number,
    studentId: string,
    roomId: string,
  ): boolean {
    // Проверяем, не занят ли студент в это время
    const studentBusy = schedule.entries.some(
      (entry) =>
        entry.timeSlotNumber === timeSlotNumber &&
        entry.studentId === studentId,
    );
    if (studentBusy) return false;

    // Проверяем, не занята ли аудитория в это время
    const roomBusy = schedule.entries.some(
      (entry) =>
        entry.timeSlotNumber === timeSlotNumber && entry.roomId === roomId,
    );
    if (roomBusy) return false;

    return true;
  }

  /**
   * Перемешивает массив с использованием алгоритма Фишера–Йетса.
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Ищет доступную комбинацию временного слота и аудитории для заданного студента.
   * Для уменьшения вложенности циклов формируется единый массив пар {timeSlot, room},
   * который перемешивается и перебирается в поиске подходящего варианта.
   *
   * @param schedule - текущее расписание
   * @param studentId - идентификатор студента
   * @param timeSlots - список временных слотов из шаблона (ожидается, что каждый слот имеет поле lessonNumber)
   * @param rooms - массив аудиторий
   * @returns объект с выбранным timeSlot (номер урока) и room, либо null если подходящая пара не найдена
   */
  private findAvailableTimeRoomPair(
    schedule: Schedule,
    studentId: string,
    timeSlots: { lessonNumber: number }[],
    rooms: RoomDocument[],
  ): { timeSlot: number; room: RoomDocument } | null {
    // Формируем массив всех возможных пар {timeSlot, room}
    const pairs: { timeSlot: number; room: RoomDocument }[] = [];
    timeSlots.forEach((slot) => {
      rooms.forEach((room) => {
        pairs.push({ timeSlot: slot.lessonNumber, room });
      });
    });

    // Перемешиваем пары для случайного выбора
    const shuffledPairs = this.shuffleArray(pairs);

    // Ищем первую доступную пару
    for (const pair of shuffledPairs) {
      if (
        this.isTimeSlotAvailable(
          schedule,
          pair.timeSlot,
          studentId,
          pair.room._id as string,
        )
      ) {
        return pair;
      }
    }

    return null;
  }

  /**
   * Выбирает случайный предмет из списка предметов.
   */
  private getRandomSubject(subjects: SubjectDocument[]): SubjectDocument {
    return subjects[Math.floor(Math.random() * subjects.length)];
  }

  /**
   * Генерирует расписание на основе шаблона, списка студентов и их требований по количеству уроков.
   * Декомпозирован для уменьшения вложенности циклов.
   */
  async generateSchedule(
    generateDto: GenerateScheduleDto,
  ): Promise<ScheduleDocument> {
    // Валидация входных данных (шаблон и студенты)
    const { template } = await this.validateScheduleData(
      generateDto.templateId,
      generateDto.students,
    );

    // Создаем новое расписание
    const schedule = new this.scheduleModel({
      templateId: template._id,
      name: generateDto.name,
      entries: [],
    });

    // Сортируем студентов по требуемому количеству уроков (по убыванию)
    const sortedStudents = [...generateDto.students].sort(
      (a, b) => b.numberOfLessons - a.numberOfLessons,
    );

    // Получаем список аудиторий и предметов из шаблона
    const rooms = await this.roomModel.find({ _id: { $in: template.rooms } });
    const subjects = await this.subjectModel.find({
      _id: { $in: template.subjects },
    });

    // Для каждого студента пытаемся назначить требуемое количество уроков
    for (const studentData of sortedStudents) {
      let assignedLessons = 0;

      while (assignedLessons < studentData.numberOfLessons) {
        // Ищем доступную комбинацию временного слота и аудитории
        const availablePair = this.findAvailableTimeRoomPair(
          schedule,
          studentData.studentId,
          template.timeSlots,
          rooms,
        );

        // Если подходящая пара не найдена, прерываем генерацию с ошибкой
        if (!availablePair) {
          throw new BadRequestException(
            `Unable to assign all lessons for student ${studentData.studentId}`,
          );
        }

        // Выбираем случайный предмет
        const subject = this.getRandomSubject(subjects);

        // Добавляем запись в расписание
        schedule.entries.push({
          timeSlotNumber: availablePair.timeSlot,
          studentId: studentData.studentId,
          roomId: availablePair.room._id as string,
          subjectId: subject._id as string,
          isLocked: false,
        });

        assignedLessons++;
      }
    }

    // Сохраняем расписание в базе данных
    return await schedule.save();
  }

  async regenerateSchedule(scheduleId: string): Promise<ScheduleDocument> {
    const existingSchedule = await this.scheduleModel
      .findById(scheduleId)
      .populate('templateId');

    if (!existingSchedule) {
      throw new NotFoundException('Schedule not found');
    }

    // Получаем информацию о количестве уроков для каждого студента,
    // исключая заблокированные записи.
    const studentLessons = new Map<string, number>();
    for (const entry of existingSchedule.entries) {
      if (!entry.isLocked) {
        const count = studentLessons.get(entry.studentId) ?? 0;
        studentLessons.set(entry.studentId, count + 1);
      }
    }

    // Формируем данные для генерации нового расписания
    const generateDto: GenerateScheduleDto = {
      templateId: existingSchedule.templateId.toString(),
      name: existingSchedule.name,
      students: Array.from(studentLessons.entries()).map(
        ([studentId, numberOfLessons]) => ({
          studentId,
          numberOfLessons,
        }),
      ),
    };

    // Сохраняем заблокированные записи
    const lockedEntries = existingSchedule.entries.filter(
      (entry) => entry.isLocked,
    );

    // Генерируем новое расписание
    const newSchedule = await this.generateSchedule(generateDto);

    // Добавляем заблокированные записи обратно
    newSchedule.entries.push(...lockedEntries);

    return await newSchedule.save();
  }

  async editSchedule(
    id: string,
    updateDto: UpdateScheduleDto,
  ): Promise<Schedule> {
    const schedule = await this.scheduleModel.findById(id);
    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    // Проверяем конфликты во времени для новых записей
    if (updateDto.entries) {
      for (const entry of updateDto.entries) {
        const conflictingEntries = schedule.entries.filter(
          (e) =>
            e.timeSlotNumber === entry.timeSlotNumber &&
            (e.studentId === entry.studentId || e.roomId === entry.roomId) &&
            e !== entry,
        );

        if (conflictingEntries.length > 0) {
          throw new BadRequestException(
            `Conflict found for time slot ${entry.timeSlotNumber}`,
          );
        }
      }
    }

    // Обновляем расписание
    Object.assign(schedule, updateDto);
    return await schedule.save();
  }

  async lockEntry(scheduleId: string, entryIndex: number): Promise<Schedule> {
    const schedule = await this.scheduleModel.findById(scheduleId);
    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    if (entryIndex >= 0 && entryIndex < schedule.entries.length) {
      schedule.entries[entryIndex].isLocked = true;
      return await schedule.save();
    }

    throw new BadRequestException('Invalid entry index');
  }

  async findAll(query: Schedule): Promise<Schedule[]> {
    return await this.scheduleModel.find(query).populate('templateId').exec();
  }

  async findOne(id: string): Promise<Schedule> {
    const schedule = await this.scheduleModel
      .findById(id)
      .populate('templateId')
      .exec();

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    return schedule;
  }

  async findByStudent(studentId: string): Promise<Schedule[]> {
    return await this.scheduleModel
      .find({
        'entries.studentId': studentId,
      })
      .populate('templateId')
      .exec();
  }

  async delete(id: string): Promise<void> {
    const result = await this.scheduleModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Schedule not found');
    }
  }
}
