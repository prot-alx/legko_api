import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, mongo } from 'mongoose';
import { Room, RoomDocument } from './schemas/room.schema';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private readonly roomModel: Model<RoomDocument>,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<RoomDocument> {
    try {
      const room = new this.roomModel(createRoomDto);
      return await room.save();
    } catch (error) {
      if (error instanceof mongo.MongoError && error.code === 11000) {
        throw new ConflictException('Room number must be unique');
      }
      throw error;
    }
  }

  async findAll(): Promise<RoomDocument[]> {
    return await this.roomModel.find().exec();
  }

  async findOne(id: string): Promise<RoomDocument> {
    const room = await this.roomModel.findById(id).exec();
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
    return room;
  }

  async findByNumber(number: string): Promise<RoomDocument> {
    const room = await this.roomModel.findOne({ number }).exec();
    if (!room) {
      throw new NotFoundException(`Room with number ${number} not found`);
    }
    return room;
  }

  async findAvailable(): Promise<RoomDocument[]> {
    return await this.roomModel.find({ isAvailable: true }).exec();
  }

  async update(
    id: string,
    updateRoomDto: UpdateRoomDto,
  ): Promise<RoomDocument> {
    try {
      const room = await this.roomModel
        .findByIdAndUpdate(id, updateRoomDto, { new: true })
        .exec();

      if (!room) {
        throw new NotFoundException(`Room with ID ${id} not found`);
      }

      return room;
    } catch (error) {
      if (error instanceof mongo.MongoError && error.code === 11000) {
        throw new ConflictException('Room number must be unique');
      }
      throw error;
    }
  }

  async updateAvailability(
    id: string,
    isAvailable: boolean,
  ): Promise<RoomDocument> {
    const room = await this.roomModel
      .findByIdAndUpdate(id, { isAvailable }, { new: true })
      .exec();

    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    return room;
  }

  async remove(id: string): Promise<void> {
    const result = await this.roomModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
  }
}
