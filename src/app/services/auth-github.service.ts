
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GithubUser, GithubRepository } from '../model/github.model'


@Injectable({
  providedIn: 'root',
})
export class AuthGithubService {
  private baseUrl = 'https://api.github.com'; 

  constructor(private http: HttpClient) {}

  getRepositories(token: string): Observable<GithubRepository> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.baseUrl}/user/repos`;
    return this.http.get<GithubRepository>(url, { headers });
  }

  getCommits(token: string, owner: string, repo: string): Observable<GithubRepository> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.baseUrl}/repos/${owner}/${repo}/commits`;
    return this.http.get<GithubRepository>(url, { headers });
  }

  getUserInfo(token: string): Observable<GithubUser> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.baseUrl}/user`;
    return this.http.get<GithubUser>(url, { headers });
  }
}
