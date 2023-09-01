import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { DragDropModule } from 'primeng/dragdrop';
import { TableModule } from 'primeng/table';
import { AppPage } from '@his-viewmodel/app-page-editor';
import { AppStoreService } from 'src/app/app-store.service';
import { InputTextModule } from 'primeng/inputtext';
import { Observable } from 'rxjs';
import { JSONCodec, Msg } from '@his-base/jetstream-ws';

@Component({
  selector: 'his-app-store-editor-page-list',
  standalone: true,
  imports: [CommonModule,
            RadioButtonModule,
            InputTextModule,
            FormsModule,
            DropdownModule,
            ButtonModule,
            TableModule,
            DragDropModule],
  templateUrl: './app-store-editor-page-list.component.html',
  styleUrls: ['./app-store-editor-page-list.component.scss'],
  providers: [AppStoreService]
})
export class AppStoreEditorPageListComponent {
  appPagesSelected!: AppPage[];
  @Input()
  set appPagesList(value: AppPage[]){
    this.appPagesSelected = [...value];
    this.appPagesInclude = [...this.appPagesSelected];
  }

  #visible: any;
  @Input()
  set visible(value: any) {
    this.#visible = value;
    if(this.#visible){
      this.appPagesSelected = [...this.appPagesInclude];
      this.appPages = this.filtExisted(this.origAppPages);
    }
  }

  @Output() cancel = new EventEmitter<any>();
  @Output() apply = new EventEmitter<any>();

  condition: string = '請選擇查詢條件： ';
  selectedSort = 1;
  selectedDrop!: string;
  draggedPage: AppPage | undefined | null;
  draggedReversePage: AppPage | undefined | null;
  origAppPages: AppPage[] = [];
  appPages: AppPage[] = [];
  appPages$!: Observable<Msg>;
  appPagesInclude: AppPage[] = [];
  #appStoreService = inject(AppStoreService);

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.appPages$ = this.#appStoreService.getAppPageList()

    this.appPages$.subscribe((msg: Msg) => {
      const jsonCodec = JSONCodec();
    // 處理資料邏輯的地方，取得reply回傳的資料
      console.log('Received message', jsonCodec.decode(msg.data));
      this.origAppPages = jsonCodec.decode(msg.data) as AppPage[];
      this.appPages = this.filtExisted(this.origAppPages);
    })

    this.appPagesInclude = [...this.appPagesSelected];
  }

  filtExisted(appPages: AppPage[]) {
    let resultPages: AppPage[] = [...appPages];
    for(let i = 0; i < (this.appPagesInclude as AppPage[]).length; i++){
      resultPages = resultPages?.filter((v) => v._id != (this.appPagesInclude as AppPage[])[i]._id)
    }
    return resultPages
  }

  dragStart(appPage: AppPage) {
    this.draggedPage = appPage;
  }

  dragReverseStart(appPage: AppPage) {
    this.draggedReversePage = appPage;
  }

  drop() {
    if (this.draggedPage) {
      let draggedPageIndex = this.findIndex(this.draggedPage);
      this.appPagesSelected = [...(this.appPagesSelected as AppPage[]), this.draggedPage];
      this.appPages = this.appPages?.filter((val, i) => i != draggedPageIndex);
      this.draggedPage = null;
    }
  }

  dropReverse() {
    if (this.draggedReversePage) {
      let draggedPageIndex = this.findSelectedIndex(this.draggedReversePage);
      this.appPages = [...(this.appPages as AppPage[]), this.draggedReversePage];
      this.appPagesSelected = this.appPagesSelected?.filter((val, i) => i != draggedPageIndex);
      this.draggedReversePage = null;
    }
  }

  findIndex(appPage: AppPage) {
    let index = -1;
    for (let i = 0; i < (this.appPages as AppPage[]).length; i++) {
        if (appPage._id === (this.appPages as AppPage[])[i]._id) {
            index = i;
            break;
        }
    }
    return index;
  }

  findSelectedIndex(appPage: AppPage) {
    let index = -1;
    for (let i = 0; i < (this.appPagesSelected as AppPage[]).length; i++) {
        if (appPage._id === (this.appPagesSelected as AppPage[])[i]._id) {
            index = i;
            break;
        }
    }
    return index;
  }

  dragEnd() {
    this.draggedPage = null;
  }

  dragReverseEnd() {
    this.draggedReversePage = null;
  }

  onPlusPage(appPage: AppPage) {
    let selectedPageIndex = this.findIndex(appPage);
    this.appPagesSelected = [...(this.appPagesSelected as AppPage[]), appPage]
    this.appPages = this.appPages?.filter((val, i) => i != selectedPageIndex)
  }

  onRemovePage(appPage: AppPage) {
    let selectedPageIndex = this.findSelectedIndex(appPage);
    this.appPages = [...(this.appPages as AppPage[]), appPage]
    this.appPagesSelected = this.appPagesSelected?.filter((val, i) => i != selectedPageIndex)
  }

  onCancelClick() {
    this.cancel.emit('');
  }

  onApplyClick() {
    this.apply.emit(this.appPagesSelected);
  }
}
