
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthGithubService } from '../../services/auth-github.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [FormsModule, CommonModule ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent implements OnInit {
  token: string = ''; 
  repositories: any[] = [];
  commits: any[] = [];
  selectedRepo: any = null;

  constructor(
    private authGithubService: AuthGithubService, 
    private route: ActivatedRoute 
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];

      if (this.token) {
        this.getRepositories(); 
      }
    });
  }

  getRepositories() {
    this.authGithubService.getRepositories(this.token).subscribe(
      (data: any) => {
        this.repositories = data;
      },
      (error: any) => {
        console.error('Error fetching repositories:', error);
      }
    );
  }

  getCommits(owner: string, repo: string) {
    this.authGithubService.getCommits(this.token, owner, repo).subscribe(
      (data: any) => {
        this.commits = data;
      },
      (error: any) => {
        console.error('Error fetching commits:', error);
      }
    );
  }

  selectRepository(repo: any) {
    this.selectedRepo = repo;
    this.getCommits(repo.owner.login, repo.name);
  }
}
