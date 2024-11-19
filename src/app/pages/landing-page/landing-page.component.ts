import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent {
  token = ''; 
  errorMessage = '';

  constructor(private router: Router) {}

  authenticate() {
    if (this.token) {
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage = 'Please enter a valid token.';
    }
  }
}
