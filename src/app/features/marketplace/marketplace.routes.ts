import { Routes } from '@angular/router';

export const marketplaceRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/list.component').then(m => m.ListComponent),
  },
  {
    path: ':id',
    loadComponent: () => import('./detail/detail.component').then(m => m.DetailComponent),
  },
];
