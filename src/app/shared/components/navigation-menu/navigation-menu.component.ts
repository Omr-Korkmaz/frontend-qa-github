import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { TegelModule } from '@scania/tegel-angular-17';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GithubUser } from '../../../model/github.model'; 

@Component({
  selector: 'app-navigation-menu',
  standalone: true,
  imports: [RouterModule, TegelModule, FormsModule, CommonModule],
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.scss'],
})
export class NavigationMenuComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  userInfo: GithubUser | null = null
  private subscription = new Subscription();

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.subscription.add(
      this.userService.userInfo$.subscribe((userInfo) => {
        this.userInfo = userInfo;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
    this.closeMenu();
  }

  logIn(): void {
    this.router.navigate(['/auth']);
  }

  logOut(): void {
    this.userService.clearUserInfo();
    this.userInfo = null;
    this.router.navigate(['/auth']);
  }

  get isAuthenticated(): boolean {
    return !!this.userInfo;
  }
}
