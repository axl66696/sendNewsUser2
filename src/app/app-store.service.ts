/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Injectable, inject } from '@angular/core';
import { AppStore } from '@his-viewmodel/app-store-editor';
import { JetstreamWsService, TransferInfo } from '@his-base/jetstream-ws';

@Injectable({
  providedIn: 'root'
})
export class AppStoreService {
  #jetStreamWsService = inject(JetstreamWsService);

  #url = 'ws://10.251.42.37:8080';

  async connect() {
    await this.#jetStreamWsService.connect(this.#url)
  }

  async disconnect() {
    // 連線關閉前，會先將目前訂閱給排空
    await this.#jetStreamWsService.drain();
  }

  async pubAppStore(payload: AppStore, subject: string) {
    const info: TransferInfo<AppStore> = {
      data: payload,
    };

    // @ts-ignore
    // 需帶入指定發布主題以及要傳送的訊息
    await this.#jetStreamWsService.publish(subject, info.data);
  }

  getAppStoreList() {
    const info: TransferInfo<string> = {
      data: '',
    };
    // @ts-ignore
    // 需帶入指定的主題跟要傳遞的資料
    return this.#jetStreamWsService.request('appStore.list',info.data);
  }

  getAppPageList() {
    const info: TransferInfo<string> = {
      data: '',
    };
    // @ts-ignore
    // 需帶入指定的主題跟要傳遞的資料
    return this.#jetStreamWsService.request('appPage.list',info.data);
  }

  getAppStore(payload: string) {
    const info: TransferInfo<string> = {
      data: payload,
    };
    // @ts-ignore
    // 需帶入指定的主題跟要傳遞的資料
    return this.#jetStreamWsService.request('appStore.get', info.data);
  }

  searchAppStore(payload: string) {
    const info: TransferInfo<string> = {
      data: payload,
    };
    // @ts-ignore
    // 需帶入指定的主題跟要傳遞的資料
    return this.#jetStreamWsService.request('appStore.search', info.data);
  }
}
