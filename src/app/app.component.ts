import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AppStoreEditorInfoComponent } from './app-store-editor-info/app-store-editor-info.component';
import { AppStoreEditorListComponent } from './app-store-editor-list/app-store-editor-list.component';
import { AppStoreEditorToolbarComponent } from './app-store-editor-toolbar/app-store-editor-toolbar.component';
import { AppStoreService } from './app-store.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,
            RouterOutlet,
            AppStoreEditorInfoComponent,
            AppStoreEditorListComponent,
            AppStoreEditorToolbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app-store-editor';

  #appStoreService: AppStoreService = inject(AppStoreService);

  async ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    await this.#appStoreService.connect();
  }

  async ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    await this.#appStoreService.disconnect();
  }
}
