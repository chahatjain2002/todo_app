import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { RequestMetaService } from '../../../interceptors/request-meta.service';
import { CredentialsDTO } from '../../user/credentials.dto';
import { CreateUserDTO, UserChangePasswordDTO, UserDTO } from '../../user/user.dto';
import { AuthConfig } from '../auth-config';
import { AccessTokenDTO, RefreshTokenDTO, TokenDTO, TokenDetailsDTO } from '../auth.dto';
import { AuthService } from '../auth.service';
import { JwtAuthGuard } from '../jwt-auth.guard';

@Controller('auth')
@ApiTags('auth')
export class AppAuthController {
  constructor(private authService: AuthService, private readonly authConfig: AuthConfig, private readonly requestMetaService: RequestMetaService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: TokenDetailsDTO,
    description: 'TokenDetailsDTO with token details',
  })
  async login(@Body() req: CredentialsDTO, @Res() res: Response): Promise<void> {
    const tokens: TokenDTO = await this.authService.login(req);
    const refreshTokenExpiryTime = this.authConfig.Options.refreshTokenOptions.expiresIn;
    const refreshTokenPath = this.authConfig.Options.refreshTokenOptions.path;

    res.set(
      'Set-Cookie',
      `refreshToken=${JSON.stringify(tokens.refreshToken)}; Path=${refreshTokenPath}; Max-Age=${refreshTokenExpiryTime}; HttpOnly`,
    );
    res.setHeader('Authorization', tokens.accessToken.token);

    res.send(tokens);
  }

  @Post('register')
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: UserDTO,
    description: 'UserDTO with user details',
  })
  signUp(@Body() req: CreateUserDTO): Promise<UserDTO> {
    return this.authService.signUp(req);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: AccessTokenDTO,
    description: 'AccessTokenDTO with token details',
  })
  async refreshToken(@Body() body: RefreshTokenDTO): Promise<AccessTokenDTO> {
    const refreshToken = body.refreshToken;
    return this.authService.refreshToken(refreshToken);
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('BearerAuthorization')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Change Password',
  })
  async updatePassword(@Body() body: UserChangePasswordDTO, @Req() request: Request) {
    return await this.authService.updatePassword(body, request);
  }
}
