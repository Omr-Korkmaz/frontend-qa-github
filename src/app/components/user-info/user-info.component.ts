import { Component, Input } from '@angular/core';
import { GithubUser } from '../../model/github.model';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './user-info.component.html', 
  styleUrls: ['./user-info.component.scss'] 
})
export class UserInfoComponent {
  @Input() userInfo!: GithubUser;
}