import { TestBed } from '@angular/core/testing';

import { authGuardGuard } from './auth-guard.guard';

describe('AuthGuardGuard', () => {
  let guard: authGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(authGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
