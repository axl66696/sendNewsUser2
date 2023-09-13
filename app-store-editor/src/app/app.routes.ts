import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('dist/app-store')
      .then(m => m.AppStoreEditorComponent),
    loadChildren: () => import('dist/app-store')
      .then(r => r.routes)
  }
];
