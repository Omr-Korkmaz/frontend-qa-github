
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GithubUser, GithubRepository } from '../model/github.model'


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
  

    getRepositories(): Observable<GithubRepository> {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
      const url = `${this.baseUrl}/user/repos`;
      return this.http.get<GithubRepository>(url, { headers });
    }

    getCommits(owner: string, repo: string): Observable<any> {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
      const url = `${this.baseUrl}/repos/${owner}/${repo}/commits`;
      return this.http.get<any>(url, { headers });
    }

  getUserInfo(): Observable<GithubUser> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    const url = `${this.baseUrl}/user`;
    return this.http.get<GithubUser>(url, { headers });
  }
}
