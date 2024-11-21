
// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { AuthGithubService } from '../../services/auth-github.service';
// import { Commit, GithubRepository } from '../../model/github.model';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import * as timeago from 'timeago.js';
// import { forkJoin, map } from 'rxjs';
// import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
// import { TegelModule } from '@scania/tegel-angular-17';

// import { FilterControlsComponent } from '../../components/filter-controls/filter-controls.component';
// import { CommitListComponent } from '../../components/commit-list/commit-list.component';
// import { PaginatorComponent } from '../../components/paginator/paginator.component';

// @Component({
//   selector: 'app-commit-list-page',
//   standalone: true,
//   imports: [
//     FormsModule,
//     CommonModule,
//     MatPaginatorModule,
//     TegelModule,
//     FilterControlsComponent,
//     CommitListComponent,
//     PaginatorComponent
//   ],
//   templateUrl: './commit-list-page.component.html',
//   styleUrls: ['./commit-list-page.component.scss'],
// })
// export class CommitListPageComponent implements OnInit {
//   repositories: GithubRepository[] = [];
//   selectedRepository: string = '';
//   groupedCommits: { date: string; commits: Commit[] }[] = [];
//   filteredGroupedCommits: { date: string; commits: Commit[] }[] = [];
//   filteredPagedCommits: { date: string; commits: Commit[] }[] = [];
//   searchTerm: string = '';
//   errorMessage: string = '';
//   allCommits: Commit[] = [];
//   pageSize = 2;
//   currentPage = 0;
//   loading: boolean = false;

//   constructor(
//     private authGithubService: AuthGithubService,
//     private route: ActivatedRoute
//   ) {}

//   ngOnInit(): void {
//     this.route.queryParams.subscribe((params) => {
//       const owner = params['owner'];
//       const repo = params['repo'];

//       if (owner && repo) {
//         this.getCommits(owner, repo);
//       } else {
//         this.getAllCommits();
//       }
//     });
//     this.loadRepositories();
//   }

//   loadRepositories(): void {
//     this.authGithubService.getRepositories().subscribe({
//       next: (repos) => {
//         this.repositories = repos;
//       },
//       error: (error) => {
//         console.error('Error fetching repositories:', error);
//         this.errorMessage = 'Error fetching repositories.';
//       },
//     });
//   }

//   selectRepository(repoName: string): void {
//     this.selectedRepository = repoName;
//     this.currentPage = 0;

//     if (!repoName) {
//       this.groupCommitsByDate(this.allCommits);
//     } else {
//       const filteredCommits = this.allCommits.filter(
//         (commit) => commit.repository === repoName
//       );
//       this.groupCommitsByDate(filteredCommits);
//     }

//     this.updatePagedCommits();
//   }

//   resetFilters(): void {
//     this.selectedRepository = '';
//     this.groupCommitsByDate(this.allCommits);
//     this.updatePagedCommits();
//   }

//   getAllCommits(): void {
//     this.loading = true;
//     this.authGithubService.getRepositories().subscribe({
//       next: (repos: GithubRepository[]) => {
//         const commitRequests = repos.map((repo) =>
//           this.authGithubService.fetchAllCommits(repo.owner.login, repo.name).pipe(
//             map((commits) =>
//               commits.map((commit) => ({
//                 ...commit,
//                 repository: repo.name,
//                 timeAgo: timeago.format(commit.commit.author.date),
//               }))
//             )
//           )
//         );

//         forkJoin(commitRequests).subscribe({
//           next: (allCommitsArray: Commit[][]) => {
//             this.loading = false;
//             this.allCommits = allCommitsArray.flat();

//             if (this.allCommits.length === 0) {
//               this.errorMessage = 'No commits found in any repository.';
//             } else {
//               this.groupCommitsByDate(this.allCommits);
//               this.updatePagedCommits();
//             }
//           },
//           error: (error) => {
//             this.loading = false;
//             console.error('Error fetching all commits:', error);
//             this.errorMessage = 'Error fetching all commits.';
//           },
//         });
//       },
//       error: (error) => {
//         this.loading = false;
//         console.error('Error fetching repositories:', error);
//         this.errorMessage = 'Error fetching repositories.';
//       },
//     });
//   }

//   getCommits(owner: string, repo: string): void {
//     this.loading = true;
//     this.authGithubService.getCommits(owner, repo).subscribe({
//       next: (commits) => {
//         this.loading = false;
//         if (commits.length === 0) {
//           this.errorMessage = `No commits found for repository ${repo}.`;
//           this.groupedCommits = [];
//           this.filteredGroupedCommits = [];
//           this.filteredPagedCommits = [];
//         } else {
//           this.errorMessage = '';
//           this.groupCommitsByDate(
//             commits.map((commit) => ({
//               ...commit,
//               repository: repo,
//               timeAgo: timeago.format(commit.commit.author.date),
//             }))
//           );
//           this.updatePagedCommits();
//         }
//       },
//       error: (error) => {
//         this.loading = false;
//         console.error('Error fetching commits:', error);
//         this.errorMessage = `Error fetching commits for repository ${repo}.`;
//       },
//     });
//   }

//   private groupCommitsByDate(commits: Commit[]): void {
//     const grouped = commits.reduce((acc: Record<string, Commit[]>, commit: Commit) => {
//       const date = new Date(commit.commit.author.date).toLocaleDateString();
//       if (!acc[date]) {
//         acc[date] = [];
//       }
//       acc[date].push(commit);
//       return acc;
//     }, {});

//     this.groupedCommits = Object.keys(grouped).map((date) => ({
//       date,
//       commits: grouped[date],
//     }));

//     this.filteredGroupedCommits = this.sortCommitsByDate(this.groupedCommits);
//   }

//   onFilterChanged(filters: { selectedRepository: string; searchTerm: string }) {
//     this.selectedRepository = filters.selectedRepository;
//     this.searchTerm = filters.searchTerm;

//     this.filterCommits();
//   }

//   filterCommits(): void {
//     let filteredCommits = this.allCommits;

//     if (this.selectedRepository) {
//       filteredCommits = filteredCommits.filter(
//         (commit) => commit.repository === this.selectedRepository
//       );
//     }

//     if (this.searchTerm) {
//       const searchText = this.searchTerm.toLowerCase();
//       filteredCommits = filteredCommits.filter(
//         (commit) =>
//           commit.commit.message.toLowerCase().includes(searchText) ||
//           commit.commit.author.name.toLowerCase().includes(searchText) ||
//           commit.sha.toLowerCase().includes(searchText)
//       );
//     }

//     this.groupCommitsByDate(filteredCommits);
//     this.currentPage = 0;
//     this.updatePagedCommits();
//   }

//   sortCommitsByDate(groups: { date: string; commits: Commit[] }[]): { date: string; commits: Commit[] }[] {
//     return groups.sort((a, b) => {
//       const dateA = new Date(a.date).getTime();
//       const dateB = new Date(b.date).getTime();
//       return dateB - dateA;
//     });
//   }

//   onPageChange(event: PageEvent): void {
//     this.pageSize = event.pageSize;
//     this.currentPage = event.pageIndex;
//     this.updatePagedCommits();
//   }

//   updatePagedCommits(): void {
//     const startIndex = this.currentPage * this.pageSize;
//     const endIndex = startIndex + this.pageSize;
//     this.filteredPagedCommits = this.filteredGroupedCommits.slice(startIndex, endIndex);
//   }
// }



import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthGithubService } from '../../services/auth-github.service';
import { Commit, GithubRepository } from '../../model/github.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as timeago from 'timeago.js';
import { forkJoin, map } from 'rxjs';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { TegelModule } from '@scania/tegel-angular-17';

import { FilterControlsComponent } from '../../components/filter-controls/filter-controls.component';
import { CommitListComponent } from '../../components/commit-list/commit-list.component';
import { PaginatorComponent } from '../../components/paginator/paginator.component';

@Component({
  selector: 'app-commit-list-page',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatPaginatorModule,
    TegelModule,
    FilterControlsComponent,
    CommitListComponent,
    PaginatorComponent,
  ],
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

  startDate: string | null = null;
  endDate: string | null = null;

  constructor(
    private authGithubService: AuthGithubService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const owner = params['owner'];
      const repo = params['repo'];

      if (owner && repo) {
        this.getCommits(owner, repo);
      } else {
        this.getAllCommits();
      }
    });
    this.loadRepositories();
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

  resetFilters(): void {
    this.selectedRepository = '';
    this.searchTerm = '';
    this.startDate = null;
    this.endDate = null;

    const startDatePicker = document.querySelector('#start-date') as HTMLInputElement;
    const endDatePicker = document.querySelector('#end-date') as HTMLInputElement;

    if (startDatePicker) startDatePicker.value = '';
    if (endDatePicker) endDatePicker.value = '';

    this.filterCommits();
  }

  getAllCommits(): void {
    this.loading = true;
    this.authGithubService.getRepositories().subscribe({
      next: (repos: GithubRepository[]) => {
        const commitRequests = repos.map((repo) =>
          this.authGithubService.fetchAllCommits(repo.owner.login, repo.name).pipe(
            map((commits) =>
              commits.map((commit) => ({
                ...commit,
                repository: repo.name,
                timeAgo: timeago.format(commit.commit.author.date),
              }))
            )
          )
        );

        forkJoin(commitRequests).subscribe({
          next: (allCommitsArray: Commit[][]) => {
            this.loading = false;
            this.allCommits = allCommitsArray.flat();

            if (this.allCommits.length === 0) {
              this.errorMessage = 'No commits found in any repository.';
            } else {
              this.groupCommitsByDate(this.allCommits);
              this.updatePagedCommits();
            }
          },
          error: (error) => {
            this.loading = false;
            console.error('Error fetching all commits:', error);
            this.errorMessage = 'Error fetching all commits.';
          },
        });
      },
      error: (error) => {
        this.loading = false;
        console.error('Error fetching repositories:', error);
        this.errorMessage = 'Error fetching repositories.';
      },
    });
  }


  getCommits(owner: string, repo: string): void {
        this.loading = true;
        this.authGithubService.getCommits(owner, repo).subscribe({
          next: (commits) => {
            this.loading = false;
            if (commits.length === 0) {
              this.errorMessage = `No commits found for repository ${repo}.`;
              this.groupedCommits = [];
              this.filteredGroupedCommits = [];
              this.filteredPagedCommits = [];
            } else {
              this.errorMessage = '';
              this.groupCommitsByDate(
                commits.map((commit) => ({
                  ...commit,
                  repository: repo,
                  timeAgo: timeago.format(commit.commit.author.date),
                }))
              );
              this.updatePagedCommits();
            }
          },
          error: (error) => {
            this.loading = false;
            console.error('Error fetching commits:', error);
            this.errorMessage = `Error fetching commits for repository ${repo}.`;
          },
        });
      }

  filterCommits(): void {
    let filteredCommits = this.allCommits;

    if (this.selectedRepository) {
      filteredCommits = filteredCommits.filter(
        (commit) => commit.repository === this.selectedRepository
      );
    }

    if (this.searchTerm) {
      const searchText = this.searchTerm.toLowerCase();
      filteredCommits = filteredCommits.filter(
        (commit) =>
          commit.commit.message.toLowerCase().includes(searchText) ||
          commit.commit.author.name.toLowerCase().includes(searchText) ||
          commit.sha.toLowerCase().includes(searchText)
      );
    }

    if (this.startDate) {
      const start = new Date(this.startDate).getTime();
      filteredCommits = filteredCommits.filter(
        (commit) => new Date(commit.commit.author.date).getTime() >= start
      );
    }

    if (this.endDate) {
      const end = new Date(this.endDate).getTime();
      filteredCommits = filteredCommits.filter(
        (commit) => new Date(commit.commit.author.date).getTime() <= end
      );
    }

    this.groupCommitsByDate(filteredCommits);
    this.currentPage = 0;
    this.updatePagedCommits();
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

  sortCommitsByDate(groups: { date: string; commits: Commit[] }[]): { date: string; commits: Commit[] }[] {
    return groups.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
  }

  updatePagedCommits(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredPagedCommits = this.filteredGroupedCommits.slice(startIndex, endIndex);
  }

  onFilterChanged(filters: { selectedRepository: string; searchTerm: string }): void {
    this.selectedRepository = filters.selectedRepository;
    this.searchTerm = filters.searchTerm;
    this.filterCommits();
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePagedCommits();
  }
}
