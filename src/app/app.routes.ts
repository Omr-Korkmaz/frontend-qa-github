import { Routes } from '@angular/router';
import { AuthFormComponent } from './components/auth-form/auth-form.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { CommitListPageComponent } from './pages/commit-list-page/commit-list-page.component';


export const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: 'auth', component: AuthFormComponent },
  { path: 'dashboard', component: DashboardPageComponent },
  { path: 'commit-list', component: CommitListPageComponent },

];

