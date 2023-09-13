/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { DialogModule } from 'primeng/dialog';
import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from "primeng/inputtext";
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { AppStoreEditorToolbarComponent } from '../app-store-editor-toolbar/app-store-editor-toolbar.component';
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
import { $localize } from '@angular/localize/init';
import * as iconData from '../../assets/data/icon.json';
import * as typeData from '../../assets/data/type.json'

@Component({
  selector: 'his-app-store-editor-info',
  standalone: true,
  imports: [CommonModule,
            InputTextModule,
            CalendarModule,
            FormsModule,
            DialogModule,
            AppStoreEditorToolbarComponent,
            RouterLink,
            DropdownModule,
            CheckboxModule,
            TableModule,
            RadioButtonModule,
            AddPagesListComponent],
  templateUrl: './app-store-editor-info.component.html',
  styleUrls: ['./app-store-editor-info.component.scss']
})
export class AppStoreEditorInfoComponent implements OnInit {

  /** 要顯示的應用程式_id
   * @type {string}
   * @memberof AppStoreEditorInfoComponent
   */
  @Input() _id!: string;

  /** 顯示的圖標樣式
   * @type {string}
   * @memberof AppStoreEditorInfoComponent
   */
  showIconStyle: string = '';

  /** 可選擇的圖標清單
   * @type {string[]}
   * @memberof AppStoreEditorInfoComponent
   */
  iconList: string[] = [];

  /** 圖標選擇視窗顯示
   * @type {boolean}
   * @memberof AppStoreEditorInfoComponent
   */
  isIconVisible: boolean = false;

  /** 所含應用頁面編輯視窗顯示
   * @type {boolean}
   * @memberof AppStoreEditorInfoComponent
   */
  isTableVisible: boolean = false;

  appStore!: AppStore;
  appStore$!: Msg;
  appPages: AppPage[] = []
  editableApp!: AppStore;

  /** 應用程式預覽標題
   * @type {string}
   * @memberof AppStoreEditorInfoComponent
   */
  previewTitle!: string;

  /** 刪除視窗顯示
   * @type {boolean}
   * @memberof AppStoreEditorInfoComponent
   */
  isDeleteVisible: boolean = false;

  /** 類別及對應圖標顏色清單
   * @type {ColorType[]}
   * @memberof AppStoreEditorInfoComponent
   */
  typeOptions!: ColorType[]

  /** 應用程式語言種類
   * @type {string[]}
   * @memberof AppStoreEditorInfoComponent
   */
  languageOptions!: string[];

  /** Breadcrumb標題
   * @type {string[]}
   * @memberof AppStoreEditorInfoComponent
   */
  title!: string[];

  /** 設定應用程式類別及圖標顏色
   * @type {ColorType}
   * @memberof AppStoreEditorInfoComponent
   */
  appType!: ColorType

  #appStoresService = inject(AppStoreService);
  router = inject(Router);
  route = inject(ActivatedRoute)

  /** 初始化設定 讀取應用程式內容
   * @memberof AppStoreEditorInfoComponent
   */
  async ngOnInit() {
    console.log(Object.values(iconData)[0])
    this.iconList = Object.values(iconData)[0] as unknown as string[]

    console.log(Object.values(typeData)[0])
    this.typeOptions = Object.values(typeData)[0] as unknown as ColorType[]

    this.languageOptions = ['Angular16']

    this.appType = new ColorType({
      type: '門診',
      colorClass: 'icon-clinic',
      showColor: 'background: var(--indigo-500)'
    })

    this.previewTitle = $localize`應用程式標題`

    if(this._id) {
      this.getAppStore();

      this.title = [$localize`網頁建檔系統`, $localize`應用程式`, $localize`應用程式內容`]
    }
    else {
      this.appStore = new AppStore({appType: '門診'});
      this.editableApp = Object.assign({}, this.appStore);
      this.appStore.appIcon = 'pi-user';
      this.editableApp.appIcon = this.appStore.appIcon
      this.showIconStyle = this.editableApp.appIcon;
      this.appPages = [...this.appStore.appPages];

      this.title = [$localize`網頁建檔系統`, $localize`應用程式`, $localize`新增應用程式`]
    }
  }

  /** 顯示選擇圖標視窗
   * @memberof AppStoreEditorInfoComponent
   */
  onDialog() {
    this.isIconVisible = true;
  }

  /** 點選圖標預覽
   * @param {string} icon
   * @memberof AppStoreEditorInfoComponent
   */
  onSelectIcon(icon: string) {
    this.showIconStyle = icon;
  }

  /** 取消並復原選擇圖標
   * @memberof AppStoreEditorInfoComponent
   */
  onCancelSelect() {
    this.isIconVisible = false;
    this.showIconStyle = this.editableApp.appIcon;
  }

  /** 確認圖標選擇
   * @memberof AppStoreEditorInfoComponent
   */
  onConfirmIcon() {
    this.isIconVisible = false;
    this.editableApp.appIcon = this.showIconStyle;
  }

  /** 復原編輯或清除內容
   * @memberof AppStoreEditorInfoComponent
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
   * @memberof AppStoreEditorInfoComponent
   */
  onModifyClick() {
    this.isTableVisible = true
  }

  /** 取消頁面編輯
   * @memberof AppStoreEditorInfoComponent
   */
  onCancelModify() {
    this.isTableVisible = false;
  }

  /** 套用頁面編輯
   * @param {AppPage[]} appPages
   * @memberof AppStoreEditorInfoComponent
   */
  onApplyModify(appPages: AppPage[]) {
    this.isTableVisible = false;
    this.appPages = [...appPages];
  }

  /** 移除指定頁面
   * @param {AppPage} appPage
   * @memberof AppStoreEditorInfoComponent
   */
  onRemoveClick(appPage: AppPage) {
    this.appPages = this.appPages?.filter((v) => v._id !== appPage._id)
  }

  /** 開啟刪除應用程式視窗
   * @memberof AppStoreEditorInfoComponent
   */
  onDeleteClick() {
    this.isDeleteVisible = true;
  }

  /** 取消刪除
   * @memberof AppStoreEditorInfoComponent
   */
  onCancelDelete() {
    this.isDeleteVisible = false;
  }

  /** 確認刪除
   * @memberof AppStoreEditorInfoComponent
   */
  onConfirmDelete() {
    this.#appStoresService.pubAppStore(this.appStore, 'appStore.delete')
    this.router.navigate(['..'],{relativeTo:this.route});
  }

  /** 新增應用程式
   * @memberof AppStoreEditorInfoComponent
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
   * @memberof AppStoreEditorInfoComponent
   */
  onSaveClick() {
    this.appStore = Object.assign({}, this.editableApp);
    this.appStore.appPages = [...this.appPages];
    this.#appStoresService.pubAppStore(this.appStore, 'appStore.update');
  }

  /** 應用程式內容讀取及變數初始化
   * @memberof AppStoreEditorInfoComponent
   */
  async getAppStore() {
    const jsonCodec = JSONCodec();

    this.appStore$ = await this.#appStoresService.getAppStore(this._id);

        // 處理資料邏輯的地方，取得reply回傳的資料
    this.appStore = jsonCodec.decode(this.appStore$.data) as AppStore;
    this.editableApp = Object.assign({}, this.appStore)

    const currentType = this.typeOptions.find(x => {
      return x.type === this.appStore.appType
    })

    this.appType = Object.assign({}, currentType);
    this.showIconStyle = this.editableApp.appIcon;
    this.appPages = [...this.appStore.appPages]
  }
}
