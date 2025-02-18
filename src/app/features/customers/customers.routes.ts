import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export default [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/customer-list/customer-list.component')
          .then(m => m.CustomerListComponent)
      },
      {
        path: 'new',
        loadComponent: () => import('./pages/customer-form/customer-form.component')
          .then(m => m.CustomerFormComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./pages/customer-details/customer-details.component')
          .then(m => m.CustomerDetailsComponent)
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./pages/customer-form/customer-form.component')
          .then(m => m.CustomerFormComponent)
      }
    ]
  }
] as Routes; 