import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { RoleController } from './role.controller';
import { CreateRoleDTO, RoleDTO } from './role.dto';
import { RoleService } from './role.service';

const createRoleDto: CreateRoleDTO = {
  name: 'test',
};

describe('RoleController', () => {
  const roleService: RoleService = createMock<RoleService>();
  let roleController: RoleController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [
        {
          provide: RoleService,
          useValue: roleService,
        },
      ],
    }).compile();
    roleController = app.get<RoleController>(RoleController);
  });

  it('should create role', async () => {
    jest.spyOn(roleController, 'createRole').mockImplementation(async (roleDto: CreateRoleDTO): Promise<any> => {
      return Promise.resolve(roleDto);
    });
    const res = await roleController.createRole(createRoleDto);
    expect(res.name).toBe(createRoleDto.name);
  });

  it('should find all roles', async () => {
    const dto: RoleDTO[] = [];
    jest.spyOn(roleController, 'getAllRoles').mockImplementation(() => {
      return Promise.resolve(dto);
    });
    expect(await roleController.getAllRoles()).toBe(dto);
  });
});
