import { Repository } from 'typeorm';
import { Pager, PaginationDto } from '../../dto/pager.dto';
import { CustomRepository } from '../database/typeorm-ex.decorator';
import { GetAllTasksResponseDto, TaskDto } from './task.dto';
import { Task } from './task.entity';

@CustomRepository(Task)
export class TaskRepository extends Repository<Task> {
  async findTasksOfUser(pagination: PaginationDto, startIndex: number, id: string): Promise<GetAllTasksResponseDto> {
    const totalCount = await this.count();
    const tasks = await this.createQueryBuilder('task')
      .innerJoin('task.user', 'user')
      .where('user.id = :id', { id })
      .orderBy('task.status', 'ASC')
      .orderBy('task.priority', 'ASC')
      .orderBy('task.id', 'ASC')
      .limit(pagination.limit)
      .offset(startIndex)
      .getMany();
    const tasksDTORes: TaskDto[] = [];
    for (const item of tasks) {
      tasksDTORes.push(item);
    }
    const pager = new Pager(totalCount, Number(pagination.page), Number(pagination.limit), startIndex);
    const taskResWithPagination: GetAllTasksResponseDto = new GetAllTasksResponseDto();
    taskResWithPagination.tasks = tasksDTORes;
    taskResWithPagination.pager = pager;

    return taskResWithPagination;
  }

  async getAllTasks(
    pagination: PaginationDto,
    startIndex: number,
    dueDate: 'ASC' | 'DESC',
    userId: string,
    priority?: string,
    status?: boolean,
  ): Promise<GetAllTasksResponseDto> {
    const totalCount = await this.count();
    const tasks = await this.createQueryBuilder('task')
      .leftJoinAndSelect('user', 'user', 'user.id = task.userId')
      .andWhere('user.id = :userId', { userId })
      .select(['user.email', 'user.name', 'task.id', 'task.title', 'task.description', 'task.priority', 'task.status', 'task.dueDate'])
      .andWhere('task.priority = :priority', { priority })
      .andWhere('task.status = :status', { status })
      .orderBy('task.dueDate', dueDate)
      .limit(pagination.limit)
      .offset(startIndex)
      .getRawMany();

    const tasksDTORes: TaskDto[] = [];
    for (const item of tasks) {
      tasksDTORes.push(item);
    }
    const pager = new Pager(totalCount, Number(pagination.page), Number(pagination.limit), startIndex);
    const taskResWithPagination: GetAllTasksResponseDto = new GetAllTasksResponseDto();
    taskResWithPagination.tasks = tasksDTORes;
    taskResWithPagination.pager = pager;

    return taskResWithPagination;
  }
}
