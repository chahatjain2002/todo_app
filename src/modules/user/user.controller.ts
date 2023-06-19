import { Controller, Get, HttpStatus, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { logger } from '../../config/app-logger.config';
import { PaginationDto } from '../../dto/pager.dto';
import { RequestMeta } from '../../dto/request-meta.dto';
import { RequestMetaService } from '../../interceptors/request-meta.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { UserDTO, UserResponseDTO } from './user.dto';
import { UserService } from './user.service';
@Controller('users')
@ApiSecurity('BearerAuthorization')
@ApiTags('users')
@UseGuards(JwtAuthGuard, RolesGuard)
//@UseInterceptors(TransformHeadersInterceptor)
export class UserController {
  constructor(private readonly userService: UserService, private readonly requestMetaService: RequestMetaService) {}

  @Get(':userId')
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserDTO,
    description: 'UserDTO with user details',
  })
  getUserById(@Param('userId') userId: number): Promise<UserDTO[]> {
    logger.debug('inside getUserById', userId);
    return this.userService.getUserById(userId);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserResponseDTO,
    description: 'UserResponseDTO with user & pagination details',
  })
  async getAllUsers(@Query() paginationDto: PaginationDto, @Req() request: Request): Promise<UserResponseDTO> {
    if (!paginationDto.limit) {
      paginationDto.limit = 10;
    }
    if (!paginationDto.page) {
      paginationDto.page = 1;
    }
    const requestMeta: RequestMeta = await this.requestMetaService.getRequestMeta(request);
    logger.debug('requestMeta object ', requestMeta);
    return this.userService.getAllUsers(paginationDto);
  }
}
