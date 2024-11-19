import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthGithubService } from '../../services/auth-github.service';
import { UserService } from '../../services/user.service';
import { GithubUser } from '../../model/github.model';
import { TegelModule } from '@scania/tegel-angular-17';


@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [FormsModule, CommonModule,TegelModule], 
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
})
export class AuthFormComponent {
  token = ''; 
  errorMessage = ''; 

  constructor(
    private authGithubService: AuthGithubService, 
    private userService: UserService,
    private router: Router 
  ) {}

  authenticate() {
    if (this.token) {
      this.errorMessage = '';
      this.authGithubService.setToken(this.token);

      this.authGithubService.getUserInfo().subscribe({
        next: (data: GithubUser) => { 
          console.log("Fetched User Data:", data);
          this.userService.setUserInfo(data);
          this.router.navigate(['/dashboard'], {
            queryParams: { token: this.token },
          });
        },
        error: (error: { message: string; status: number }) => { 
          this.errorMessage = 'Invalid GitHub token. Please try again.';
          console.error('Error fetching user info:', error);
        }
      });
    } else {
      this.errorMessage = 'Please enter a valid GitHub token.';
    }
  }
}