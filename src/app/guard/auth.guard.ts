import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthGithubService } from '../services/auth-github.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authGithubService: AuthGithubService, private router: Router) {}

  canActivate(): boolean {
    if (this.authGithubService.hasToken()) {
      return true;
    } else {
      this.router.navigate(['/auth']);
      return false;
    }
  }
}
