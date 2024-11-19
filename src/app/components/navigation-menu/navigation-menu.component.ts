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

// import { Component, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { UserService } from '../../services/user.service';
// import { GithubUser } from '../../model/github.model';
// import { TegelModule } from '@scania/tegel-angular-17';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { AuthGithubService } from '../../services/auth-github.service';
// import { Router } from '@angular/router';
//  import { Subscription } from 'rxjs';

// @Component({
//   selector: 'app-navigation-menu',
//   standalone: true,
//   imports: [TegelModule, FormsModule, CommonModule],
//   templateUrl: './navigation-menu.component.html',
//   styleUrls: ['./navigation-menu.component.scss'],
//   schemas: [CUSTOM_ELEMENTS_SCHEMA], // Allow web components like tds-side-menu-user

// })
// export class NavigationMenuComponent implements OnInit, OnDestroy {
//   userInfo: GithubUser | null = null;
//   private subscription: Subscription = new Subscription();

//   constructor(
//     private userService: UserService,
//     private authGithubService: AuthGithubService,
//     private router: Router
//   ) {}

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

//   logout(): void {
//     this.authGithubService.setToken(null); // Clear the token
//     this.userService.clearUserInfo(); // Clear user info
//     this.router.navigate(['/auth']); // Redirect to login page
//   }

//   login(): void {
//     this.router.navigate(['/auth']); // Redirect to login form
//   }

//   isAuthenticated(): boolean {
//     return this.authGithubService.hasToken(); // Check if the user is logged in
//   }
// }
