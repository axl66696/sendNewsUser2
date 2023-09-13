import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./app-store-editor-info/app-store-editor-info.component')
    .then(m => m.AppStoreEditorInfoComponent)
  },
  {
    path: 'list',
    loadComponent: () => import('./app-store-editor-list/app-store-editor-list.component')
    .then(m => m.AppStoreEditorListComponent)
  },
  {
    path: 'list/:_id',
    loadComponent: () => import('./app-store-editor-info/app-store-editor-info.component')
    .then(m => m.AppStoreEditorInfoComponent)
  }
];
