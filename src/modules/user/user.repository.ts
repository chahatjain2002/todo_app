import { Repository } from 'typeorm';
import { Pager, PaginationDto } from '../../dto/pager.dto';
import { CustomRepository } from '../database/typeorm-ex.decorator';
import { Role } from '../role/role.entity';
import { UserDTO, UserResponseDTO } from './user.dto';
import { User } from './user.entity';

@CustomRepository(User)
export class UserRepository extends Repository<User> {
  async findUserByEmail(email: string): Promise<User> {
    return await this.findOneBy({
      email,
    });
  }

  async getAllUsers(pagination: PaginationDto, startIndex: number): Promise<UserResponseDTO> {
    const totalCount = await this.count();
    const users = await this.createQueryBuilder('user')
      .leftJoin('user_role', 'ur', 'ur.user_id = user.id')
      .leftJoinAndSelect(Role, 'role', 'ur.role_id = role.id')
      .select(['user.id', 'user.email', 'user.name', 'role.name'])
      .orderBy('user.id', 'ASC')
      .limit(pagination.limit)
      .offset(startIndex)
      .getRawMany();

    const usersDTORes: UserDTO[] = [];
    for (const item of users) {
      usersDTORes.push(item);
    }
    const pager = new Pager(totalCount, Number(pagination.page), Number(pagination.limit), startIndex);
    const userResWithPagination: UserResponseDTO = new UserResponseDTO();
    userResWithPagination.users = usersDTORes;
    userResWithPagination.pager = pager;

    return userResWithPagination;
  }

  changeUserPassword(userEmail: string, newPassword: string) {
    return this.createQueryBuilder('user').update('user').set({ password: newPassword }).where('email=:userEmail', { userEmail }).execute();
  }

  async findUserDetailsWithRole(userId: number) {
    const user = await this.createQueryBuilder('user')
      .leftJoin('user_role', 'ur', 'ur.user_id = user.id')
      .leftJoinAndSelect(Role, 'role', 'ur.role_id = role.id')
      .where('user.id=:userId', { userId })
      .select(['user.email', 'user.name', 'role.name'])
      .getRawMany();
    return user;
  }
}
