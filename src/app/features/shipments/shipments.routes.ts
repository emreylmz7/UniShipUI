import { Routes } from '@angular/router';

export const SHIPMENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/shipment-list/shipment-list.component')
      .then(m => m.ShipmentListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/shipment-form/shipment-form.component')
      .then(m => m.ShipmentFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/shipment-details/shipment-details.component')
      .then(m => m.ShipmentDetailsComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/shipment-form/shipment-form.component')
      .then(m => m.ShipmentFormComponent)
  }
]; 