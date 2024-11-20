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
      this.router.navigate(['/auth']);
      return of(false);
    }

    return this.authGithubService.getUserInfo().pipe(
      map((user) => {
        if (user && user.login) {
          return true;
        } else {
          this.router.navigate(['/auth']);
          return false;
        }
      }),
      catchError(() => {
        this.router.navigate(['/auth']);
        return of(false);
      })
    );
  }
}
