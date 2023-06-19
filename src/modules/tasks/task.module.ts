import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestMetaService } from 'src/interceptors/request-meta.service';
import { TypeOrmExModule } from '../database/typeorm-ex.module';
import { TaskController } from './task.controller';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { TaskService } from './task.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), TypeOrmExModule.forCustomRepository([TaskRepository])],
  providers: [TaskService, RequestMetaService],
  controllers: [TaskController],
  exports: [TaskService],
})
export class TaskModule {}
