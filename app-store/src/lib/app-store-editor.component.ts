import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AppStoreEditorInfoComponent } from './app-store-editor-info/app-store-editor-info.component';
import { AppStoreEditorListComponent } from './app-store-editor-list/app-store-editor-list.component';
import { AppStoreEditorToolbarComponent } from './app-store-editor-toolbar/app-store-editor-toolbar.component';
import { AppStoreService } from './app-store.service';
import { HeaderComponent } from '@his-directive/header/dist/header'

@Component({
  selector: 'his-app-store-editor',
  standalone: true,
  imports: [CommonModule,
            RouterOutlet,
            AppStoreEditorInfoComponent,
            AppStoreEditorListComponent,
            AppStoreEditorToolbarComponent,
            HeaderComponent],
  templateUrl: './app-store-editor.component.html',
  styleUrls: ['./app-store-editor.component.scss']
})
export class AppStoreEditorComponent implements OnInit, OnDestroy {

  #appStoreService: AppStoreService = inject(AppStoreService);

  /** 初始化設定 連線NATS及websocket
   * @memberof AppStoreEditorComponent
   */
  async ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    await this.#appStoreService.connect();
  }

  /** 清除連線
   * @memberof AppStoreEditorComponent
   */
  async ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    await this.#appStoreService.disconnect();
  }
}
