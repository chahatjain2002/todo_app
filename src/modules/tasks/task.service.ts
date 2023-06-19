import { Injectable, NotFoundException } from '@nestjs/common';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { PaginationDto, getStartIndex } from '../../dto/pager.dto';
import { RequestMetaService } from '../../interceptors/request-meta.service';
import { CreateTaskDto, FindIdDto, GetAllTasksResponseDto, TaskDto, UpdateTaskDto } from './task.dto';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TaskService {
  constructor(private taskRepository: TaskRepository, private readonly requestMetaService: RequestMetaService) {}

  findOne(id: number): Promise<FindIdDto> {
    if (!id) {
      return null;
    }
    return this.taskRepository.findOneBy({ id });
  }

  findTasksOfUser(paginationDto: PaginationDto, id: string): Promise<GetAllTasksResponseDto> {
    const startIndex = getStartIndex(paginationDto.page, paginationDto.limit);
    return this.taskRepository.findTasksOfUser(paginationDto, startIndex, id);
  }

  async findEmailById(id: number) {
    const task = await this.taskRepository.findOneBy({ id });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    const user = await task.user;

    if (!user) {
      throw new NotFoundException(`User associated with task with ID ${id} not found`);
    }

    return user.email;
  }

  async createTask(body: CreateTaskDto, userId: any): Promise<TaskDto> {
    const task = this.taskRepository.create({ ...body, user: userId });
    return this.taskRepository.save(task);
  }

  async getAllTasks(
    paginationDto: PaginationDto,
    dueDate: 'ASC' | 'DESC',
    userId: string,
    priority?: string,
    status?: boolean,
  ): Promise<GetAllTasksResponseDto> {
    const startIndex = getStartIndex(paginationDto.page, paginationDto.limit);
    return this.taskRepository.getAllTasks(paginationDto, startIndex, dueDate, userId, priority, status);
  }

  async updateTask(taskId: number, attrs: Partial<Task>): Promise<UpdateTaskDto> {
    const task = await this.findOne(taskId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    Object.assign(task, attrs);
    return this.taskRepository.save(task);
  }
  async removeTask(taskId: number): Promise<DeleteResult> {
    const task = await this.findOne(taskId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return this.taskRepository.delete(taskId);
  }
}
