import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { RequestMetaService } from '../../../interceptors/request-meta.service';
import { AuthConfig } from '../auth-config';
import { AuthService } from '../auth.service';
import { AppAuthController } from './app-auth.controller';

describe('AppAuth Controller', () => {
  const authService: AuthService = createMock();
  const authConfig: AuthConfig = createMock();
  const requestMetaService: RequestMetaService = createMock();

  let controller: AppAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppAuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
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

    controller = module.get<AppAuthController>(AppAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
