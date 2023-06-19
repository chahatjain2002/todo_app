import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { Pager, PaginationDto } from '../../dto/pager.dto';
import { RequestMetaService } from '../../interceptors/request-meta.service';
import { TaskController } from './task.controller';
import { CreateTaskDto, GetAllTasksDto, GetAllTasksResponseDto, TaskDto, UpdateTaskDto } from './task.dto';
import { TaskService } from './task.service';

const createTaskDto: CreateTaskDto = {
  title: 'hello hii',
  description: 'see you bye bye',
  priority: 'medium',
  status: false,
  dueDate: '2023-03-19',
};

let userId: Request;

describe('TaskController', () => {
  let controller: TaskController;
  const taskService: TaskService = createMock();
  const requestMetaService: RequestMetaService = createMock();
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: taskService,
        },
        {
          provide: RequestMetaService,
          useValue: requestMetaService,
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create task', async () => {
    jest.spyOn(controller, 'createTask').mockImplementation(async (): Promise<TaskDto> => {
      return Promise.resolve(createTaskDto);
    });
    const res = await controller.createTask(createTaskDto, userId);
    expect(res).toBe(createTaskDto);
  });

  it('should remove task', async () => {
    const taskId = 1;
    const result: DeleteResult = { raw: [], affected: 1 };
    jest.spyOn(controller, 'removeTask').mockImplementation(async (): Promise<DeleteResult> => {
      return Promise.resolve(result);
    });
    const res = await controller.removeTask(taskId, userId);
    expect(res).toBe(result);
  });

  it('should update task', async () => {
    const taskId = 1;
    const mock: Partial<UpdateTaskDto> = {
      title: 'test title written',
      description: 'test description written',
      priority: 'medium',
      status: false,
      dueDate: '2023-03-30',
    };
    const body: UpdateTaskDto = {
      title: mock.title,
      description: mock.description,
      priority: mock.priority,
      status: mock.status,
      dueDate: mock.dueDate,
    };
    jest.spyOn(controller, 'updateTask').mockImplementation(async () => {
      return Promise.resolve(body);
    });
    const res = await controller.updateTask(taskId, body, userId);
    expect(res).toBe(body);
  });

  it('should return an array of tasks of User ', async () => {
    let pager: Pager;
    const paginationDto: PaginationDto = {
      page: 1,
      limit: 10,
    };
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
    jest.spyOn(controller, 'findAllTasks').mockImplementation(async () => {
      return Promise.resolve(result);
    });
    const res = await controller.findAllTasks(paginationDto, userId);
    expect(res).toBe(result);
  });

  it('should return an array of tasks of User with page and filter ', async () => {
    let pager: Pager;
    const paginationDto: PaginationDto = {
      page: 1,
      limit: 10,
    };

    const task: TaskDto = {
      title: 'test title written',
      description: 'test description written',
      priority: 'medium',
      status: false,
      dueDate: 'ASC',
    };
    const result: GetAllTasksDto = {
      tasks: [
        {
          title: 'test title written',
          description: 'test description written',
          priority: 'medium',
          status: false,
          dueDate: 'ASC',
        },
        {
          title: 'test title written',
          description: 'test description written',
          priority: 'medium',
          status: false,
          dueDate: 'DESC',
        },
      ],
      pager: pager,
    };
    jest.spyOn(controller, 'getAllTasks').mockImplementation(async (): Promise<GetAllTasksDto> => {
      return Promise.resolve(result);
    });
    const res = await controller.getAllTasks(paginationDto, task.priority, task.status, 'ASC', userId);
    expect(res).toBe(result);
  });
});
