import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { gaurdGuard } from './gaurd-guard';

describe('gaurdGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => gaurdGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
