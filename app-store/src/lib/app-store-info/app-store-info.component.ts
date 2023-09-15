/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { DialogModule } from 'primeng/dialog';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from "primeng/inputtext";
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { AppStoreToolbarComponent } from '../app-store-toolbar/app-store-toolbar.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AppStore } from '@his-viewmodel/app-store-editor';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { AppPage } from '@his-viewmodel/app-page-editor';
import { AppStoreService } from '../app-store.service';
import { RadioButtonModule } from 'primeng/radiobutton';
import { AddPagesListComponent } from './add-pages-list/add-pages-list.component';
import { JSONCodec, Msg } from '@his-base/jetstream-ws';
import { ColorType } from './color-type';
import { ImageModule } from 'primeng/image';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from 'primeng/dragdrop';
import { $localize } from '@angular/localize/init';
import * as iconData from '../../assets/data/material-icon.json';
import * as typeData from '../../assets/data/type.json'

@Component({
  selector: 'his-app-store-info',
  standalone: true,
  imports: [CommonModule,
            InputTextModule,
            CalendarModule,
            FormsModule,
            DialogModule,
            AppStoreToolbarComponent,
            RouterLink,
            DropdownModule,
            CheckboxModule,
            TableModule,
            RadioButtonModule,
            AddPagesListComponent,
            ImageModule,
            MatIconModule,
            DragDropModule],
  templateUrl: './app-store-info.component.html',
  styleUrls: ['./app-store-info.component.scss']
})
export class AppStoreInfoComponent implements OnInit, OnDestroy {
  /** 要顯示的應用程式_id
   * @type {string}
   * @memberof AppStoreInfoComponent
   */
  @Input() _id!: string;

  /** 顯示的圖標樣式
   * @type {string}
   * @memberof AppStoreInfoComponent
   */
  showIconStyle: string = '';

  /** 可選擇的圖標清單
   * @type {string[]}
   * @memberof AppStoreInfoComponent
   */
  iconList: string[] = [];

  /** 圖標選擇視窗顯示
   * @type {boolean}
   * @memberof AppStoreInfoComponent
   */
  isIconVisible: boolean = false;

  /** 所含應用頁面編輯視窗顯示
   * @type {boolean}
   * @memberof AppStoreInfoComponent
   */
  isTableVisible: boolean = false;

  /** 應用程式原始內容
   * @type {AppStore}
   * @memberof AppStoreInfoComponent
   */
  appStore!: AppStore;

  /** 接收replier訊息
   * @type {Msg}
   * @memberof AppStoreInfoComponent
   */
  appStore$!: Msg;

  /** 應用程式所擁有頁面
   * @type {AppPage[]}
   * @memberof AppStoreInfoComponent
   */
  appPages: AppPage[] = []

  /** 暫存修改應用程式內容
   * @type {AppStore}
   * @memberof AppStoreInfoComponent
   */
  editableApp!: AppStore;

  /** 應用程式預覽標題
   * @type {string}
   * @memberof AppStoreInfoComponent
   */
  previewTitle!: string;

  /** 刪除視窗顯示
   * @type {boolean}
   * @memberof AppStoreInfoComponent
   */
  isDeleteVisible: boolean = false;

  /** 類別及對應圖標顏色清單
   * @type {ColorType[]}
   * @memberof AppStoreInfoComponent
   */
  typeOptions!: ColorType[]

  /** 應用程式語言種類
   * @type {string[]}
   * @memberof AppStoreInfoComponent
   */
  languageOptions!: string[];

  /** Breadcrumb標題
   * @type {string[]}
   * @memberof AppStoreInfoComponent
   */
  title!: string[];

  /** 設定應用程式類別及圖標顏色
   * @type {ColorType}
   * @memberof AppStoreInfoComponent
   */
  appType!: ColorType;

  draggedPage: AppPage | undefined | null;

  pageIndex!: number;

  #appStoresService = inject(AppStoreService);
  router = inject(Router);
  route = inject(ActivatedRoute)

  /** 初始化設定 讀取應用程式內容
   * @memberof AppStoreInfoComponent
   */
  async ngOnInit() {
    this.iconList = Object.values(iconData)[0] as unknown as string[]

    this.typeOptions = Object.values(typeData)[0] as unknown as ColorType[]

    this.languageOptions = ['Angular16']

    this.appType = new ColorType({
      type: '門診',
      colorClass: 'icon-clinic',
      showColor: 'background: linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.00) 100%), var(--indigo-500)'
    })

    this.previewTitle = $localize`應用程式標題`;
    await this.#appStoresService.connect();

    if(this._id) {
      await this.getAppStore();

      this.title = [$localize`網頁建檔系統`, $localize`應用程式`, $localize`應用程式內容`]
    }
    else {
      this.appStore = new AppStore({appType: '門診'});
      this.editableApp = Object.assign({}, this.appStore);
      this.appStore.appIcon = 'help_clinic';
      this.editableApp.appIcon = this.appStore.appIcon
      this.showIconStyle = this.editableApp.appIcon;
      this.appPages = [...this.appStore.appPages];

      this.title = [$localize`網頁建檔系統`, $localize`應用程式`, $localize`新增應用程式`]
    }
  }

  /** 清除連線
   * @memberof AppStoreInfoComponent
   */
  async ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    await this.#appStoresService.disconnect()
  }

  /** 顯示選擇圖標視窗
   * @memberof AppStoreInfoComponent
   */
  onDialog() {
    this.isIconVisible = true;
  }

  /** 點選圖標預覽
   * @param {string} icon
   * @memberof AppStoreInfoComponent
   */
  onSelectIcon(icon: string) {
    this.showIconStyle = icon;
  }

  /** 取消並復原選擇圖標
   * @memberof AppStoreInfoComponent
   */
  onCancelSelect() {
    this.isIconVisible = false;
    this.showIconStyle = this.editableApp.appIcon;
  }

  /** 確認圖標選擇
   * @memberof AppStoreInfoComponent
   */
  onConfirmIcon() {
    this.isIconVisible = false;
    this.editableApp.appIcon = this.showIconStyle;
  }

  /** 復原編輯或清除內容
   * @memberof AppStoreInfoComponent
   */
  onClearClick() {
    const currentType = this.typeOptions.find(x => {
      return x.type === this.appStore.appType
    })
    this.appType = Object.assign({}, currentType);
    this.editableApp.appTitle = this.appStore.appTitle;
    this.editableApp.versionNo = this.appStore.versionNo;
    this.showIconStyle = this.appStore.appIcon;
    this.editableApp.appIcon = this.appStore.appIcon;
    this.appPages = [...this.appStore.appPages]
  }

  /** 開啟頁面編輯視窗
   * @memberof AppStoreInfoComponent
   */
  onModifyClick() {
    this.isTableVisible = true
  }

  /** 取消頁面編輯
   * @memberof AppStoreInfoComponent
   */
  onCancelModify() {
    this.isTableVisible = false;
  }

  /** 套用頁面編輯
   * @param {AppPage[]} appPages
   * @memberof AppStoreInfoComponent
   */
  onApplyModify(appPages: AppPage[]) {
    this.isTableVisible = false;
    this.appPages = [...appPages];
  }

  /** 移除指定頁面
   * @param {AppPage} appPage
   * @memberof AppStoreInfoComponent
   */
  onRemoveClick(appPage: AppPage) {
    this.appPages = this.appPages?.filter((v) => v._id !== appPage._id)
  }

  /** 開啟刪除應用程式視窗
   * @memberof AppStoreInfoComponent
   */
  onDeleteClick() {
    this.isDeleteVisible = true;
  }

  /** 取消刪除
   * @memberof AppStoreInfoComponent
   */
  onCancelDelete() {
    this.isDeleteVisible = false;
  }

  /** 確認刪除
   * @memberof AppStoreInfoComponent
   */
  onConfirmDelete() {
    this.#appStoresService.pubAppStore(this.appStore, 'appStore.delete')
    this.router.navigate(['..'],{relativeTo:this.route});
  }

  /** 新增應用程式
   * @memberof AppStoreInfoComponent
   */
  onCreateClick() {
    this.editableApp.appType = this.appType.type
    this.appStore = Object.assign({}, this.editableApp);
    this.appStore.appPages = [...this.appPages];
    this.#appStoresService.pubAppStore(this.appStore, 'appStore.insert');
    this.appStore = new AppStore();
    this.editableApp = Object.assign({}, this.appStore);
    this.appPages = [...this.appStore.appPages]
  }

  /** 儲存應用程式編輯
   * @memberof AppStoreInfoComponent
   */
  onSaveClick() {
    this.editableApp.appType = this.appType.type
    this.appStore = Object.assign({}, this.editableApp);
    this.appStore.appPages = [...this.appPages];
    this.#appStoresService.pubAppStore(this.appStore, 'appStore.update');
  }

  /** 應用程式內容讀取及變數初始化
   * @memberof AppStoreInfoComponent
   */
  async getAppStore() {
    const jsonCodec = JSONCodec();

    this.appStore$ = await this.#appStoresService.getAppStore(this._id);

        // 處理資料邏輯的地方，取得reply回傳的資料
    this.appStore = jsonCodec.decode(this.appStore$.data) as AppStore;
    console.log(this.appStore)
    this.editableApp = Object.assign({}, this.appStore)

    const currentType = this.typeOptions.find(x => {
      return x.type === this.appStore.appType
    })

    this.appType = Object.assign({}, currentType);
    this.showIconStyle = this.editableApp.appIcon;
    this.appPages = [...this.appStore.appPages];
  }

  onDragStart(page: AppPage, index: number) {
    this.draggedPage = page;
    this.pageIndex = index
  }

  onDrop(index: number) {
    if(this.draggedPage) {
      this.appPages.splice(this.pageIndex, 1);
      this.appPages.splice(index, 0, this.draggedPage);
      this.draggedPage = null
      console.log(this.appPages);
    }
  }

  onDragEnd() {
    this.draggedPage = null
  }
}
