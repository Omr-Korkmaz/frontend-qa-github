

// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { UserService } from '../../services/user.service';
// import { GithubUser } from '../../model/github.model';
// import { Router } from '@angular/router';
// import { TegelModule } from '@scania/tegel-angular-17';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { Subscription } from 'rxjs';

// @Component({
//   selector: 'app-navigation-menu',
//   standalone: true,
//   imports: [TegelModule, FormsModule, CommonModule],
//   templateUrl: './navigation-menu.component.html',
//   styleUrls: ['./navigation-menu.component.scss'],
// })
// export class NavigationMenuComponent implements OnInit, OnDestroy {
//   userInfo: GithubUser | null = null;
//   isMenuOpen = false; // Side menu state
//   private subscription: Subscription = new Subscription();

//   constructor(private userService: UserService, private router: Router) {}

//   ngOnInit(): void {
//     this.subscription.add(
//       this.userService.userInfo$.subscribe((userInfo) => {
//         this.userInfo = userInfo;
//       })
//     );
//   }

//   ngOnDestroy(): void {
//     this.subscription.unsubscribe();
//   }

//   toggleMenu(): void {
//     this.isMenuOpen = !this.isMenuOpen;
//   }

//   closeMenu(): void {
//     this.isMenuOpen = false;
//   }

//   logIn(): void {
//     this.router.navigate(['/auth']); // Navigate to the login page
//   }

//   logOut(): void {
//     this.userService.clearUserInfo(); // Clear user info
//     this.userInfo = null; // Set the user as logged out
//     this.router.navigate(['/auth']); // Redirect to login page
//   }

//   get isAuthenticated(): boolean {
//     return !!this.userInfo; // Check if the user is authenticated
//   }
// }



import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TegelModule } from '@scania/tegel-angular-17';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navigation-menu',
  standalone: true,
  imports: [TegelModule, FormsModule, CommonModule],
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.scss'],
})
export class NavigationMenuComponent implements OnInit, OnDestroy {
  isMenuOpen = false; // Side menu state

  userInfo: any = null; // User info
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
    if ((route === 'dashboard' || route === 'commit-list') && !this.isAuthenticated) {
      this.router.navigate(['/auth']); // Redirect to Auth if unauthenticated
      return;
    }
    this.router.navigate([`/${route}`]);
    this.closeMenu(); // Close menu after navigation
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
