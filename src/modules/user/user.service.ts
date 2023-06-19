import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { logger } from '../../config/app-logger.config';
import { BcryptConstants } from '../../constants/auth.constants';
import { MessageDTO } from '../../dto/message.dto';
import { getStartIndex, PaginationDto } from '../../dto/pager.dto';
import { SeedException } from '../../exception/seed.exception';
import { Role } from '../role/role.entity';
import { RoleService } from '../role/role.service';
import { CreateUserDTO, UserChangePasswordDTO, UserDTO, UserResponseDTO } from './user.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository, private readonly roleService: RoleService) {}

  async createUser(createUserDto: CreateUserDTO): Promise<UserDTO> {
    const { email, name, roles, password } = createUserDto;

    if (await this.userRepository.findUserByEmail(email)) {
      throw new HttpException('email already in use', HttpStatus.CONFLICT);
    }

    const roleEntities: Role[] = await this.roleService.findByNames(roles);

    if (roleEntities.length !== roles.length) {
      throw new HttpException('Contains Invalid Role', HttpStatus.PRECONDITION_FAILED);
    }
    let user: User = new User();
    user.email = email;
    user.name = name;
    user.roles = Promise.resolve(roleEntities);
    user.password = await bcrypt.hash(password, BcryptConstants.saltRounds);

    user = await this.userRepository.save(user);
    const { id } = user;
    return { id, name, email } as UserDTO;
  }

  async getUserById(userId: number): Promise<UserDTO[]> {
    const users: any[] = await this.userRepository.findUserDetailsWithRole(userId);
    const userDtos: UserDTO[] = [];

    if (users.length === 0) {
      throw new HttpException('No Record Found', HttpStatus.NOT_FOUND);
    }
    for (const user of users) {
      userDtos.push(user);
    }
    return userDtos;
  }

  async getAllUsers(paginationDto: PaginationDto): Promise<UserResponseDTO> {
    const startIndex = getStartIndex(paginationDto.page, paginationDto.limit);
    return this.userRepository.getAllUsers(paginationDto, startIndex);
  }

  findByUserEmail(email: string): Promise<User> {
    return this.userRepository.findUserByEmail(email);
  }

  async changeUserPassword(userChangePwdDto: UserChangePasswordDTO): Promise<MessageDTO> {
    const { email, oldPassword, newPassword } = userChangePwdDto;
    const user: User = await this.findByUserEmail(email);
    if (!user) {
      throw new HttpException('No User Found', HttpStatus.NOT_FOUND);
    }

    if (!(await bcrypt.compare(oldPassword, user.password))) {
      throw new SeedException('Incorrect password', HttpStatus.PRECONDITION_FAILED);
    }

    const updatedPassword = await bcrypt.hash(newPassword, BcryptConstants.saltRounds);
    await this.userRepository.changeUserPassword(email, updatedPassword);

    logger.info(`Password updated successfully for user: ${email}`);

    const res: MessageDTO = new MessageDTO('Password Changed Successfully');
    return res;
  }

  async findAllUsers(): Promise<UserDTO[]> {
    const users = await this.userRepository.find();
    const userDtos: UserDTO[] = [];
    users.forEach(async (user) => {
      const userDto = new UserDTO();
      userDto.id = user.id;
      userDto.email = user.email;
      userDto.roles = await user.roles;
      userDto.name = user.name;
      userDtos.push(userDto);
    });
    return userDtos;
  }
}
