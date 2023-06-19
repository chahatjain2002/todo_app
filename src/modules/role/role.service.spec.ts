import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateRoleDTO, RoleDTO } from './role.dto';
import { Role } from './role.entity';
import { RoleRepository } from './role.repository';
import { RoleService } from './role.service';

const createRoleDto: CreateRoleDTO = {
  name: 'test',
};

describe('RoleService', () => {
  const roleRepository: RoleRepository = createMock<RoleRepository>();
  let roleService: RoleService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: RoleRepository,
          useValue: roleRepository,
        },
      ],
    }).compile();

    roleService = app.get<RoleService>(RoleService);
  });

  it('should create role and return the added role details', async () => {
    jest.spyOn(roleService, 'createRole').mockImplementation(async (dto: CreateRoleDTO): Promise<any> => {
      return Promise.resolve(dto);
    });
    const result = await roleService.createRole(createRoleDto);
    expect(result.name).toBe(createRoleDto.name);
  });

  it('should find all roles', async () => {
    const dto: RoleDTO[] = [];
    jest.spyOn(roleService, 'findAllRoles').mockImplementation(() => {
      return Promise.resolve(dto);
    });
    expect(await roleService.findAllRoles()).toBe(dto);
  });

  it('should find role by name', async () => {
    const role = new Role();
    jest.spyOn(roleService, 'findByName').mockImplementation(() => {
      return Promise.resolve(role);
    });
    expect(await roleService.findByName('user')).toBe(role);
  });
});
