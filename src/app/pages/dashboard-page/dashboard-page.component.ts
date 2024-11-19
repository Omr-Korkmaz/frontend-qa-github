import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthGithubService } from '../../services/auth-github.service';
import { DataCacheService } from '../../services/data-cache.service'; 
import { GithubRepository, GithubUser } from '../../model/github.model';
import { UserInfoComponent } from '../../components/user-info/user-info.component';
import { RepositoryListComponent } from './components/repository-list/repository-list.component';
import { CommitStatsComponent } from './components/commit-stats/commit-stats.component';
import { CommonModule } from '@angular/common';
import { PLanguageUsageComponent } from './components/p-language-usage/p-language-usage.component';
import { TegelModule } from '@scania/tegel-angular-17';
import { FormsModule } from '@angular/forms';
import { ChartComponent } from '../../components/chart/chart.component';
import { LanguageChartComponent } from './components/language-chart/language-chart.component';
import { forkJoin, interval, Subscription } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    UserInfoComponent,
    PLanguageUsageComponent,
    RepositoryListComponent,
    CommitStatsComponent,
    CommonModule,
    LanguageChartComponent,
    TegelModule,
    FormsModule,
    ChartComponent
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  userInfo: GithubUser | null = null;
  repositories: GithubRepository[] = [];
  totalCommits: number = 0;
  errorMessage: string = '';
  private refreshSubscription!: Subscription; 

  languageChartData: number[] = [];
  languageChartLabels: string[] = [];
  languageStats: { [key: string]: number } = {};

  barChartLabels: string[] = [];
  barChartData: number[] = [];

  constructor(
    private authGithubService: AuthGithubService,
    private dataCacheService: DataCacheService, 
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      if (token) {
        this.authGithubService.setToken(token);
        this.loadData(); 
        this.setupAutoRefresh(); 
      } else {
        this.errorMessage = 'No token provided. Please log in again.';
      }
    });

    this.authGithubService.getLanguages('owner', 'repo').subscribe((languages) => {
      this.languageChartLabels = Object.keys(languages);
      this.languageChartData = Object.values(languages);
    });

    this.authGithubService.getCommitsPerMonth().subscribe((monthlyCommits) => {
      this.barChartLabels = Object.keys(monthlyCommits);
      this.barChartData = Object.values(monthlyCommits);
    });
  }

  private loadData(): void {
    this.dataCacheService.getData('userInfo').subscribe({
      next: (cachedUser) => {
        if (cachedUser) {
          this.userInfo = cachedUser;
        } else {
          this.fetchUserInfo(); 
        }
      },
      error: () => this.fetchUserInfo(), 
    });

    this.dataCacheService.getData('repositories').subscribe({
      next: (cachedRepos) => {
        if (cachedRepos) {
          this.repositories = cachedRepos;
          this.prepareLanguageChart(this.repositories);
          this.getTotalCommits(this.repositories);
        } else {
          this.fetchRepositories(); 
        }
      },
      error: () => this.fetchRepositories(), 
    });
  }

  private fetchUserInfo(): void {
    this.authGithubService.getUserInfo().subscribe({
      next: (user) => {
        this.userInfo = user;
        this.dataCacheService.cacheData('userInfo', user); 
      },
      error: () => (this.errorMessage = 'Error fetching user info.')
    });
  }

  private fetchRepositories(): void {
    this.authGithubService.getRepositories().subscribe({
      next: (repos) => {
        this.repositories = repos.map(repo => ({
          ...repo,
          isEmpty: repo.size === 0 
        }));
        this.dataCacheService.cacheData('repositories', this.repositories); 
        this.prepareLanguageChart(this.repositories);
        this.getTotalCommits(this.repositories);
      },
      error: () => (this.errorMessage = 'Error fetching repositories.')
    });
  }

  private setupAutoRefresh(): void {
    this.refreshSubscription = interval(900000) 
      .pipe(
        switchMap(() => this.authGithubService.getRepositories()),
        catchError((error) => {
          console.error('Error during auto-refresh:', error);
          return [];
        })
      )
      .subscribe({
        next: (repos) => {
          this.repositories = repos.map(repo => ({
            ...repo,
            isEmpty: repo.size === 0 
          }));
          this.dataCacheService.cacheData('repositories', repos); 
          this.prepareLanguageChart(this.repositories);
          this.getTotalCommits(this.repositories);
        },
      });
  }

  private getTotalCommits(repos: GithubRepository[]): void {
    const commitRequests = repos.map((repo) =>
      this.authGithubService.fetchAllCommits(repo.owner.login, repo.name)
    );
  
    forkJoin(commitRequests).subscribe({
      next: (commitsArray) => {
        this.totalCommits = commitsArray.reduce((sum, commits) => sum + commits.length, 0);
      },
      error: (error) => {
        this.errorMessage = 'Error fetching commit data.';
        console.error('Error fetching commits:', error);
      },
    });
  }

  private prepareLanguageChart(repositories: GithubRepository[]): void {
    if (!repositories || repositories.length === 0) {
      console.warn('No repositories provided to prepare language chart.');
      this.languageChartLabels = [];
      this.languageChartData = [];
      return;
    }
  
    this.languageStats = {};
  
    repositories.forEach((repo) => {
      this.authGithubService.getLanguages(repo.owner.login, repo.name).subscribe(
        (languages) => {
          for (const [language, bytes] of Object.entries(languages)) {
            this.languageStats[language] = (this.languageStats[language] || 0) + bytes;
          }
  
          this.updateLanguageChart();
        },
        (error) => {
          console.error(`Error fetching languages for repo ${repo.name}:`, error);
        }
      );
    });
  }

  private updateLanguageChart(): void {
    const totalBytes = (Object.values(this.languageStats) as number[]).reduce(
      (sum, bytes) => sum + bytes,
      0
    );
  
    if (totalBytes === 0) {
      console.warn('No data available for language statistics.');
      this.languageChartLabels = [];
      this.languageChartData = [];
      return;
    }
  
    this.languageChartLabels = Object.keys(this.languageStats);
    this.languageChartData = (Object.values(this.languageStats) as number[]).map((bytes) =>
      Number(((bytes / totalBytes) * 100).toFixed(2))
    );
  }

  navigateToAllCommits() {
    this.router.navigate(['/commit-list'], {
      queryParams: { showAll: true }
    });
  }

  selectRepository(repo: GithubRepository) {
    this.router.navigate(['/commit-list'], {
      queryParams: { ownerLogin: repo.owner.login, repositoryName: repo.name },
    });
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe(); 
    }
  }
}
