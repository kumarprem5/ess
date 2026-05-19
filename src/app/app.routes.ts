import { Routes } from '@angular/router';
import { LoginComponent } from './shared/login/login';
import { Dashboard } from './layout/dashboard/dashboard';
import { LayoutComponent } from './components/home/home';
import { Companies } from './components/companies/companies';
import { CompanyReport } from './components/report/report';
import { VerifyComponent } from './components/verify-component/verify-component';

export const routes: Routes = [

 { path: 'verify', component: VerifyComponent },


  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: LoginComponent
  },


  {
    path: 'dashboard',
    component: Dashboard,
    children: [
      {
        path: '',
        component: LayoutComponent
      },
      {
        path: 'companies',
        component: Companies
      },{
         path: 'report/:id',
        component: CompanyReport
      }
    ]
  },

  {
    path: '**',
    redirectTo: 'login'
  },

  // { path: 'verify', loadComponent: () => import('..../verify-component').then(m => m.VerifyComponent) }

];