import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { IsPassword } from '../../decorators/password-validator.decorator';
import { Pager } from '../../dto/pager.dto';
import { RoleDTO } from '../role/role.dto';

export class CreateUserDTO {
  @IsEmail(
    {},
    {
      message: 'Invalid email',
    },
  )
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  @IsPassword()
  password: string;

  @ApiProperty({ type: String, isArray: true })
  @IsArray()
  roles: string[];

  @ApiProperty()
  @IsNotEmpty()
  name: string;
}

export class UserDTO {
  @ApiResponseProperty()
  id: number;

  @ApiResponseProperty()
  email: string;

  @ApiResponseProperty()
  roles: RoleDTO[];

  @ApiResponseProperty()
  name: string;
}

export class UserResponseDTO {
  @ApiResponseProperty()
  users: UserDTO[];

  @ApiResponseProperty()
  pager: Pager;
}

export class UserResetPasswordDTO {
  @ApiProperty()
  newPassword: string;

  @ApiProperty()
  confirmPassword: string;
}

export class UserForgotPasswordDTO {
  @ApiProperty()
  email: string;
}

export class UserPassCodeDTO {
  @ApiResponseProperty()
  passCode: string;
}

export class UserChangePasswordDTO {
  @ApiProperty()
  email: string;

  @ApiProperty()
  oldPassword: string;

  @ApiProperty()
  @MinLength(8)
  @MaxLength(32)
  @IsPassword()
  newPassword: string;
}

export class UserUpdateDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  roles: RoleDTO[];
}
