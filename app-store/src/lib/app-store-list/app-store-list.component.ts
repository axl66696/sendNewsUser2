import { CheckboxModule } from 'primeng/checkbox';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { AppStoreToolbarComponent } from '../app-store-toolbar/app-store-toolbar.component';
import { RouterLink } from '@angular/router';
import { AppStore } from '@his-viewmodel/app-store-editor';
import { AppStoreService } from '../app-store.service';
import { JSONCodec, Msg } from '@his-base/jetstream-ws';
import * as typeData from '../../assets/data/type-text.json'

@Component({
  selector: 'his-app-store-list',
  standalone: true,
  imports: [CommonModule,
            TableModule,
            RadioButtonModule,
            FormsModule,
            DropdownModule,
            ButtonModule,
            CheckboxModule,
            AppStoreToolbarComponent,
            RouterLink],
  templateUrl: './app-store-list.component.html',
  styleUrls: ['./app-store-list.component.scss'],
  providers: [AppStoreService]
})
export class AppStoreListComponent implements OnInit, OnDestroy {
  /** 應用程式清單
   * @type {AppStore[]}
   * @memberof AppStoreListComponent
   */
  appStores: AppStore[] = [];

  /** 查詢區塊標題
   * @type {string}
   * @memberof AppStoreListComponent
   */
  condition: string = $localize`請選擇查詢條件： `;

  /** 接收replier內容
   * @type {Msg}
   * @memberof AppStoreListComponent
   */
  appStores$!: Msg;

  /** 查詢類別
   * @type {string}
   * @memberof AppStoreListComponent
   */
  searchValue!: string;

  /** 頁面標題
   * @type {string[]}
   * @memberof AppStoreListComponent
   */
  title!: string[];

  /** 應用程式類別清單
   * @type {string[]}
   * @memberof AppStoreListComponent
   */
  typeOptions!: string[];

  /** 儲存整筆應用程式資料
   * @type {AppStore[]}
   * @memberof AppStoreListComponent
   */
  #appStores: AppStore[] = [];

  #appStoreService = inject(AppStoreService);

  /** 初始化抓取資料及連線
   * @memberof AppStoreListComponent
   */
  async ngOnInit() {
    this.title = [$localize`網頁建檔系統`, $localize`應用程式` , $localize`應用程式清單`];
    this.typeOptions = Object.values(typeData)[0] as unknown as string[];

    await this.#appStoreService.connect()

    await this.getAppStoreList()
  }

  /** 清除連線
   * @memberof AppStoreListComponent
   */
  async ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    await this.#appStoreService.disconnect()
  }

  /** 用類別搜尋
   * @memberof AppStoreListComponent
   */
  async onSearchClick() {
    if(!this.searchValue)
    {
      this.appStores = [...this.#appStores]
      return
    }
    this.appStores = this.#appStores.filter(x => {
      return x.appType === this.searchValue
    })
  }

  /** 讀取應用程式清單資料
   * @memberof AppStoreListComponent
   */
  async getAppStoreList() {
    console.log("get")

    this.appStores$ = await this.#appStoreService.getAppStoreList()

    console.log("is get")
    const jsonCodec = JSONCodec();
    this.appStores = jsonCodec.decode(this.appStores$.data) as AppStore[];
    this.#appStores = [...this.appStores]
  }
}
