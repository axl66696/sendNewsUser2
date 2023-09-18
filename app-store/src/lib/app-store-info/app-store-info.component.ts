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
import { ColorType } from './color-type';
import { ImageModule } from 'primeng/image';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from 'primeng/dragdrop';
import '@angular/localize/init';
import * as iconData from '../../assets/data/material-icon.json';
import * as typeData from '../../assets/data/type.json'
import { SharedService } from '@his-base/shared';

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
  showIconStyle: string = 'help_clinic';

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

  /** 應用程式所擁有頁面
   * @type {AppPage[]}
   * @memberof AppStoreInfoComponent
   */
  appPages: AppPage[] = []

  /** 應用程式預覽標題
   * @type {string}
   * @memberof AppStoreInfoComponent
   */
  previewTitle: string = $localize`應用程式標題`;

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
  title: string[] = [$localize`網頁建檔系統`, $localize`應用程式`, $localize`應用程式內容`];

  /** 設定應用程式類別及圖標顏色
   * @type {ColorType}
   * @memberof AppStoreInfoComponent
   */
  appType!: ColorType;

  /** 拖曳功能被選取的頁面資料
   * @type {(AppPage | undefined | null)}
   * @memberof AppStoreInfoComponent
   */
  draggedPage: AppPage | undefined | null;

  /** 被拖曳頁面在陣列中的順序
   * @type {number}
   * @memberof AppStoreInfoComponent
   */
  pageIndex!: number;

  router = inject(Router);
  route = inject(ActivatedRoute);
  #appStoresService = inject(AppStoreService);
  #sharedService = inject(SharedService)

  /** 初始化設定 讀取應用程式內容
   * @memberof AppStoreInfoComponent
   */
  async ngOnInit() {
    this.iconList = Object.values(iconData)[0] as unknown as string[]
    this.typeOptions = Object.values(typeData)[0] as unknown as ColorType[]
    this.languageOptions = ['Angular16']
    this.appType = new ColorType(this.typeOptions[3])

    await this.#appStoresService.connect();

    if(this._id) {
      await this.getAppStore();
    }
    else {
      this.appStore = new AppStore({appType: '門診', appIcon: this.showIconStyle});
      this.appPages = [...this.appStore.appPages];
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
    this.showIconStyle = this.appStore.appIcon;
  }

  /** 確認圖標選擇
   * @memberof AppStoreInfoComponent
   */
  onConfirmIcon() {
    this.isIconVisible = false;
    this.appStore.appIcon = this.showIconStyle;
  }

  /** 復原編輯或清除內容
   * @memberof AppStoreInfoComponent
   */
  onClearClick() {
    this.router.navigate(['..'],{relativeTo:this.route});
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
  async onCreateClick() {
    this.appStore.appType = this.appType.type
    this.appStore.appPages = [...this.appPages];
    await this.#appStoresService.pubAppStore(this.appStore, 'appStore.insert');
  }

  /** 儲存應用程式編輯
   * @memberof AppStoreInfoComponent
   */
  onSaveClick() {
    this.appStore.appType = this.appType.type
    this.appStore.appPages = [...this.appPages];
    this.#appStoresService.pubAppStore(this.appStore, 'appStore.update');
  }

  /** 應用程式內容讀取及變數初始化
   * @memberof AppStoreInfoComponent
   */
  async getAppStore() {

    this.appStore = this.#sharedService.getValue(this._id)

    const currentType = this.typeOptions.find(x => {
      return x.type === this.appStore.appType
    })
    this.appType = Object.assign({}, currentType);

    this.showIconStyle = this.appStore.appIcon;
    this.appPages = [...this.appStore.appPages];
  }

  /** 清單順序拖曳功能 選擇拖曳
   * @param {AppPage} page
   * @param {number} index
   * @memberof AppStoreInfoComponent
   */
  onDragStart(page: AppPage, index: number) {
    this.draggedPage = page;
    this.pageIndex = index
  }

  /** 放開拖曳項目 變更項目在陣列中序位
   * @param {number} index
   * @memberof AppStoreInfoComponent
   */
  onDrop(index: number) {
    if(this.draggedPage) {
      this.appPages.splice(this.pageIndex, 1);
      this.appPages.splice(index, 0, this.draggedPage);
      this.appPages = [...this.appPages];
      this.draggedPage = null;
    }
  }

  /** 方開拖曳項目時清空
   * @memberof AppStoreInfoComponent
   */
  onDragEnd() {
    this.draggedPage = null
  }
}
