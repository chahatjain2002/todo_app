import { HttpStatus, Injectable } from '@nestjs/common';
import { logger } from '../../config/app-logger.config';
import { SeedException } from '../../exception/seed.exception';
import { CreateRoleDTO, RoleDTO } from './role.dto';
import { Role } from './role.entity';
import { RoleRepository } from './role.repository';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async findAllRoles(): Promise<RoleDTO[]> {
    const roles = await this.roleRepository.find();

    const roleDtos: RoleDTO[] = [];

    roles.forEach((role) => {
      const roleDto = new RoleDTO();
      roleDto.id = role.id;
      roleDto.name = role.name;
      roleDtos.push(roleDto);
    });

    return roleDtos;
  }

  findByName(roleName: string): Promise<Role> {
    return this.roleRepository.findByName(roleName);
  }

  findByNames(roleNames: string[]): Promise<Role[]> {
    return this.roleRepository.findByNames(roleNames);
  }

  async createRole(createRoleDto: CreateRoleDTO): Promise<RoleDTO> {
    const { name } = createRoleDto;
    if (await this.roleRepository.findByName(name)) {
      logger.debug('Record already present!');
      throw new SeedException('Role already exists', HttpStatus.CONFLICT);
    }

    let role = { name } as Role;
    role = await this.roleRepository.save(role);
    logger.info(`New role created: ${name}`);
    const { id } = role;
    return { id, name } as RoleDTO;
  }
}
