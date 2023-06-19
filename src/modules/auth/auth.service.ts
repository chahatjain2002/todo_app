import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { logger } from '../../config/app-logger.config';
import { RequestMeta } from '../../dto/request-meta.dto';
import { RequestMetaService } from '../../interceptors/request-meta.service';
import { CredentialsDTO } from '../user/credentials.dto';
import { CreateUserDTO, UserChangePasswordDTO, UserDTO } from '../user/user.dto';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthConfig } from './auth-config';
import { AccessTokenDTO, TokenDetailsDTO, TokenDTO } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private authConfig: AuthConfig,
    private readonly requestMetaService: RequestMetaService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User> {
    const user: User = await this.userService.findByUserEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }
    return null;
  }

  async generateAccessToken(user: User): Promise<TokenDetailsDTO> {
    const accessGrant = this.authConfig.Options.grantTypes.accessGrant;
    const accessTokenExpiresIn = this.authConfig.Options.accessTokenOptions.expiresIn;
    const jti = this.authConfig.Options.jwtOptions.signOptions.jti;

    const accessTokenPayload = {
      name: user.name,
      email: user.email,
      sub: user.id,
      roles: await user.roles,
      grantType: accessGrant,
      jti,
    };

    const tokenDetailsDto: TokenDetailsDTO = new TokenDetailsDTO();

    tokenDetailsDto.token = this.jwtService.sign(accessTokenPayload);
    tokenDetailsDto.grantType = accessGrant;
    tokenDetailsDto.expiresIn = accessTokenExpiresIn;
    return tokenDetailsDto;
  }

  async generateRefreshToken(user: User): Promise<TokenDetailsDTO> {
    const refreshGrant: string = this.authConfig.Options.grantTypes.refreshGrant;
    const refreshTokenExpiresIn: string = this.authConfig.Options.refreshTokenOptions.expiresIn;

    const refreshPayload = {
      email: user.email,
      sub: user.id,
      grantType: refreshGrant,
    };

    const tokenDetailsDto: TokenDetailsDTO = new TokenDetailsDTO();

    tokenDetailsDto.token = this.jwtService.sign(refreshPayload);
    tokenDetailsDto.grantType = refreshGrant;
    tokenDetailsDto.expiresIn = refreshTokenExpiresIn;
    return tokenDetailsDto;
  }

  async login(credentialsDTO: CredentialsDTO): Promise<TokenDTO> {
    const { email, password } = credentialsDTO;
    const user: User = await this.validateUser(email, password);
    logger.debug(`login userFromDb ${user}`);
    if (!user) {
      throw new UnauthorizedException();
    }

    const tokenDto: TokenDTO = new TokenDTO();

    tokenDto.accessToken = await this.generateAccessToken(user);
    tokenDto.refreshToken = await this.generateRefreshToken(user);

    return tokenDto;
  }

  signUp(createUserDto: CreateUserDTO): Promise<UserDTO> {
    return this.userService.createUser(createUserDto);
  }

  async refreshToken(token: string): Promise<AccessTokenDTO> {
    const refreshTokenPayload = this.jwtService.verify(token);
    const userFromDb: User = await this.userService.findByUserEmail(refreshTokenPayload.email);

    if (refreshTokenPayload.grantType !== 'refresh' || !userFromDb) {
      throw new UnauthorizedException();
    }

    const accessTokenDto: AccessTokenDTO = new AccessTokenDTO();
    accessTokenDto.accessToken = (await this.generateAccessToken(userFromDb)).token;
    return accessTokenDto;
  }

  async updatePassword(body: UserChangePasswordDTO, request: Request) {
    const requestMeta: RequestMeta = await this.requestMetaService.getRequestMeta(request);
    if (requestMeta.email == body.email) {
      return this.userService.changeUserPassword(body);
    }
    throw new UnauthorizedException('User not Authorised');
  }
}
