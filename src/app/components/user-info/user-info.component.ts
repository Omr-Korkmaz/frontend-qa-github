import { Component, Input } from '@angular/core';
import { GithubUser } from '../../model/github.model';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [CommonModule], 

  template: `
    <div *ngIf="userInfo">
      <h3>User Info</h3>
      <p><strong>Followers:</strong> {{ userInfo.followers }}</p>
      <p><strong>Following:</strong> {{ userInfo.following }}</p>
      <p><strong>Location:</strong> {{ userInfo.location || 'Not provided' }}</p>
    </div>
  `,
  styles: ['/* styles */']
})
export class UserInfoComponent {
  @Input() userInfo!: GithubUser;
}