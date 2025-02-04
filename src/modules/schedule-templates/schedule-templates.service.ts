import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ScheduleTemplate,
  ScheduleTemplateDocument,
} from './schemas/schedule-template.schema';
import { CreateScheduleTemplateDto } from './dto/create-schedule-template.dto';

@Injectable()
export class ScheduleTemplatesService {
  constructor(
    @InjectModel(ScheduleTemplate.name)
    private readonly scheduleTemplateModel: Model<ScheduleTemplateDocument>,
  ) {}

  async create(
    createDto: CreateScheduleTemplateDto,
  ): Promise<ScheduleTemplateDocument> {
    const template = new this.scheduleTemplateModel(createDto);
    return await template.save();
  }

  async findAll(): Promise<ScheduleTemplateDocument[]> {
    return await this.scheduleTemplateModel.find().exec();
  }

  async findOne(id: string): Promise<ScheduleTemplateDocument> {
    const template = await this.scheduleTemplateModel.findById(id).exec();
    if (!template) {
      throw new NotFoundException('Template not found');
    }
    return template;
  }

  async update(
    id: string,
    updateDto: Partial<CreateScheduleTemplateDto>,
  ): Promise<ScheduleTemplateDocument> {
    const template = await this.scheduleTemplateModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
    if (!template) {
      throw new NotFoundException('Template not found');
    }
    return template;
  }

  async remove(id: string): Promise<void> {
    const result = await this.scheduleTemplateModel
      .deleteOne({ _id: id })
      .exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Template not found');
    }
  }
}
