import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, forkJoin, map, mergeMap, Observable, of } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { GithubUser, GithubRepository, Commit } from '../model/github.model';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { DataCacheService } from './data-cache.service';


@Injectable({
  providedIn: 'root',
})
export class AuthGithubService {
  private baseUrl = 'https://api.github.com';
  private token: string | null = null;
  private cachedUserInfo: GithubUser | null = null;

  constructor(private http: HttpClient, private userService: UserService, private router: Router) {}

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('authToken');
    }
    return this.token;
  }

  hasToken(): boolean {
    return this.getToken() !== null;
  }

  clearToken(): void {
    this.token = null;
    this.cachedUserInfo = null;
    localStorage.removeItem('authToken');
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
  }

  getCommits(owner: string, repo: string): Observable<Commit[]> {
    const url = `${this.baseUrl}/repos/${owner}/${repo}/commits`;
    return this.http.get<Commit[]>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => this.handleCommitError(error))
    );
  }

  fetchAllCommits(owner: string, repo: string, page: number = 1): Observable<Commit[]> {
    const url = `${this.baseUrl}/repos/${owner}/${repo}/commits?page=${page}`;
    return this.http.get<Commit[]>(url, { headers: this.getHeaders() }).pipe(
      mergeMap((data) => {
        const linkHeader = this.extractLinkHeader(data);
        const nextPage = this.getNextPageLink(linkHeader);
        if (nextPage) {
          return this.fetchAllCommits(owner, repo, nextPage).pipe(
            map((nextData) => [...data, ...nextData])
          );
        } else {
          return of(data);
        }
      }),
      catchError((error) => this.handleCommitError(error))
    );
  }

  private extractLinkHeader(response: any): string | null {
    return response['Link'] || null;
  }

  private getNextPageLink(linkHeader: string | null): number | null {
    if (!linkHeader) return null;
    const match = linkHeader.match(/<[^>]*[?&]page=(\d+)>;\s*rel="next"/);
    return match ? parseInt(match[1], 10) : null;
  }

  getRepositories(): Observable<GithubRepository[]> {
    const url = `${this.baseUrl}/user/repos`;
    return this.http.get<GithubRepository[]>(url, { headers: this.getHeaders() }).pipe(
      catchError(() => of([] as GithubRepository[]))
    );
  }

  getLanguages(owner: string, repo: string): Observable<{ [key: string]: number }> {
    const url = `${this.baseUrl}/repos/${owner}/${repo}/languages`;
    return this.http.get<{ [key: string]: number }>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.warn(`Error fetching languages for ${repo}:`, error.message);
        return of({});
      })
    );
  }

  getTotalCommits(): Observable<number> {
    return this.getRepositories().pipe(
      mergeMap((repos: GithubRepository[]) =>
        forkJoin(repos.map((repo) => this.fetchAllCommits(repo.owner.login, repo.name)))
      ),
      map((commitArrays: Commit[][]) => commitArrays.flat().length),
      catchError(() => of(0))
    );
  }

  logout(): void {
    this.clearToken();
    this.userService.clearUserInfo();
    this.router.navigate(['/auth']);
  }

  getCommitsPerMonth(): Observable<{ [month: string]: number }> {
    return this.getRepositories().pipe(
      mergeMap((repos: GithubRepository[]) =>
        forkJoin(
          repos.map((repo) =>
            this.fetchAllCommits(repo.owner.login, repo.name).pipe(
              map((commits) => commits.map((commit) => new Date(commit.commit.author.date)))
            )
          )
        )
      ),
      map((allCommits: Date[][]) => {
        const monthlyData: { [month: string]: number } = {};
        allCommits.flat().forEach((date) => {
          const month = date.toLocaleString('default', { month: 'short' });
          monthlyData[month] = (monthlyData[month] || 0) + 1;
        });
        return monthlyData;
      }),
      catchError(() => of({}))
    );
  }

  getUserInfo(): Observable<GithubUser | null> {
    if (this.cachedUserInfo) {
      return of(this.cachedUserInfo);
    }
    const url = `${this.baseUrl}/user`;
    return this.http.get<GithubUser>(url, { headers: this.getHeaders() }).pipe(
      map((userInfo) => {
        this.cachedUserInfo = userInfo;
        return userInfo;
      }),
      catchError(() => {
        this.cachedUserInfo = null;
        return of(null);
      }),
      shareReplay(1)
    );
  }

  private handleCommitError(error: HttpErrorResponse): Observable<Commit[]> {
    if (error.status === 409) {
      return of([]);
    } else {
      return of([]);
    }
  }
}
