
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthGithubService } from '../../services/auth-github.service';
import { Commit, GithubRepository } from '../../model/github.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RepositorySelectorComponent } from '../../components/repository-selector/repository-selector.component';
import * as timeago from 'timeago.js';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-commit-list-page',
  standalone: true,
  imports: [FormsModule, CommonModule, RepositorySelectorComponent],
  templateUrl: './commit-list-page.component.html',
  styleUrls: ['./commit-list-page.component.scss'],
})
export class CommitListPageComponent implements OnInit {
  repositories: GithubRepository[] = [];
  selectedRepository: string = '';
  groupedCommits: { date: string; commits: Commit[] }[] = [];
  filteredGroupedCommits: { date: string; commits: Commit[] }[] = [];
  searchTerm: string = '';
  sortOrder: 'asc' | 'desc' = 'desc';
  errorMessage: string = '';
  allCommits: Commit[] = [];

  constructor(
    private authGithubService: AuthGithubService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRepositories();
    this.getAllCommits(); 
  }

  loadRepositories(): void {
    this.authGithubService.getRepositories().subscribe({
      next: (repos) => {
        this.repositories = repos;
      },
      error: (error) => {
        console.error('Error fetching repositories:', error);
        this.errorMessage = 'Error fetching repositories.';
      },
    });
  }

  selectRepository(repoName: string): void {
    const selectedRepo = this.repositories.find((repo) => repo.name === repoName);
    if (selectedRepo) {
      this.getCommits(selectedRepo.owner.login, selectedRepo.name);
    }
  }

  resetFilters(): void {
    this.selectedRepository = '';
    this.searchTerm = '';
    this.sortOrder = 'desc';
    this.groupCommitsByDate(this.allCommits);
  }

  getAllCommits(): void {
    this.authGithubService.getRepositories().subscribe({
      next: (repos: GithubRepository[]) => {
        const commitRequests = repos.map((repo) =>
          this.authGithubService.fetchAllCommits(repo.owner.login, repo.name)
        );

        forkJoin(commitRequests).subscribe({
          next: (allCommitsArray: Commit[][]) => {
            this.allCommits = allCommitsArray.flat().map((commit) => ({
              sha: commit.sha,
              html_url: commit.html_url,
              committer: {
                name: commit.committer?.name || 'Unknown',
                avatar_url: commit.committer?.avatar_url || 'default-avatar.png',
                html_url: commit.committer?.html_url || '#',
              },
              commit: {
                message: commit.commit.message,
                author: {
                  name: commit.commit.author.name,
                  date: commit.commit.author.date,
                },
              },
              timeAgo: timeago.format(commit.commit.author.date),
            }));

            this.groupCommitsByDate(this.allCommits);
          },
          error: (error) => {
            console.error('Error fetching all commits:', error);
            this.errorMessage = 'Error fetching all commits.';
          },
        });
      },
      error: (error) => {
        console.error('Error fetching repositories:', error);
        this.errorMessage = 'Error fetching repositories.';
      },
    });
  }

  getCommits(ownerLogin: string, repositoryName: string): void {
    this.authGithubService.getCommits(ownerLogin, repositoryName).subscribe({
      next: (data: Commit[]) => {
        const commits = data.map((commit) => ({
          sha: commit.sha,
          html_url: commit.html_url,
          committer: {
            name: commit.committer?.name || 'Unknown',
            avatar_url: commit.committer?.avatar_url || 'default-avatar.png',
            html_url: commit.committer?.html_url || '#',
          },
          commit: {
            message: commit.commit.message,
            author: {
              name: commit.commit.author.name,
              date: commit.commit.author.date,
            },
          },
          timeAgo: timeago.format(commit.commit.author.date),
        }));

        this.groupCommitsByDate(commits);
      },
      error: (error) => {
        console.error('Error fetching commits:', error);
        this.errorMessage = 'Error fetching commits.';
      },
    });
  }

  private groupCommitsByDate(commits: Commit[]): void {
    const grouped = commits.reduce((acc: Record<string, Commit[]>, commit: Commit) => {
      const date = new Date(commit.commit.author.date).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(commit);
      return acc;
    }, {});

    this.groupedCommits = Object.keys(grouped).map((date) => ({
      date,
      commits: grouped[date],
    }));

    this.filteredGroupedCommits = this.sortCommitsByDate(this.groupedCommits);
  }

  filterCommits(): void {
    const filteredCommits = this.groupedCommits.map((group) => ({
      date: group.date,
      commits: group.commits.filter((commit) => {
        const searchText = this.searchTerm.toLowerCase();
        return (
          commit.commit.message.toLowerCase().includes(searchText) ||
          commit.commit.author.name.toLowerCase().includes(searchText) ||
          commit.sha.toLowerCase().includes(searchText)
        );
      }),
    })).filter(group => group.commits.length > 0);

    this.filteredGroupedCommits = this.sortCommitsByDate(filteredCommits);
  }

  // Sort grouped commits by date based on selected sort order
  sortCommitsByDate(groups: { date: string; commits: Commit[] }[]): { date: string; commits: Commit[] }[] {
    return groups.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return this.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }

  sortCommits(): void {
    this.filteredGroupedCommits = this.sortCommitsByDate(this.filteredGroupedCommits);
  }
}
