
import { Routes } from '@angular/router';
import { AuthFormComponent } from './shared/components/auth-form/auth-form.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { CommitListPageComponent } from './pages/commit-list-page/commit-list-page.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'auth', component: AuthFormComponent },
  { path: 'dashboard', component: DashboardPageComponent, canActivate: [AuthGuard] },
  { path: 'commit-list', component: CommitListPageComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/auth' },
];
