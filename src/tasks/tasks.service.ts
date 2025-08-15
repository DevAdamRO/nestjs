import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Task } from './entities/task.entity';
import { Status } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {
    //
  }

  async create(dto: CreateTaskDto) {
    const task = this.taskRepo.create(dto); // mapea DTO -> entidad
    return this.taskRepo.save(task);
  }

  findAll() {
    // ajusta relations si tu entidad las tiene (e.g., relations: ['user'])
    return this.taskRepo.find();
  }

  async findOne(id: number) {
    const task = await this.taskRepo.findOne({ where: { id } });
    if (!task) throw new NotFoundException(`Task ${id} no existe`);
    return task;
  }

  async update(id: number, dto: UpdateTaskDto) {
    // preload combina { id, ...dto } con la entidad existente
    const toUpdate = await this.taskRepo.preload({ id, ...dto });
    if (!toUpdate) throw new NotFoundException(`Task ${id} no existe`);
    return this.taskRepo.save(toUpdate);
  }

  async remove(id: number) {
    const task = await this.findOne(id); // lanza 404 si no existe
    await this.taskRepo.remove(task);
    return { message: `Task ${id} eliminada` };
  }

  // Nuevo: filtrar por status
  findByStatus(status: Status) {
    return this.taskRepo.find({ where: { status } });
  }
}
