import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, mongo } from 'mongoose';
import { Subject, SubjectDocument } from './schemas/subject.schema';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectModel(Subject.name)
    private readonly subjectModel: Model<SubjectDocument>,
  ) {}

  async create(createSubjectDto: CreateSubjectDto): Promise<SubjectDocument> {
    try {
      const subject = new this.subjectModel(createSubjectDto);
      return await subject.save();
    } catch (error) {
      if (error instanceof mongo.MongoError && error.code === 11000) {
        throw new ConflictException('Subject code must be unique');
      }
      throw error;
    }
  }

  async findAll(): Promise<SubjectDocument[]> {
    return await this.subjectModel.find().exec();
  }

  async findOne(id: string): Promise<SubjectDocument> {
    const subject = await this.subjectModel.findById(id).exec();
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
    return subject;
  }

  async findByCode(code: string): Promise<SubjectDocument> {
    const subject = await this.subjectModel.findOne({ code }).exec();
    if (!subject) {
      throw new NotFoundException(`Subject with code ${code} not found`);
    }
    return subject;
  }

  async update(
    id: string,
    updateSubjectDto: UpdateSubjectDto,
  ): Promise<SubjectDocument> {
    try {
      const subject = await this.subjectModel
        .findByIdAndUpdate(id, updateSubjectDto, { new: true })
        .exec();

      if (!subject) {
        throw new NotFoundException(`Subject with ID ${id} not found`);
      }

      return subject;
    } catch (error) {
      if (error instanceof mongo.MongoError && error.code === 11000) {
        throw new ConflictException('Subject code must be unique');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.subjectModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
  }
}
