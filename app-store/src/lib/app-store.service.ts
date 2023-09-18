/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Injectable, inject } from '@angular/core';
import { AppStore } from '@his-viewmodel/app-store-editor';
import { JSONCodec, JetstreamWsService } from '@his-base/jetstream-ws';
import { lastValueFrom } from 'rxjs';
import { AppPage } from '@his-viewmodel/app-page-editor';

@Injectable({
  providedIn: 'root'
})
export class AppStoreService {
  #jetStreamWsService = inject(JetstreamWsService);

  #url = 'ws://10.251.42.37:8080';

  /** 建立連線
   * @memberof AppStoreService
   */
  async connect() {
    await this.#jetStreamWsService.connect(this.#url)
  }

  /** 清除連線
   * @memberof AppStoreService
   */
  async disconnect() {
    // 連線關閉前，會先將目前訂閱給排空
    await this.#jetStreamWsService.drain();
  }

  /** publish部分 對應有新增 刪除 修改
   * @param {AppStore} payload
   * @param {string} subject
   * @memberof AppStoreService
   */
  async pubAppStore(payload: AppStore, subject: string) {
    // @ts-ignore
    // 需帶入指定發布主題以及要傳送的訊息
    await this.#jetStreamWsService.publish(subject, payload);
  }

  /** 取得全部應用程式清單
   * @return {*}  {Promise<AppStore[]>}
   * @memberof AppStoreService
   */
  async getAppStoreList(): Promise<AppStore[]> {
    // @ts-ignore
    // 需帶入指定的主題跟要傳遞的資料
    const appStore$ = await lastValueFrom(this.#jetStreamWsService.request('appStore.list', ''));
    const jsonCodec = JSONCodec();

    return jsonCodec.decode(appStore$.data) as AppStore[]
  }

  /** 取得全部應用頁面清單
   * @return {*}  {Promise<AppPage[]>}
   * @memberof AppStoreService
   */
  async getAppPageList(): Promise<AppPage[]> {
    // @ts-ignore
    // 需帶入指定的主題跟要傳遞的資料
    const appPages$ =  await lastValueFrom(this.#jetStreamWsService.request('appPage.list', ''));
    const jsonCodec = JSONCodec();
    // 處理資料邏輯的地方，取得reply回傳的資料
    return jsonCodec.decode(appPages$.data) as AppPage[];
  }
}
