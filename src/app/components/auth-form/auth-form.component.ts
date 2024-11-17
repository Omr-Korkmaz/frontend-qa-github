
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthGithubService } from '../../services/auth-github.service';
import { UserService } from '../../services/user.service';
import { GithubUser } from '../../model/github.model';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [FormsModule, CommonModule], 
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

      this.authGithubService.getUserInfo(this.token).subscribe(
        (data: GithubUser) => {
          console.log("personel", data)
          this.userService.setUserInfo(data);
          this.router.navigate(['/dashboard'], {
            queryParams: { token: this.token },
          });
        },
        (error: any) => {
          this.errorMessage = 'Invalid GitHub token. Please try again.';
          console.error('Error fetching user info:', error);
        }
      );
    } else {
      this.errorMessage = 'Please enter a valid GitHub token.';
    }
  }
}
