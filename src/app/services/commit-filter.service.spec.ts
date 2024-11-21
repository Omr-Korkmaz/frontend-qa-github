import { TestBed } from '@angular/core/testing';
import { CommitFilterService } from './commit-filter.service';
import { Commit } from '../model/github.model';

import groupedCommits from '../../../cypress/fixtures/commits.json';

describe('CommitFilterService', () => {
  let service: CommitFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommitFilterService);
  });

  it('should filter commits based on the search term', () => {
    const searchTerm = 'Added';
    const filteredCommits = service.filterCommits(groupedCommits, searchTerm);

    expect(filteredCommits.length).toBe(1);
    expect(filteredCommits[0].commits[0].commit.message).toContain(searchTerm);
  });

  it('should return an empty array if no commits match the search term', () => {
    const searchTerm = 'Non-existent term';
    const filteredCommits = service.filterCommits(groupedCommits, searchTerm);

    expect(filteredCommits.length).toBe(0);
  });

  it('should sort commits by date in descending order', () => {
    const unsortedCommits = [
      {
        date: '2022-04-11',
        commits: groupedCommits[0].commits,
      },
      {
        date: '2022-04-12',
        commits: groupedCommits[0].commits,
      },
    ];

    const sortedCommits = service.sortCommitsByDate(unsortedCommits);

    expect(sortedCommits[0].date).toBe('2022-04-12');
    expect(sortedCommits[1].date).toBe('2022-04-11');
  });
});
