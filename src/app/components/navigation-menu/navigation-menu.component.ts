import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../services/user.service';
import { GithubUser } from '../../model/github.model';
import { TegelModule } from '@scania/tegel-angular-17';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navigation-menu',
  standalone: true,
  imports: [TegelModule, FormsModule, CommonModule],
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.scss'],
})
export class NavigationMenuComponent implements OnInit, OnDestroy {
  userInfo: GithubUser | null = null;
  private subscription: Subscription = new Subscription();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
  
    this.subscription.add(
      this.userService.userInfo$.subscribe((userInfo) => {
        this.userInfo = userInfo; 
        console.log('Updated user info:', this.userInfo);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
