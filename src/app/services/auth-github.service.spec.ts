import { TestBed } from '@angular/core/testing';

import { AuthGithubService } from './auth-github.service';

describe('AuthGithubService', () => {
  let service: AuthGithubService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthGithubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
