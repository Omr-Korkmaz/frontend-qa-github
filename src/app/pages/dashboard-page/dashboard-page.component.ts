import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthGithubService } from '../../services/auth-github.service';
import { UserService } from '../../services/user.service';
import { GithubUser, GithubRepository } from '../../model/github.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChartComponent } from '../../components/chart/chart.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [FormsModule, CommonModule, ChartComponent], 
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
})
export class DashboardPageComponent implements OnInit {
  repositories: GithubRepository[] = [];
  commits: any[] = [];
  selectedRepo: GithubRepository | null = null;
  userInfo: GithubUser | null = null;
  errorMessage: string = '';
  
  // Initialize chart data variables
  chartData: number[] = [];
  chartLabels: string[] = [];

  constructor(
    private authGithubService: AuthGithubService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];

      if (token) {
        this.authGithubService.setToken(token);

        this.getUserInfo();
        this.getRepositories();
      } else {
        this.errorMessage = 'No token provided. Please log in again.';
      }
    });
  }

  getUserInfo() {
    this.authGithubService.getUserInfo().subscribe(
      (data: GithubUser) => {
        this.userInfo = data;
        
        console.log('userInfo:', this.userInfo);
        console.log('Public Repos:', this.userInfo?.public_repos);
        console.log('Followers:', this.userInfo?.followers);
        console.log('Following:', this.userInfo?.following);

        if (this.userInfo?.public_repos != null && this.userInfo?.followers != null && this.userInfo?.following != null) {
          this.chartData = [this.userInfo.public_repos, this.userInfo.followers, this.userInfo.following];
          this.chartLabels = ['Public Repos', 'Followers', 'Following'];
          
          console.log('Chart Data:', this.chartData);
          console.log('Chart Labels:', this.chartLabels);
        } else {
          console.error('Some user info values are missing or invalid!');
        }
      },
      (error: any) => {
        this.errorMessage = 'Error fetching user info. Please log in again.';
        console.error('Error fetching user info:', error);
      }
    );
  }

  getRepositories() {
    const token = this.authGithubService.getToken();

    if (!token) {
      this.errorMessage = 'Token is missing. Please log in again.';
      return;
    }

    this.authGithubService.getRepositories().subscribe(
      (data: any) => {
        this.repositories = data;
        console.log('Repositories:', data);
      },
      (error: any) => {
        this.errorMessage = 'Error fetching repositories. Please try again.';
        console.error('Error fetching repositories:', error);
      }
    );
  }

  getCommits(owner: string, repo: string) {
    const token = this.authGithubService.getToken();

    if (!token) {
      this.errorMessage = 'Token is missing. Please log in again.';
      return;
    }

    this.authGithubService.getCommits(owner, repo).subscribe(
      (data: any) => {
        this.commits = data;
        console.log('Commits:', data);
      },
      (error: any) => {
        this.errorMessage = 'Error fetching commits. Please try again.';
        console.error('Error fetching commits:', error);
      }
    );
  }

  selectRepository(repo: GithubRepository) {
    this.router.navigate(['/commit-list'], {
      queryParams: { ownerLogin: repo.owner.login, repositoryName: repo.name },
    });
  }
}
