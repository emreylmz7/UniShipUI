import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export default [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/vehicle-list/vehicle-list.component')
          .then(m => m.VehicleListComponent)
      },
      {
        path: 'new',
        loadComponent: () => import('./pages/vehicle-form/vehicle-form.component')
          .then(m => m.VehicleFormComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./pages/vehicle-details/vehicle-details.component')
          .then(m => m.VehicleDetailsComponent)
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./pages/vehicle-form/vehicle-form.component')
          .then(m => m.VehicleFormComponent)
      }
    ]
  }
] as Routes; 