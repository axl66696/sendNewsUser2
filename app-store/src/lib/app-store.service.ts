/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Injectable, inject } from '@angular/core';
import { AppStore } from '@his-viewmodel/app-store-editor';
import { JetstreamWsService, Msg } from '@his-base/jetstream-ws';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppStoreService {
  #jetStreamWsService = inject(JetstreamWsService);

  #url = 'ws://10.251.42.37:8080';

  /** 建立連線
   * @memberof AppStoreService
   */
  connect = async () => {
    await this.#jetStreamWsService.connect(this.#url)
  }

  /** 清除連線
   * @memberof AppStoreService
   */
  disconnect = async () => {
    // 連線關閉前，會先將目前訂閱給排空
    await this.#jetStreamWsService.drain();
  }

  /** publish部分 對應有新增 刪除 修改
   * @param {AppStore} payload
   * @param {string} subject
   * @memberof AppStoreService
   */
  pubAppStore = async (payload: AppStore, subject: string) => {
    // @ts-ignore
    // 需帶入指定發布主題以及要傳送的訊息
    await this.#jetStreamWsService.publish(subject, payload);
  }

  /** 取得全部應用程式清單
   * @memberof AppStoreService
   */
  getAppStoreList = async (): Promise<Msg> => {
    // @ts-ignore
    // 需帶入指定的主題跟要傳遞的資料
    return await lastValueFrom(this.#jetStreamWsService.request('appStore.list', ''));
  }

  /** 取得全部應用頁面清單
   * @memberof AppStoreService
   */
  getAppPageList = async (): Promise<Msg> => {
    // @ts-ignore
    // 需帶入指定的主題跟要傳遞的資料
    return await lastValueFrom(this.#jetStreamWsService.request('appPage.list',''));
  }

  /** 取得單一筆應用程式內容
   * @param {string} payload
   * @memberof AppStoreService
   */
  getAppStore = async (payload: string): Promise<Msg> => {
    // @ts-ignore
    // 需帶入指定的主題跟要傳遞的資料
    return await lastValueFrom(this.#jetStreamWsService.request('appStore.get', payload));
  }

  /** 搜尋類別取得應用程式清單
   * @param {string} payload
   * @memberof AppStoreService
   */
  searchAppStore = async (payload: string): Promise<Msg> => {
    // @ts-ignore
    // 需帶入指定的主題跟要傳遞的資料
    return await lastValueFrom(this.#jetStreamWsService.request('appStore.search', payload));
  }
}
