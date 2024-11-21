
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthGithubService } from '../../../services/auth-github.service';
import { UserService } from '../../../services/user.service';
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
  tokenPattern = /^ghp_[a-zA-Z0-9]{36}$/;
  constructor(
    private authGithubService: AuthGithubService,
    private userService: UserService,
    private router: Router
  ) {}

  authenticate() {
    console.log('Token:', this.token);
    if (!this.token.trim()) {
      this.errorMessage = 'Please enter a valid GitHub token.';
      return;
    }

    if (!this.tokenPattern.test(this.token.trim())) {
      this.errorMessage = 'Invalid token format. Ensure it is a 40-character hexadecimal string.';
      return;
    }

    this.errorMessage = '';
    this.authGithubService.setToken(this.token);

    this.authGithubService.getUserInfo().subscribe({
      next: (data) => {
        if (data && data.login) {
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
  }
}