
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
  imports: [FormsModule, CommonModule, TegelModule],
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
    if (this.token.trim()) {
      this.errorMessage = '';
      this.authGithubService.setToken(this.token);
  
      this.authGithubService.getUserInfo().subscribe({
        next: (data) => {
          if (data && data.login) { // Check if valid data is returned
            this.userService.setUserInfo(data);
            this.router.navigate(['/dashboard'], {
              queryParams: { token: this.token },
            });
          } else {
            this.errorMessage = 'Invalid GitHub token. Please try again.';
          }
        },
        error: () => {
          this.errorMessage = 'Invalid GitHub token. Please try again.';
        },
      });
    } else {
      this.errorMessage = 'Please enter a valid GitHub token.';
    }
  }
  
  
}
