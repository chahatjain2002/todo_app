import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { Pager, PaginationDto } from '../../dto/pager.dto';
import { RequestMetaService } from '../../interceptors/request-meta.service';
import { TaskService } from '../tasks/task.service';
import { TaskController } from './task.controller';
import { CreateTaskDto, FindIdDto, GetAllTasksResponseDto, TaskDto, UpdateTaskDto } from './task.dto';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

let pager: Pager;

describe('TaskService', () => {
  let service: TaskService;
  const taskRepository: TaskRepository = createMock<TaskRepository>();
  const requestMetaService: RequestMetaService = createMock();
  const controller: TaskController = createMock();
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: TaskRepository,
          useValue: taskRepository,
        },
        {
          provide: RequestMetaService,
          useValue: requestMetaService,
        },
        {
          provide: TaskController,
          useValue: controller,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an id', async () => {
    const id = 1;
    const result: FindIdDto = {
      id: 1,
    };
    jest.spyOn(service, 'findOne').mockResolvedValue(result);

    return service.findOne(id).then((tasks) => {
      expect(tasks).toEqual(result);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  it('should return an array of tasks', async () => {
    const paginationDto: PaginationDto = {
      page: 1,
      limit: 10,
    };
    const startIndex = 0;
    const userId = '1';
    const result: GetAllTasksResponseDto = {
      tasks: [
        {
          title: 'test title written',
          description: 'test description written',
          priority: 'medium',
          status: false,
          dueDate: '2023-03-30',
        },
        {
          title: 'test title written',
          description: 'test description written',
          priority: 'medium',
          status: false,
          dueDate: '2023-03-30',
        },
      ],
      pager: pager,
    };
    jest.spyOn(taskRepository, 'findTasksOfUser').mockResolvedValue(result);

    return service.findTasksOfUser(paginationDto, userId).then((tasks) => {
      expect(tasks).toEqual(result);
      expect(taskRepository.findTasksOfUser).toHaveBeenCalledWith(paginationDto, startIndex, userId);
    });
  });

  it('should return an Email of User', async () => {
    const email = 'test@test.com';
    const id = 1;
    const result: string = email;
    jest.spyOn(service, 'findEmailById').mockResolvedValue(result);

    return service.findEmailById(id).then((tasks) => {
      expect(tasks).toEqual(result);
      expect(service.findEmailById).toHaveBeenCalledWith(id);
    });
  });

  it('should delete the task of User', async () => {
    const taskId = 1;
    let result: DeleteResult;
    jest.spyOn(service, 'removeTask').mockResolvedValue(result);

    return service.removeTask(taskId).then((tasks) => {
      expect(tasks).toEqual(result);
      expect(service.removeTask).toHaveBeenCalledWith(taskId);
    });
  });

  it('should update the task of User', async () => {
    const taskId = 1;
    const mock: Partial<Task> = {
      title: 'test title written',
      description: 'test description written',
      priority: 'medium',
      status: false,
      dueDate: '2023-03-30',
    };
    const result: UpdateTaskDto = {
      title: mock.title,
      description: mock.description,
      priority: mock.priority,
      status: mock.status,
      dueDate: mock.dueDate,
    };
    jest.spyOn(service, 'updateTask').mockResolvedValue(result);

    return service.updateTask(taskId, mock).then((tasks) => {
      expect(tasks).toEqual(result);
      expect(service.updateTask).toHaveBeenCalledWith(taskId, mock);
    });
  });

  it('should create the task of User', async () => {
    const userId = 1;
    const mock: CreateTaskDto = {
      title: 'test title written',
      description: 'test description written',
      priority: 'medium',
      status: false,
      dueDate: '2023-03-30',
    };
    const result: TaskDto = {
      title: mock.title,
      description: mock.description,
      priority: mock.priority,
      status: mock.status,
      dueDate: mock.dueDate,
    };
    jest.spyOn(service, 'createTask').mockResolvedValue(result);

    return service.createTask(mock, userId).then((tasks) => {
      expect(tasks).toEqual(result);
      expect(service.createTask).toHaveBeenCalledWith(mock, userId);
    });
  });

  it('should return an array of tasks of User with page and filter', async () => {
    const paginationDto: PaginationDto = {
      page: 1,
      limit: 10,
    };
    const startIndex = 0;
    const dueDate: 'ASC' | 'DESC' = 'ASC';
    const userId = '1';
    const priority = 'medium';
    const status = false;
    const result: GetAllTasksResponseDto = {
      tasks: [
        {
          title: 'test title written',
          description: 'test description written',
          priority: 'medium',
          status: false,
          dueDate: '2023-03-30',
        },
      ],
      pager: pager,
    };
    jest.spyOn(taskRepository, 'getAllTasks').mockResolvedValue(result);

    return service.getAllTasks(paginationDto, dueDate, userId, priority, status).then((tasks) => {
      expect(tasks).toEqual(result);
      expect(taskRepository.getAllTasks).toHaveBeenCalledWith(paginationDto, startIndex, dueDate, userId, priority, status);
    });
  });
});
