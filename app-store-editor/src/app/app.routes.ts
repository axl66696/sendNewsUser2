import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('dist/app-store')
      .then(m => m.AppStoreComponent),
    loadChildren: () => import('dist/app-store')
      .then(r => r.routes)
  }
];
