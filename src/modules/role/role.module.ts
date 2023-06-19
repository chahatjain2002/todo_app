import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '../database/typeorm-ex.module';
import { RoleRepository } from '../role/role.repository';
import { RoleService } from '../role/role.service';
import { RoleController } from './role.controller';

@Module({
  providers: [RoleService],
  imports: [TypeOrmExModule.forCustomRepository([RoleRepository])],
  controllers: [RoleController],
  exports: [RoleService],
})
export class RoleModule {}
