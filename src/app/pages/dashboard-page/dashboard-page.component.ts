import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthGithubService } from '../../services/auth-github.service';
import { GithubRepository, GithubUser } from '../../model/github.model';
import { catchError, forkJoin, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TegelModule } from '@scania/tegel-angular-17';
import { FormsModule } from '@angular/forms';
import { ChartComponent } from '../../shared/components/chart/chart.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
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
    this.loadData();
    this.loadCharts();
  }

  private loadData() {
    this.loading = true;

    forkJoin({
      user: this.authGithubService.getUserInfo(),
      repos: this.authGithubService.getRepositories()
    }).subscribe({
      next: ({ user, repos }) => {
        this.userInfo = user;
        this.repositories = repos.map(repo => ({
          ...repo,
          isEmpty: repo.size === 0
        }));
        this.getTotalCommits(this.repositories);
        this.prepareLanguageChart(this.repositories);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading data:', err);
        this.errorMessage = 'Error loading dashboard data.';
        this.loading = false;
      }
    });
  }

  private loadCharts() {
    this.authGithubService.getCommitsPerMonth().subscribe({
      next: (monthlyCommits) => {
        this.barChartLabels = Object.keys(monthlyCommits);
        this.barChartData = Object.values(monthlyCommits);
      },
      error: (err) => {
        console.error('Error loading bar chart data:', err);
      }
    });
  }

  private getTotalCommits(repos: GithubRepository[]): void {
    const commitRequests = repos.map((repo) =>
      this.authGithubService.fetchAllCommits(repo.owner.login, repo.name).pipe(
        catchError((error) => {
          console.error(`Error fetching commits for ${repo.name}:`, error);
          return of([]);
        })
      )
    );

    forkJoin(commitRequests).subscribe({
      next: (commitsArray) => {
        this.totalCommits = commitsArray.reduce((sum, commits) => sum + commits.length, 0);
      },
      error: (error) => {
        console.error('Error fetching total commits:', error);
      }
    });
  }

  private prepareLanguageChart(repositories: GithubRepository[]): void {
    const languageRequests = repositories.map((repo) =>
      this.authGithubService.getLanguages(repo.owner.login, repo.name).pipe(
        catchError((error) => {
          console.warn(`Error fetching languages for ${repo.name}:`, error);
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
    const totalBytes = Object.values(this.languageStats).reduce((sum, bytes) => sum + bytes, 0);
    if (totalBytes > 0) {
      this.languageChartLabels = Object.keys(this.languageStats);
      this.languageChartData = Object.values(this.languageStats).map(
        (bytes) => Number(((bytes / totalBytes) * 100).toFixed(2))
      );
    } else {
      this.languageChartLabels = [];
      this.languageChartData = [];
    }
  }

  navigateToAllCommits() {
    this.router.navigate(['/commit-list'], {
      queryParams: { showAll: true }
    });
  }

  selectRepository(repo: GithubRepository) {
    this.router.navigate(['/commit-list'], {
      queryParams: { owner: repo.owner.login, repo: repo.name }
    });
  }
}
