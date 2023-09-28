import '@angular/localize/init';
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AppStoreInfoComponent } from './app-store-info/app-store-info.component';
import { AppStoreListComponent } from './app-store-list/app-store-list.component';
import { AppStoreToolbarComponent } from './app-store-toolbar/app-store-toolbar.component';
import { AppStoreService } from './app-store.service';
import { HeaderComponent } from '@his-directive/header/dist/header';

@Component({
  selector: 'his-app-store',
  standalone: true,
  imports: [CommonModule,
            RouterOutlet,
            AppStoreInfoComponent,
            AppStoreListComponent,
            AppStoreToolbarComponent,
            HeaderComponent],
  templateUrl: './app-store.component.html',
  styleUrls: ['./app-store.component.scss']
})
export class AppStoreComponent implements OnInit, OnDestroy {
  /** header的輸入框提示
   * @type {string}
   * @memberof AppStoreComponent
   */
  headerHolder: string = $localize`請輸入頁面標題`;

  /** header的詳細資料視窗標題
   * @type {string}
   * @memberof AppStoreComponent
   */
  detailTitle: string = $localize`詳細資料`;

  #appStoreService: AppStoreService = inject(AppStoreService);

  /** 初始化設定 連線NATS及websocket
   * @memberof AppStoreComponent
   */
  async ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    await this.#appStoreService.connect()
    this.#appStoreService.getTokenAlert()
  }

  /** 清除連線
   * @memberof AppStoreComponent
   */
  async ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    await this.#appStoreService.disconnect();
  }
}
