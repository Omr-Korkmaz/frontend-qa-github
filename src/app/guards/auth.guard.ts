import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthGithubService } from '../services/auth-github.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authGithubService: AuthGithubService, private router: Router) {}

  canActivate(): Observable<boolean> {
    if (!this.authGithubService.hasToken()) {
      this.redirectToLogin();
      return of(false);
    }

    return this.authGithubService.getUserInfo().pipe(
      map((user) => {
        if (user?.login) {
          return true;
        } else {
          this.redirectToLogin();
          return false;
        }
      }),
      catchError(() => {
        this.redirectToLogin();
        return of(false);
      })
    );
  }

  private redirectToLogin(): void {
    alert('You need to log in to access this page.');
    this.router.navigate(['/auth']);
  }
}
