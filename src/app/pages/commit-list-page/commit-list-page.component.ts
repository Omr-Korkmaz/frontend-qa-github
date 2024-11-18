import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthGithubService } from '../../services/auth-github.service';
import { Commit, GithubRepository } from '../../model/github.model'; 
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as timeago from 'timeago.js';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-commit-list-page',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './commit-list-page.component.html',
  styleUrls: ['./commit-list-page.component.scss'],
})
export class CommitListPageComponent implements OnInit {
  groupedCommits: { date: string; commits: Commit[] }[] = [];
  errorMessage: string = '';
  repositoryName: string = '';
  ownerLogin: string = '';

  constructor(
    private authGithubService: AuthGithubService,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const showAll = params['showAll'] === 'true';
      const ownerLogin = params['ownerLogin'];
      const repositoryName = params['repositoryName'];

      if (showAll) {
        this.getAllCommits();
      } else if (ownerLogin && repositoryName) {
        this.getCommits(ownerLogin, repositoryName);
      }
    });
  }

  getAllCommits(): void {
    this.authGithubService.getRepositories().subscribe({
      next: (repos: GithubRepository[]) => {
        const commitRequests = repos.map((repo) =>
          this.authGithubService.fetchAllCommits(repo.owner.login, repo.name)
        );

        forkJoin(commitRequests).subscribe({
          next: (allCommitsArray: Commit[][]) => {
            const allCommits = allCommitsArray.flat().map((commit) => ({
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

            this.groupCommitsByDate(allCommits);
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
  }
}
