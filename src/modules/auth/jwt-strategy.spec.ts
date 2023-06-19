import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthConfig } from './auth-config';
import { JwtStrategy } from './jwt-strategy';

describe('JwtStrategy', () => {
  const authConfig: AuthConfig = createMock<AuthConfig>({
    Options: {
      jwtOptions: { secret: ['any-secret'] },
    },
  });
  let provider: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: AuthConfig,
          useValue: authConfig,
        },
      ],
    }).compile();

    provider = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
