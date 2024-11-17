import { Injectable } from '@angular/core';
import { GithubUser } from '../model/github.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userInfo: GithubUser | null = null;

  constructor() {}

  setUserInfo(user: GithubUser): void {
    this.userInfo = user;
  }

  getUserInfo(): GithubUser | null {
    return this.userInfo;
  }

  clearUserInfo(): void {
    this.userInfo = null;
  }
}
