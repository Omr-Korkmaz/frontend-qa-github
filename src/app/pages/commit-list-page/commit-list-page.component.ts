import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthGithubService } from '../../services/auth-github.service';
import { Commit } from '../../model/github.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-commit-list-page',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './commit-list-page.component.html',
  styleUrls: ['./commit-list-page.component.scss'],
})
export class CommitListPageComponent implements OnInit {
  commits: Commit[] = [];
  repositoryName: string = '';
  ownerLogin: string = '';
  errorMessage: string = '';

  constructor(
    private authGithubService: AuthGithubService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.ownerLogin = params['ownerLogin'];
      this.repositoryName = params['repositoryName'];
      this.getCommits();
    });
  }

  getCommits(): void {
    const token = this.authGithubService.getToken(); 

    if (!token) {
      this.errorMessage = 'You need to authenticate first.';
      console.error('Error: Token is missing');
      return;
    }

    this.authGithubService.getCommits(this.ownerLogin, this.repositoryName).subscribe(
      (data: any) => {
        this.commits = data.map((commit: any) => ({
          sha: commit.sha,
          committer: {
            name: commit.committer ? commit.committer.name : 'Unknown', 
            avatar_url: commit.committer ? commit.committer.avatar_url : '', 
            html_url: commit.committer ? commit.committer.html_url : '', 
          },
          commit: {
            message: commit.commit.message,
            date: commit.commit.author.date, 
          },
          html_url: commit.html_url,
        }));
      },
      (error: any) => {
        this.errorMessage = 'Error fetching commits. Please try again.';
        console.error('Error fetching commits:', error);
      }
    );
  }
}
