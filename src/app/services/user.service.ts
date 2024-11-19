import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GithubUser } from '../model/github.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userInfoSubject: BehaviorSubject<GithubUser | null> = new BehaviorSubject<GithubUser | null>(null);
  userInfo$: Observable<GithubUser | null> = this.userInfoSubject.asObservable();

  constructor() {}
  setUserInfo(user: GithubUser): void {
    this.userInfoSubject.next(user); 
  }

  getUserInfo(): GithubUser | null {
    return this.userInfoSubject.getValue(); 
  }

  clearUserInfo(): void {
    this.userInfoSubject.next(null); 
  }

}