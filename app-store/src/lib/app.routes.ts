import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./app-store-info/app-store-info.component')
    .then(m => m.AppStoreInfoComponent)
  },
  {
    path: 'list',
    loadComponent: () => import('./app-store-list/app-store-list.component')
    .then(m => m.AppStoreListComponent)
  },
  {
    path: 'list/:_id',
    loadComponent: () => import('./app-store-info/app-store-info.component')
    .then(m => m.AppStoreInfoComponent)
  }
];
