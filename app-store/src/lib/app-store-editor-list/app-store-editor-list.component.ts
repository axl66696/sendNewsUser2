import { CheckboxModule } from 'primeng/checkbox';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { AppStoreEditorToolbarComponent } from '../app-store-editor-toolbar/app-store-editor-toolbar.component';
import { RouterLink } from '@angular/router';
import { AppStore } from '@his-viewmodel/app-store-editor';
import { AppStoreService } from '../app-store.service';
import { JSONCodec, Msg } from '@his-base/jetstream-ws';

@Component({
  selector: 'his-app-store-editor-list',
  standalone: true,
  imports: [CommonModule,
            TableModule,
            RadioButtonModule,
            FormsModule,
            DropdownModule,
            ButtonModule,
            CheckboxModule,
            AppStoreEditorToolbarComponent,
            RouterLink],
  templateUrl: './app-store-editor-list.component.html',
  styleUrls: ['./app-store-editor-list.component.scss'],
  providers: [AppStoreService]
})
export class AppStoreEditorListComponent implements OnInit {
  /** 應用程式清單
   * @type {AppStore[]}
   * @memberof AppStoreEditorListComponent
   */
  appStores: AppStore[] = [];

  #appStoreService = inject(AppStoreService);

  /** 查詢區塊標題
   * @type {string}
   * @memberof AppStoreEditorListComponent
   */
  condition: string = $localize`請選擇查詢條件： `;

  appStores$!: Msg;
  resultApps$?: Msg;

  /** 應用程式查詢結果清單
   * @type {AppStore[]}
   * @memberof AppStoreEditorListComponent
   */
  resultApps: AppStore[] = [];

  /** 查詢類別
   * @type {string}
   * @memberof AppStoreEditorListComponent
   */
  searchValue!: string;

  /** 頁面標題
   * @type {string[]}
   * @memberof AppStoreEditorListComponent
   */
  title!: string[];

  /** 應用程式類別清單
   * @type {string[]}
   * @memberof AppStoreEditorListComponent
   */
  typeOptions!: string[];

  async ngOnInit() {
    this.title = [$localize`網頁建檔系統`, $localize`應用程式` , $localize`應用程式清單`];
    this.typeOptions = ['行政', '醫療', '藥局']

    await this.getAppStores()
  }

  /** 用類別搜尋
   * @memberof AppStoreEditorListComponent
   */
  async onSearchClick() {
    if(!this.searchValue)
    {
      this.resultApps = [...this.appStores]
      return
    }
    this.resultApps$ = await this.#appStoreService.searchAppStore(this.searchValue)

    const jsonCodec = JSONCodec();
    this.resultApps = jsonCodec.decode(this.resultApps$.data) as AppStore[];

  }

  /** 讀取應用程式清單資料
   * @memberof AppStoreEditorListComponent
   */
  async getAppStores() {
    this.appStores$ = await this.#appStoreService.getAppStoreList();

    const jsonCodec = JSONCodec();
    this.appStores = jsonCodec.decode(this.appStores$.data) as AppStore[];
    this.resultApps = [...this.appStores]
  }
}
