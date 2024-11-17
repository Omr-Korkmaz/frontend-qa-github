
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthGithubService } from '../../services/auth-github.service';
import { UserService } from '../../services/user.service';
import { GithubUser, GithubRepository } from '../../model/github.model';
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
  repositories: GithubRepository[] = [];
  commits: any[] = [];
  selectedRepo: GithubRepository | null = null;
  userInfo: GithubUser | null = null;
  errorMessage: string = '';

  constructor(
    private authGithubService: AuthGithubService, 
    private userService: UserService,
    private route: ActivatedRoute 
  ) {}

  // ngOnInit(): void {
  //   this.route.queryParams.subscribe((params) => {
  //     this.token = params['token'];

  //     if (this.token) {
  //       this.getRepositories(); 
  //     }
  //   });
  // }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];

      if (this.token) {
        this.getRepositories();
        this.userInfo = this.userService.getUserInfo();
        if (!this.userInfo) {
          this.errorMessage = 'User info not found. Please log in again.';
        }
      }
    });
  }

  getRepositories() {
    this.authGithubService.getRepositories(this.token).subscribe(
      (data: any) => {
        this.repositories = data;
        console.log("repo", data)
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
