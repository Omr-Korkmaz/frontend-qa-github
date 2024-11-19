import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TegelModule } from '@scania/tegel-angular-17';
import { NavigationMenuComponent } from './components/navigation-menu/navigation-menu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TegelModule, NavigationMenuComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {}
