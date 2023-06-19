import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { logger } from '../../config/app-logger.config';
import { PaginationDto } from '../../dto/pager.dto';
import { RequestMeta } from '../../dto/request-meta.dto';
import { RequestMetaService } from '../../interceptors/request-meta.service';
import { CreateTaskDto, GetAllTasksResponseDto, TaskDto, UpdateTaskDto } from './task.dto';
import { TaskService } from './task.service';

@Controller('task')
@ApiTags('tasks')
@ApiSecurity('BearerAuthorization')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private taskService: TaskService, private readonly requestMetaService: RequestMetaService) {}
  @Post('createTask')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: TaskDto,
    description: 'Task created successfully',
  })
  async createTask(@Body() body: CreateTaskDto, @Req() request: Request) {
    const requestMeta = await this.requestMetaService.getRequestMeta(request);
    const userId = requestMeta.userId;
    if (requestMeta.email) {
      return await this.taskService.createTask(body, parseInt(userId));
    }
    throw new UnauthorizedException('User not Authorised');
  }

  @Delete('/:taskId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task deleted successfully',
  })
  async removeTask(@Param('taskId') taskId: number, @Req() request: Request): Promise<DeleteResult> {
    const requestMeta = await this.requestMetaService.getRequestMeta(request);
    const userEmail = await this.taskService.findEmailById(taskId);
    if (requestMeta.email === userEmail) {
      return this.taskService.removeTask(taskId);
    }
    throw new UnauthorizedException('User not Authorised');
  }

  @Patch('/:taskId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task updated successfully',
  })
  async updateTask(@Param('taskId') taskId: number, @Body() body: UpdateTaskDto, @Req() request: Request) {
    const requestMeta = await this.requestMetaService.getRequestMeta(request);
    const userEmail = await this.taskService.findEmailById(taskId);
    if (requestMeta.email === userEmail) {
      return this.taskService.updateTask(taskId, body);
    }
    throw new UnauthorizedException('User not Authorised');
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Showing all tasks of user',
  })
  async findAllTasks(@Query() paginationDto: PaginationDto, @Req() request: Request) {
    if (!paginationDto.limit) {
      paginationDto.limit = 10;
    }
    if (!paginationDto.page) {
      paginationDto.page = 1;
    }
    const requestMeta = await this.requestMetaService.getRequestMeta(request);
    const userId: string = requestMeta.userId;
    return this.taskService.findTasksOfUser(paginationDto, userId);
  }

  @Get('/pagination')
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetAllTasksResponseDto,
    description: 'UserResponseDTO with user & pagination details',
  })
  async getAllTasks(
    @Query() paginationDto: PaginationDto,
    @Query('priority') priority: string,
    @Query('status') status: boolean,
    @Query('dueDate') dueDate: 'ASC' | 'DESC',
    @Req() request: Request,
  ): Promise<GetAllTasksResponseDto> {
    if (!paginationDto.limit) {
      paginationDto.limit = 10;
    }
    if (!paginationDto.page) {
      paginationDto.page = 1;
    }
    const requestMeta: RequestMeta = await this.requestMetaService.getRequestMeta(request);
    logger.debug('requestMeta object ', requestMeta);
    const userId = requestMeta.userId;
    return this.taskService.getAllTasks(paginationDto, dueDate, userId, priority, status);
  }
}
