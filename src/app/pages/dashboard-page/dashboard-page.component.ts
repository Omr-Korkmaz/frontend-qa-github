import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthGithubService } from '../../services/auth-github.service';
import { GithubRepository, GithubUser } from '../../model/github.model';
import { UserInfoComponent } from '../../components/user-info/user-info.component';
import { RepositoryListComponent } from './components/repository-list/repository-list.component';
import { CommitStatsComponent } from './components/commit-stats/commit-stats.component';
import { CommonModule } from '@angular/common';
import { TegelModule } from '@scania/tegel-angular-17';
import { FormsModule } from '@angular/forms';
import { ChartComponent } from '../../components/chart/chart.component';
import { LanguageChartComponent } from './components/language-chart/language-chart.component';
import { catchError, forkJoin, of } from 'rxjs';
@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    UserInfoComponent,
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
export class DashboardPageComponent implements OnInit {
  userInfo: GithubUser | null = null;
  repositories: GithubRepository[] = [];
  totalCommits: number = 0;
  errorMessage: string = '';


  languageChartData: number[] = [];
  languageChartLabels: string[] = [];
  languageStats: { [key: string]: number } = {};

  barChartLabels: string[] = [];
  barChartData: number[] = [];
  loading: boolean = true; 


  constructor(
    private authGithubService: AuthGithubService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      if (token) {
        this.authGithubService.setToken(token);
        this.loadData();
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

  private loadData() {
    this.authGithubService.getUserInfo().subscribe({
      next: (user) => (this.userInfo = user),
      error: (err) => (this.errorMessage = 'Error fetching user info.')
    });

    this.authGithubService.getRepositories().subscribe({

      next: (repos) => {
        this.repositories = repos.map(repo => ({
          ...repo,
          isEmpty: repo.size === 0 
        }));
        this.prepareLanguageChart(this.repositories);
        this.getTotalCommits(this.repositories);
      },
      error: (err) => (this.errorMessage = 'Error fetching repositories.')
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
  
    const languageRequests = repositories.map((repo) =>
      this.authGithubService.getLanguages(repo.owner.login, repo.name).pipe(
        catchError((error) => {
          console.error(`Error fetching languages for repo ${repo.name}:`, error);
          return of({});
        })
      )
    );
  
    forkJoin(languageRequests).subscribe((languagesArray) => {
      languagesArray.forEach((languages) => {
        for (const [language, bytes] of Object.entries(languages)) {
          this.languageStats[language] = (this.languageStats[language] || 0) + bytes;
        }
      });
  
      this.updateLanguageChart();
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
      queryParams: { owner: repo.owner.login, repo: repo.name },
    });
  }
}