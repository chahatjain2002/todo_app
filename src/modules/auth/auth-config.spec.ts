import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthConfig } from './auth-config';

describe('AuthConfig', () => {
  const configService: ConfigService = createMock<ConfigService>();
  let provider: AuthConfig;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthConfig,
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
    }).compile();

    provider = module.get<AuthConfig>(AuthConfig);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
