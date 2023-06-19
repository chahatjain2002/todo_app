import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestMetaService } from '../../interceptors/request-meta.service';
import { TypeOrmExModule } from '../database/typeorm-ex.module';
import { RoleModule } from '../role/role.module';
import { Task } from '../tasks/task.entity';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  providers: [UserService, RequestMetaService],
  imports: [TypeOrmExModule.forCustomRepository([UserRepository]), RoleModule, TypeOrmModule.forFeature([User, Task])],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
