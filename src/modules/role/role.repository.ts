import { Repository } from 'typeorm';
import { CustomRepository } from '../database/typeorm-ex.decorator';
import { Role } from './role.entity';

@CustomRepository(Role)
export class RoleRepository extends Repository<Role> {
  findAllRoles(): Promise<Role[]> {
    return this.find();
  }

  findByName(roleName: string): Promise<Role> {
    return this.findOne({ where: { name: roleName } });
  }

  findByNames(roleNames: string[]): Promise<Role[]> {
    return this.createQueryBuilder('role').where('role.name IN(:...roleNames)', { roleNames }).getMany();
  }
}
