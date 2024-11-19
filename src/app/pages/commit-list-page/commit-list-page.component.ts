
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthGithubService } from '../../services/auth-github.service';
import { Commit, GithubRepository } from '../../model/github.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as timeago from 'timeago.js';
import { forkJoin } from 'rxjs';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { TegelModule } from '@scania/tegel-angular-17';



@Component({
  selector: 'app-commit-list-page',
  standalone: true,
  imports: [FormsModule, CommonModule, MatPaginatorModule, TegelModule],
  templateUrl: './commit-list-page.component.html',
  styleUrls: ['./commit-list-page.component.scss'],
})
export class CommitListPageComponent implements OnInit {
  repositories: GithubRepository[] = [];
  selectedRepository: string = '';
  groupedCommits: { date: string; commits: Commit[] }[] = [];
  filteredGroupedCommits: { date: string; commits: Commit[] }[] = [];
  filteredPagedCommits: { date: string; commits: Commit[] }[] = [];
  searchTerm: string = '';
  errorMessage: string = '';
  allCommits: Commit[] = [];
  pageSize = 2;
  currentPage = 0;
  loading: boolean = false; 


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
    this.selectedRepository = repoName;
    this.errorMessage = '';
    this.loading = true; 
    this.currentPage = 0; 
  
    const selectedRepo = this.repositories.find((repo) => repo.name === repoName);
  
    if (selectedRepo) {
      this.authGithubService.getCommits(selectedRepo.owner.login, selectedRepo.name).subscribe({
        next: (commits: Commit[]) => {
          this.loading = false;
  
          if (commits.length === 0) {
            this.errorMessage = 'No commits found for this repository.';
            this.groupedCommits = [];
            this.filteredGroupedCommits = [];
            this.filteredPagedCommits = [];
          } else {
            this.groupCommitsByDate(commits);
            this.updatePagedCommits();
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Error fetching commits for the selected repository.';
          this.groupedCommits = [];
          this.filteredGroupedCommits = [];
          this.filteredPagedCommits = [];
        },
      });
    } else {
      this.loading = false;
      this.resetFilters();
    }
  }
  
  

  resetFilters(): void {
    this.selectedRepository = '';
    this.searchTerm = '';
    this.groupCommitsByDate(this.allCommits); 
    this.updatePagedCommits(); 
  }

  // getAllCommits(): void {
  //   this.authGithubService.getRepositories().subscribe({
  //     next: (repos: GithubRepository[]) => {
  //       const commitRequests = repos.map((repo) =>
  //         this.authGithubService.fetchAllCommits(repo.owner.login, repo.name)
  //       );

  //       forkJoin(commitRequests).subscribe({
  //         next: (allCommitsArray: Commit[][]) => {
  //           this.allCommits = allCommitsArray.flat();
  //           if (this.allCommits.length === 0) {
  //             this.errorMessage = 'No commits found in any repository.';
  //           } else {

  //             this.groupCommitsByDate(this.allCommits);
  //             this.updatePagedCommits(); // Immediately display first page
  //           }
  //         },
  //         error: (error) => {
  //           console.error('Error fetching all commits:', error);
  //           this.errorMessage = 'Error fetching all commits.';
  //         },
  //       });
  //     },
  //     error: (error) => {
  //       console.error('Error fetching repositories:', error);
  //       this.errorMessage = 'Error fetching repositories.';
  //     },
  //   });
  // }


getAllCommits(): void {
  this.authGithubService.getRepositories().subscribe({
    next: (repos: GithubRepository[]) => {
      const commitRequests = repos.map((repo) =>
        this.authGithubService.fetchAllCommits(repo.owner.login, repo.name)
      );

      forkJoin(commitRequests).subscribe({
        next: (allCommitsArray: Commit[][]) => {
          this.allCommits = allCommitsArray.flat().map((commit) => ({
            ...commit,
            timeAgo: timeago.format(commit.commit.author.date), 
          }));

          if (this.allCommits.length === 0) {
            this.errorMessage = 'No commits found in any repository.';
          } else {
            this.groupCommitsByDate(this.allCommits);
            this.updatePagedCommits(); 
          }
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
        this.updatePagedCommits();
        console.log('Processed dfdfdfd:', commits, );

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
    const filteredCommits = this.groupedCommits
      .map((group) => ({
        date: group.date,
        commits: group.commits.filter((commit) => {
          const searchText = this.searchTerm.toLowerCase();
          return (
            commit.commit.message.toLowerCase().includes(searchText) ||
            commit.commit.author.name.toLowerCase().includes(searchText) ||
            commit.sha.toLowerCase().includes(searchText)
          );
        }),
      }))
      .filter((group) => group.commits.length > 0); 
  
    this.filteredGroupedCommits = this.sortCommitsByDate(filteredCommits); 
  
    this.currentPage = 0;
    this.updatePagedCommits(); 
  }
  
  

  sortCommitsByDate(groups: { date: string; commits: Commit[] }[]): { date: string; commits: Commit[] }[] {
    return groups.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize; 
    this.currentPage = event.pageIndex; 
    this.updatePagedCommits(); 
  }
  
  
  

updatePagedCommits(): void {
  const startIndex = this.currentPage * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.filteredPagedCommits = this.filteredGroupedCommits.slice(startIndex, endIndex);
  
  console.log(`Slicing commits from ${startIndex} to ${endIndex}`);
  console.log('Filtered Paged Commits:', this.filteredPagedCommits);
}

  
  
}
