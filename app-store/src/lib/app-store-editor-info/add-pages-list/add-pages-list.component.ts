/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { DragDropModule } from 'primeng/dragdrop';
import { TableModule } from 'primeng/table';
import { AppPage, AppPageReq } from '@his-viewmodel/app-page-editor';
import { AppStoreService } from '../../app-store.service';
import { InputTextModule } from 'primeng/inputtext';
import { JSONCodec, Msg } from '@his-base/jetstream-ws';

@Component({
  selector: 'his-add-pages-list',
  standalone: true,
  imports: [CommonModule,
            RadioButtonModule,
            InputTextModule,
            FormsModule,
            DropdownModule,
            ButtonModule,
            TableModule,
            DragDropModule],
  templateUrl: './add-pages-list.component.html',
  styleUrls: ['./add-pages-list.component.scss'],
  providers: [AppStoreService]
})
export class AddPagesListComponent implements OnInit {

  /** 應用程式所含頁面
   * @type {AppPage[]}
   * @memberof AppStoreEditorPageListComponent
   */
  appPagesSelected!: AppPage[];
  @Input()
  set appPagesList(value: AppPage[]){
    this.appPagesSelected = [...value];
    this.appPagesInclude = [...this.appPagesSelected];
    this.pageResult = [...this.appPagesSelected]
  }

  /** 編輯視窗是否顯示
   * @type {boolean}
   * @memberof AppStoreEditorPageListComponent
   */
  #isVisible!: boolean;
  @Input()
  set visible(value: boolean) {
    this.#isVisible = value;
    if(this.#isVisible){
      this.appPagesSelected = [...this.appPagesInclude];
      this.pageResult = [...this.appPagesInclude];
      this.appPages = this.getExcludedPages(this.origAppPages);
    }
  }

  /** 關閉編輯視窗並取消編輯
   * @memberof AppStoreEditorPageListComponent
   */
  @Output() cancel = new EventEmitter<any>();

  /** 關閉編輯視窗並套用編輯
   * @memberof AppStoreEditorPageListComponent
   */
  @Output() apply = new EventEmitter<any>();

  /** 查詢條件標題
   * @type {string}
   * @memberof AppStoreEditorPageListComponent
   */
  condition: string = $localize`請選擇查詢條件： `;

  /** 拖曳清單功能用
   * @type {(AppPage | undefined | null)}
   * @memberof AppStoreEditorPageListComponent
   */
  draggedPage: AppPage | undefined | null;

  /** 反向拖曳清單功能用
   * @type {(AppPage | undefined | null)}
   * @memberof AppStoreEditorPageListComponent
   */
  draggedReversePage: AppPage | undefined | null;

  /** 所有應用頁面清單
   * @type {AppPage[]}
   * @memberof AppStoreEditorPageListComponent
   */
  origAppPages: AppPage[] = [];

  /** 尚未包含應用頁面清單
   * @type {AppPage[]}
   * @memberof AppStoreEditorPageListComponent
   */
  appPages: AppPage[] = [];
  appPages$!: Msg;

  /** 已包含應用頁面清單
   * @type {AppPage[]}
   * @memberof AppStoreEditorPageListComponent
   */
  appPagesInclude: AppPage[] = [];

  /** 已包含應用頁面查詢結果清單
   * @type {AppPage[]}
   * @memberof AddPagesListComponent
   */
  pageResult: AppPage[] = []

  /** 未包含應用頁面查詢條件
   * @type {AppPageReq}
   * @memberof AddPagesListComponent
   */
  appPageReq: AppPageReq = new AppPageReq({searchType: 'pageTitle'});

  /** 已包含應用頁面查詢條件
   * @type {AppPageReq}
   * @memberof AddPagesListComponent
   */
  selectedPageReq: AppPageReq = new AppPageReq({searchType: 'pageTitle'});

  #appStoreService = inject(AppStoreService);

  /** 讀取頁面資料並區分個頁面是否存在於應用程式中
   * @memberof AddPagesListComponent
   */
  async ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getAppPages();
    this.appPagesInclude = [...this.appPagesSelected];
    this.pageResult = [...this.appPagesSelected];
  }

  /** 區分已包含及未包含的應用頁面
   * @param {AppPage[]} appPages
   * @return {AppPage[]}
   * @memberof AddPagesListComponent
   */
  getExcludedPages(appPages: AppPage[]): AppPage[] {
    let result: AppPage[] = [...appPages];
    this.appPagesSelected.map(v => {
      result = result?.filter((x) => x._id != v._id)
    })
    return result
  }

  /** 拖曳清單：按下左側欄位時執行
   * @param {AppPage} appPage
   * @memberof AppStoreEditorPageListComponent
   */
  dragStart(appPage: AppPage) {
    this.draggedPage = appPage;
  }

  /** 拖曳清單：按下右側欄位時執行
   * @param {AppPage} appPage
   * @memberof AddPagesListComponent
   */
  dragReverseStart(appPage: AppPage) {
    this.draggedReversePage = appPage;
  }

  /** 將左側物件拉到右側欄位放開滑鼠按鍵時執行
   * @memberof AddPagesListComponent
   */
  drop() {
    if (this.draggedPage) {
      const draggedPageIndex = this.findPageIndex(this.draggedPage);
      this.appPagesSelected = [...(this.appPagesSelected as AppPage[]), this.draggedPage];
      this.pageResult = [...this.appPagesSelected]
      this.appPages = this.appPages?.filter((x, i) => i != draggedPageIndex);
      this.draggedPage = null;
    }
  }

  /** 將右側物件拉到左側欄位放開滑鼠按鍵時執行
   * @memberof AddPagesListComponent
   */
  dropReverse() {
    if (this.draggedReversePage) {
      const draggedPageIndex = this.findSelectedIndex(this.draggedReversePage);
      this.appPages = [...(this.appPages as AppPage[]), this.draggedReversePage];
      this.appPagesSelected = this.appPagesSelected?.filter((x, i) => i != draggedPageIndex);
      this.pageResult = [...this.appPagesSelected]
      this.draggedReversePage = null;
    }
  }

  /** 取得左側選取物件在欄位陣列中的順序
   * @param {AppPage} appPage
   * @return {number}
   * @memberof AddPagesListComponent
   */
  findPageIndex(appPage: AppPage): number {
    let index = -1;
    this.appPages.find((x,i) => {
      if (appPage._id === x._id) {
        index = i
      }
    })
    return index;
  }

  /** 取的右側選取物件在欄位陣列中的順序
   * @param {AppPage} appPage
   * @return {number}
   * @memberof AddPagesListComponent
   */
  findSelectedIndex(appPage: AppPage): number {
    let index = -1;
    this.appPagesSelected.find((x,i) => {
      if (appPage._id === x._id) {
        index = i
      }
    })
    return index;
  }

  /** 拖曳左側物件後滑鼠放開時需清空選取物件
   * @memberof AddPagesListComponent
   */
  dragEnd() {
    this.draggedPage = null;
  }

  /** 拖曳右側物件後滑鼠放開時需清空選取物件
   * @memberof AddPagesListComponent
   */
  dragReverseEnd() {
    this.draggedReversePage = null;
  }

  /** 新增應用頁面至應用程式中
   * @param {AppPage} appPage
   * @memberof AppStoreEditorPageListComponent
   */
  onAddPage(appPage: AppPage) {
    const selectedPageIndex = this.findPageIndex(appPage);
    this.appPagesSelected = [...(this.appPagesSelected as AppPage[]), appPage]
    this.pageResult = [...this.appPagesSelected]
    this.appPages = this.appPages?.filter((val, i) => i != selectedPageIndex)
  }

  /** 刪除應用程式中的應用頁面
   * @param {AppPage} appPage
   * @memberof AddPagesListComponent
   */
  onRemovePage(appPage: AppPage) {
    const selectedPageIndex = this.findSelectedIndex(appPage);
    this.appPages = [...(this.appPages as AppPage[]), appPage]
    this.appPagesSelected = this.appPagesSelected?.filter((val, i) => i != selectedPageIndex)
    this.pageResult = [...this.appPagesSelected]
  }

  /** 關閉並還原編輯視窗事件
   * @memberof AppStoreEditorPageListComponent
   */
  onCancelClick() {
    this.cancel.emit('');
  }

  /** 套用目前變更並關閉編輯視窗事件
   * @memberof AddPagesListComponent
   */
  onApplyClick() {
    this.apply.emit(this.appPagesSelected);
  }

  /** 讀取應用頁面清單資料
   * @memberof AddPagesListComponent
   */
  async getAppPages() {
    this.appPages$ = await this.#appStoreService.getAppPageList()
    const jsonCodec = JSONCodec();
    this.origAppPages = jsonCodec.decode(this.appPages$.data) as AppPage[];
    this.appPages = this.getExcludedPages(this.origAppPages);
  }

  /** 未包含應用頁面查詢功能
   * @memberof AddPagesListComponent
   */
  onSearchClick() {
    if(this.appPageReq.searchType === 'pageTitle') {
      this.appPages = this.getExcludedPages(this.origAppPages);

      this.appPages = this.appPages.filter((x) => {
        return x.pageTitle?.includes(this.appPageReq.searchValue)
      })
    }
    else {
      this.appPages = this.getExcludedPages(this.origAppPages);

      this.appPages = this.appPages.filter((x) => {
        return x.maintainer.display?.includes(this.appPageReq.searchValue)
      })
    }
  }

  /** 已包含應用頁面查詢功能
   * @memberof AddPagesListComponent
   */
  onSelectedClick() {
    this.pageResult = this.appPagesSelected.filter((x) => {
      return x?.pageTitle.includes(this.selectedPageReq.searchValue)
    })
  }
}
