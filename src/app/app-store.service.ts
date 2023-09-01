import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppStore } from '@his-viewmodel/app-store-editor';
import { catchError, throwError } from 'rxjs';
import { JetstreamWsService, RetentionPolicy, TransferInfo } from '@his-base/jetstream-ws';
import { AckPolicy, DeliverPolicy, JetstreamMangerService, NatsConsumerConfig } from '@his-base/jetstream-manager';

@Injectable({
  providedIn: 'root'
})
export class AppStoreService {

  streamOptions = [
    {
      name: 'OPD',
      subjects: ['appStore.>','appPage.>'],
      retention: RetentionPolicy.Interest,
    },
  ];
  consumerOptions: NatsConsumerConfig[] = [
    {
      // 持久化消費者名稱
      durable_name: 'appStore',
      // 確認機制，每一條都要確認
      ack_policy: AckPolicy.Explicit,
      // 限定只消費的主題
      filter_subject: 'appStore.>',
      // 從stream最後一筆資料進行拉取消費
      deliver_policy: DeliverPolicy.Last,
      // 沒有回傳ack，需等待5秒再次回傳訊息（單位 ns）
      ack_wait: 5000000000,
    }
  ];

  #jetStreamWsService = inject(JetstreamWsService);
  #jetstreamMangerService = new JetstreamMangerService(this.streamOptions,this.consumerOptions)

  #url = 'ws://localhost:8080';

  async connect() {
    await this.#jetStreamWsService.connect(this.#url)
    await this.#jetstreamMangerService.connect(this.#url);

    await this.#jetstreamMangerService.createStream();
    await this.#jetstreamMangerService.createConsumer('appStore');
  }

  async disconnect() {
    // 連線關閉前，會先將目前訂閱給排空
    await this.#jetstreamMangerService.drain();
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
