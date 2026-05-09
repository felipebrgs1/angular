import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    children: [
      {
        path: 'purchases',
        loadComponent: () => import('./purchases/purchases.component').then(m => m.PurchasesComponent),
      },
      {
        path: 'seller/products',
        loadComponent: () => import('./seller-products/seller-products.component').then(m => m.SellerProductsComponent),
      },
      {
        path: 'seller/sales',
        loadComponent: () => import('./seller-sales/seller-sales.component').then(m => m.SellerSalesComponent),
      },
      { path: '**', redirectTo: 'purchases' },
    ],
  },
];
