// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { catchError, forkJoin, map, mergeMap, Observable, of } from 'rxjs';
// import { GithubUser, GithubRepository, Commit } from '../model/github.model'; // Use Commit type here.

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthGithubService {
//   private baseUrl = 'https://api.github.com'; 
//   private token: string | null = null;  

//   constructor(private http: HttpClient) {}

//   setToken(token: string): void {
//     this.token = token;
//   }

//   getToken(): string | null {
//     return this.token;
//   }

//   hasToken(): boolean {
//     return this.token !== null;
//   }

//   // Returns commits for a specific repository
//   getCommits(owner: string, repo: string): Observable<Commit[]> {
//     const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
//     const url = `${this.baseUrl}/repos/${owner}/${repo}/commits`;
//     return this.http.get<Commit[]>(url, { headers }).pipe(
//       catchError((error) => {
//         console.error('Error fetching commits:', error);
//         return of([] as Commit[]); // Return empty commit list on error
//       })
//     );
//   }

//   fetchAllCommits(owner: string, repo: string, page: number = 1): Observable<Commit[]> {
//     const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
//     const url = `${this.baseUrl}/repos/${owner}/${repo}/commits?page=${page}`;

//     return this.http.get<Commit[]>(url, { headers }).pipe(
//       mergeMap((data: Commit[]) => {
//         const linkHeader = this.extractLinkHeader(data);
//         const nextPage = this.getNextPageLink(linkHeader);

//         if (nextPage) {
//           return this.fetchAllCommits(owner, repo, nextPage).pipe(
//             map((nextData) => [...data, ...nextData]) 
//           );
//         } else {
//           return of(data);
//         }
//       }),
//       catchError((error) => {
//         console.error('Error fetching all commits:', error);
//         return of([] as Commit[]); 
//       })
//     );
//   }

//   private extractLinkHeader(data: any): string | null {

//     return data['Link'] || null;
//   }

//   private getNextPageLink(linkHeader: string | null): number | null {
//     if (!linkHeader) return null;
//     const match = linkHeader.match(/rel="next".*?page=(\d+)/);
//     return match ? parseInt(match[1], 10) : null;
//   }

//   getRepositories(): Observable<GithubRepository[]> {
//     const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
//     const url = `${this.baseUrl}/user/repos`;
//     return this.http.get<GithubRepository[]>(url, { headers }).pipe(
//       catchError((error) => {
//         console.error('Error fetching repositories:', error);
//         return of([] as GithubRepository[]);
//       })
//     );
//   }

//   getLanguages(owner: string, repo: string): Observable<{ [key: string]: number }> {
//     const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
//     const url = `${this.baseUrl}/repos/${owner}/${repo}/languages`;
//     return this.http.get<{ [key: string]: number }>(url, { headers }).pipe(
//       catchError((error) => {
//         console.error(`Error fetching languages for ${repo}:`, error);
//         return of({});
//       })
//     );
//   }

//   getTotalCommits(): Observable<number> {
//     return this.getRepositories().pipe(
//       mergeMap((repos: GithubRepository[]) =>
//         forkJoin(repos.map((repo) => this.fetchAllCommits(repo.owner.login, repo.name)))
//       ),
//       map((commitArrays: Commit[][]) => commitArrays.flat().length),
//       catchError((error) => {
//         console.error('Error fetching total commits:', error);
//         return of(0); 
//       })
//     );
//   }

//   getCommitsPerMonth(): Observable<{ [month: string]: number }> {
//     return this.getRepositories().pipe(
//       mergeMap((repos: GithubRepository[]) =>
//         forkJoin(repos.map((repo) =>
//           this.fetchAllCommits(repo.owner.login, repo.name).pipe(
//             map((commits: Commit[]) =>
//               commits.map((commit) => new Date(commit.commit.author.date))
//             )
//           )
//         ))
//       ),
//       map((allCommits: Date[][]) => {
//         const monthlyData: { [month: string]: number } = {};
//         allCommits.flat().forEach((date: Date) => {
//           const month = date.toLocaleString('default', { month: 'short' });
//           monthlyData[month] = (monthlyData[month] || 0) + 1;
//         });
//         return monthlyData;
//       }),
//       catchError((error) => {
//         console.error('Error calculating commits per month:', error);
//         return of({});
//       })
//     );
//   }

//   getUserInfo(): Observable<GithubUser> {
//     const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
//     const url = `${this.baseUrl}/user`;
//     return this.http.get<GithubUser>(url, { headers }).pipe(
//       catchError((error) => {
//         console.error('Error fetching user info:', error);
//         return of({} as GithubUser);
//       })
//     );
//   }
// }


import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, forkJoin, map, mergeMap, Observable, of } from 'rxjs';
import { GithubUser, GithubRepository, Commit } from '../model/github.model';

@Injectable({
  providedIn: 'root',
})
export class AuthGithubService {
  private baseUrl = 'https://api.github.com';
  private token: string | null = null;

  constructor(private http: HttpClient) {}

  setToken(token: string): void {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  hasToken(): boolean {
    return this.token !== null;
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
  }

  // Fetches commits for a specific repository
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
      catchError((error) => {
        console.error('Error fetching repositories:', error);
        return of([] as GithubRepository[]);
      })
    );
  }

  getLanguages(owner: string, repo: string): Observable<{ [key: string]: number }> {
    const url = `${this.baseUrl}/repos/${owner}/${repo}/languages`;
    return this.http.get<{ [key: string]: number }>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error(`Error fetching languages for ${repo}:`, error);
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
      catchError((error) => {
        console.error('Error fetching total commits:', error);
        return of(0);
      })
    );
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
      catchError((error) => {
        console.error('Error calculating commits per month:', error);
        return of({});
      })
    );
  }

  getUserInfo(): Observable<GithubUser> {
    const url = `${this.baseUrl}/user`;
    return this.http.get<GithubUser>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('Error fetching user info:', error);
        return of({} as GithubUser);
      })
    );
  }

  private handleCommitError(error: HttpErrorResponse): Observable<Commit[]> {
    if (error.status === 409) {
      console.warn('Conflict: The repository might be empty or unavailable.');
      return of([]); 
    } else {
      console.error('Error fetching commits:', error);
      return of([]); 
    }
  }
}
