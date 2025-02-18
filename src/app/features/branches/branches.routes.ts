import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export default [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/branch-list/branch-list.component')
          .then(m => m.BranchListComponent)
      },
      {
        path: 'new',
        loadComponent: () => import('./pages/branch-form/branch-form.component')
          .then(m => m.BranchFormComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./pages/branch-details/branch-details.component')
          .then(m => m.BranchDetailsComponent)
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./pages/branch-form/branch-form.component')
          .then(m => m.BranchFormComponent)
      }
    ]
  }
] as Routes; 