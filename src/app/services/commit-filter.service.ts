import { Injectable } from '@angular/core';
import { Commit } from '../model/github.model';

@Injectable({
  providedIn: 'root',
})
export class CommitFilterService {
  filterCommits(
    groupedCommits: { date: string; commits: Commit[] }[],
    searchTerm: string
  ): { date: string; commits: Commit[] }[] {
    const searchText = searchTerm.toLowerCase();

    return groupedCommits
      .map((group) => ({
        date: group.date,
        commits: group.commits.filter(
          (commit) =>
            commit.commit.message.toLowerCase().includes(searchText) ||
            commit.commit.author.name.toLowerCase().includes(searchText) ||
            commit.sha.toLowerCase().includes(searchText)
        ),
      }))
      .filter((group) => group.commits.length > 0);
  }

  sortCommitsByDate(
    groupedCommits: { date: string; commits: Commit[] }[]
  ): { date: string; commits: Commit[] }[] {
    return groupedCommits.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA; 
    });
  }
}
