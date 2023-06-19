import { createMock } from '@golevelup/ts-jest';
import { HttpException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { when } from 'jest-when';
import { Role } from '../role/role.entity';
import { RoleService } from '../role/role.service';
import { CreateUserDTO } from './user.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

const email = 'akshay@gmail.com';
const name = 'Akshay';
const password = '1234';
const id = 1;
const roleUser = 'USER';
const role: Role = { id, name: roleUser } as Role;
const roles: Role[] = [role];

describe('AuthService', () => {
  const roleService: RoleService = createMock<RoleService>();
  const userRepository: UserRepository = createMock<UserRepository>();
  let userService: UserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: userRepository,
        },
        {
          provide: RoleService,
          useValue: roleService,
        },
      ],
    }).compile();

    userService = module.get(UserService);
  });

  it('can create instance of User Service', async () => {
    expect(userService).toBeDefined();
  });

  it('createUser - Happy flow', async () => {
    const createUserDto: CreateUserDTO = { name, password, email, roles: [roleUser] } as CreateUserDTO;

    const findUserByEmailSpy = jest.spyOn(userRepository, 'findUserByEmail');
    when(findUserByEmailSpy).expectCalledWith(email).mockReturnValue(undefined);

    const findByNamesSpy = jest.spyOn(roleService, 'findByNames');
    when(findByNamesSpy).expectCalledWith([roleUser]).mockReturnValue(Promise.resolve(roles));

    const userTobeCreated: User = new User();
    userTobeCreated.email = email;
    userTobeCreated.password = expect.any(String);
    userTobeCreated.name = name;
    userTobeCreated.roles = Promise.resolve(roles);

    // console.log('User to be created ====>', userTobeCreated);
    const saveSpy = jest.spyOn(userRepository, 'save');
    when(saveSpy)
      .expectCalledWith(userTobeCreated)
      .mockReturnValue(Promise.resolve(Promise.resolve({ id, name, email } as User)));

    const result = await userService.createUser(createUserDto);
    expect(result.id).toBe(id);
    expect(result.email).toBe(email);
  });

  it('createUser - User already exists', async () => {
    const createUserDto: CreateUserDTO = { name, password, email, roles: [roleUser] } as CreateUserDTO;
    const findUserByEmailSpy = jest.spyOn(userRepository, 'findUserByEmail');
    when(findUserByEmailSpy)
      .expectCalledWith(email)
      .mockReturnValue(Promise.resolve({ email, password, name } as User));
    expect(userService.createUser(createUserDto)).rejects.toThrow(HttpException);
  });

  it('createUser - Contains invalid roles', async () => {
    const createUserDto: CreateUserDTO = { name, password, email, roles: [roleUser] } as CreateUserDTO;

    const findUserByEmailSpy = jest.spyOn(userRepository, 'findUserByEmail');
    when(findUserByEmailSpy).expectCalledWith(email).mockReturnValue(undefined);

    const findByNamesSpy = jest.spyOn(roleService, 'findByNames');
    when(findByNamesSpy).expectCalledWith([roleUser]).mockReturnValue(Promise.resolve([]));

    expect(userService.createUser(createUserDto)).rejects.toThrow(HttpException);
  });
});
