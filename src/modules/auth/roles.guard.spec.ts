import { createMock } from '@golevelup/ts-jest';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  const reflector: Reflector = createMock<Reflector>();

  it('should be defined', () => {
    expect(new RolesGuard(reflector)).toBeDefined();
  });
});
