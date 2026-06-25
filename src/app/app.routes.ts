import { Routes } from '@angular/router';
import { LoginComponent } from './shared/login/login';
import { Dashboard } from './layout/dashboard/dashboard';
import { LayoutComponent } from './components/home/home';
import { Companies } from './components/companies/companies';
import { CompanyReport } from './components/report/report';
import { VerifyComponent } from './components/verify-component/verify-component';
import { authGuard } from './auth-gaurd/gaurd-guard';
import { OverviewDashboard } from './components/overview-dashboard/overview-dashboard';

export const routes: Routes = [

  // ✅ Public routes — no auth required
  { path: 'login',  component: LoginComponent },
  { path: 'verify', component: VerifyComponent },
  { path: 'overview', component: OverviewDashboard },

  // ✅ Protected routes — auth required
  // LayoutComponent is the SHELL (sidebar + header visible on ALL children)
  {
    path: 'dashboard',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '',           component: Dashboard },       // /dashboard → Overview
      { path: 'companies',  component: Companies },       // /dashboard/companies → Companies list
      { path: 'report/:id', component: CompanyReport }   // /dashboard/report/123 → Company details
    ]
  },

  // Default + wildcard
  { path: '',   redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },

  // { path: 'overview', component: OverviewDashboard }
];