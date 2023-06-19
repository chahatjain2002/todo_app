import { createMock } from '@golevelup/ts-jest';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { RequestMetaService } from '../../interceptors/request-meta.service';
import { UserService } from '../user/user.service';
import { AuthConfig } from './auth-config';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const userService: UserService = createMock();
  const jwtService: JwtService = createMock();
  const authConfig: AuthConfig = createMock();
  const requestMetaService: RequestMetaService = createMock();

  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: userService,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
        {
          provide: AuthConfig,
          useValue: authConfig,
        },
        {
          provide: RequestMetaService,
          useValue: requestMetaService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
