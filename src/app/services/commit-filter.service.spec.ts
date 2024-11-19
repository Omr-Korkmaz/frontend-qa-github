import { TestBed } from '@angular/core/testing';

import { CommitFilterService } from './commit-filter.service';

describe('CommitFilterService', () => {
  let service: CommitFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommitFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
