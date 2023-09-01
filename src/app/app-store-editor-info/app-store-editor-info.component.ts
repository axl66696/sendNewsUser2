import { DialogModule } from 'primeng/dialog';
import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from "primeng/inputtext";
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { AppStoreEditorToolbarComponent } from '../app-store-editor-toolbar/app-store-editor-toolbar.component';
import { Router, RouterLink } from '@angular/router';
import { AppStore } from '@his-viewmodel/app-store-editor';
import { Observable } from 'rxjs';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { AppPage } from '@his-viewmodel/app-page-editor';
import { AppStoreService } from '../app-store.service';
import { RadioButtonModule } from 'primeng/radiobutton';
import { AppStoreEditorPageListComponent } from './app-store-editor-page-list/app-store-editor-page-list.component';
import { JSONCodec, Msg } from '@his-base/jetstream-ws';

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
            AppStoreEditorPageListComponent],
  templateUrl: './app-store-editor-info.component.html',
  styleUrls: ['./app-store-editor-info.component.scss']
})
export class AppStoreEditorInfoComponent {
  @Input() _id!: string;

  date: string = '';
  showIconStyle: string = '';
  iconList: string[] = [];
  visible: boolean = false;
  tableVisible: boolean = false;
  appStore!: AppStore;
  appStore$!: Observable<Msg>;
  appPages: AppPage[] = []
  editableApp!: AppStore;
  selectedDrop!: string;
  authNeed!: boolean;
  previewTitle!: string;
  deleteVisible: boolean = false;
  #appStoresService = inject(AppStoreService);
  router = inject(Router);

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.iconList = [
      "pi-eraser",

      "pi-stopwatch",

      "pi-verified",

      "pi-delete-left",

      "pi-hourglass",

      "pi-truck",

      "pi-wrench",

      "pi-microphone",

      "pi-megaphone",

      "pi-arrow-right-arrow-left",

      "pi-bitcoin",

      "pi-file-edit",

      "pi-language",

      "pi-file-export",

      "pi-file-import",

      "pi-file-word",

      "pi-gift",

      "pi-cart-plus",

      "pi-thumbs-down-fill",

      "pi-thumbs-up-fill",

      "pi-arrows-alt",

      "pi-calculator",

      "pi-sort-alt-slash",

      "pi-arrows-h",

      "pi-arrows-v",

      "pi-pound",

      "pi-prime",

      "pi-chart-pie",

      "pi-reddit",

      "pi-code",

      "pi-sync",

      "pi-shopping-bag",

      "pi-server",

      "pi-database",

      "pi-hashtag",

      "pi-bookmark-fill",

      "pi-filter-fill",

      "pi-heart-fill",

      "pi-flag-fill",

      "pi-circle",

      "pi-circle-fill",

      "pi-bolt",

      "pi-history",

      "pi-box",

      "pi-at",

      "pi-arrow-up-right",

      "pi-arrow-up-left",

      "pi-arrow-down-left",

      "pi-arrow-down-right",

      "pi-telegram",

      "pi-stop-circle",

      "pi-stop",

      "pi-whatsapp",

      "pi-building",

      "pi-qrcode",

      "pi-car",

      "pi-instagram",

      "pi-linkedin",

      "pi-send",

      "pi-slack",

      "pi-sun",

      "pi-moon",

      "pi-vimeo",

      "pi-youtube",

      "pi-flag",

      "pi-wallet",

      "pi-map",

      "pi-link",

      "pi-credit-card",

      "pi-discord",

      "pi-percentage",

      "pi-euro",

      "pi-book",

      "pi-shield",

      "pi-paypal",

      "pi-amazon",

      "pi-phone",

      "pi-filter-slash",

      "pi-facebook",

      "pi-github",

      "pi-twitter",

      "pi-step-backward-alt",

      "pi-step-forward-alt",

      "pi-forward",

      "pi-backward",

      "pi-fast-backward",

      "pi-fast-forward",

      "pi-pause",

      "pi-play",

      "pi-compass",

      "pi-id-card",

      "pi-ticket",

      "pi-file-o",

      "pi-reply",

      "pi-directions-alt",

      "pi-directions",

      "pi-thumbs-up",

      "pi-thumbs-down",

      "pi-sort-numeric-down-alt",

      "pi-sort-numeric-up-alt",

      "pi-sort-alpha-down-alt",

      "pi-sort-alpha-up-alt",

      "pi-sort-numeric-down",

      "pi-sort-numeric-up",

      "pi-sort-alpha-down",

      "pi-sort-alpha-up",

      "pi-sort-alt",

      "pi-sort-amount-up",

      "pi-sort-amount-down",

      "pi-sort-amount-down-alt",

      "pi-sort-amount-up-alt",

      "pi-palette",

      "pi-undo",

      "pi-desktop",

      "pi-sliders-v",

      "pi-sliders-h",

      "pi-search-plus",

      "pi-search-minus",

      "pi-file-excel",

      "pi-file-pdf",

      "pi-check-square",

      "pi-chart-line",

      "pi-user-edit",

      "pi-exclamation-circle",

      "pi-android",

      "pi-google",

      "pi-apple",

      "pi-microsoft",

      "pi-heart",

      "pi-mobile",

      "pi-tablet",

      "pi-key",

      "pi-shopping-cart",

      "pi-comments",

      "pi-comment",

      "pi-briefcase",

      "pi-bell",

      "pi-paperclip",

      "pi-share-alt",

      "pi-envelope",

      "pi-volume-down",

      "pi-volume-up",

      "pi-volume-off",

      "pi-eject",

      "pi-money-bill",

      "pi-images",

      "pi-image",

      "pi-sign-in",

      "pi-sign-out",

      "pi-wifi",

      "pi-sitemap",

      "pi-chart-bar",

      "pi-camera",

      "pi-dollar",

      "pi-lock-open",

      "pi-table",

      "pi-map-marker",

      "pi-list",

      "pi-eye-slash",

      "pi-eye",

      "pi-folder-open",

      "pi-folder",

      "pi-video",

      "pi-inbox",

      "pi-lock",

      "pi-unlock",

      "pi-tags",

      "pi-tag",

      "pi-power-off",

      "pi-save",

      "pi-question-circle",

      "pi-question",

      "pi-copy",

      "pi-file",

      "pi-clone",

      "pi-calendar-times",

      "pi-calendar-minus",

      "pi-calendar-plus",

      "pi-ellipsis-v",

      "pi-ellipsis-h",

      "pi-bookmark",

      "pi-globe",

      "pi-replay",

      "pi-filter",

      "pi-print",

      "pi-align-right",

      "pi-align-left",

      "pi-align-center",

      "pi-align-justify",

      "pi-cog",

      "pi-cloud-download",

      "pi-cloud-upload",

      "pi-cloud",

      "pi-pencil",

      "pi-users",

      "pi-clock",

      "pi-user-minus",

      "pi-user-plus",

      "pi-trash",

      "pi-external-link",

      "pi-window-maximize",

      "pi-window-minimize",

      "pi-refresh",

      "pi-user",

      "pi-exclamation-triangle",

      "pi-calendar",

      "pi-chevron-circle-left",

      "pi-chevron-circle-down",

      "pi-chevron-circle-right",

      "pi-chevron-circle-up",

      "pi-angle-double-down",

      "pi-angle-double-left",

      "pi-angle-double-right",

      "pi-angle-double-up",

      "pi-angle-down",

      "pi-angle-left",

      "pi-angle-right",

      "pi-angle-up",

      "pi-upload",

      "pi-download",

      "pi-ban",

      "pi-star-fill",

      "pi-star",

      "pi-chevron-left",

      "pi-chevron-right",

      "pi-chevron-down",

      "pi-chevron-up",

      "pi-caret-left",

      "pi-caret-right",

      "pi-caret-down",

      "pi-caret-up",

      "pi-search",

      "pi-check",

      "pi-check-circle",

      "pi-times",

      "pi-times-circle",

      "pi-plus",

      "pi-plus-circle",

      "pi-minus",

      "pi-minus-circle",

      "pi-circle-on",

      "pi-circle-off",

      "pi-sort-down",

      "pi-sort-up",

      "pi-sort",

      "pi-step-backward",

      "pi-step-forward",

      "pi-th-large",

      "pi-arrow-down",

      "pi-arrow-left",

      "pi-arrow-right",

      "pi-arrow-up",

      "pi-bars",

      "pi-arrow-circle-down",

      "pi-arrow-circle-left",

      "pi-arrow-circle-right",

      "pi-arrow-circle-up",

      "pi-info",

      "pi-info-circle",

      "pi-home",

      "pi-spinner"
    ];

    this.authNeed = false;
    this.previewTitle = '應用程式標題'

    if(this._id)
    {
      this.appStore$ = this.#appStoresService.getAppStore(this._id);
      this.appStore$.subscribe((msg: Msg) => {
          const jsonCodec = JSONCodec();
        // 處理資料邏輯的地方，取得reply回傳的資料
          console.log('Received message', jsonCodec.decode(msg.data));
          this.appStore = jsonCodec.decode(msg.data) as AppStore;
          this.editableApp = Object.assign({}, this.appStore);
          this.showIconStyle = this.editableApp.appIcon;
          this.appPages = [...this.appStore.appPages]
      })
    }
    else
    {
      this.appStore = new AppStore();

      this.editableApp = Object.assign({}, this.appStore);
      this.appStore.appIcon = 'pi-user';
      this.editableApp.appIcon = this.appStore.appIcon
      this.showIconStyle = this.editableApp.appIcon;
      this.appPages = [...this.appStore.appPages];
    }
  }

  onDialog() {
    this.visible = true;
  }

  onSelectIcon(icon: string) {
    this.showIconStyle = icon;
  }

  onCancelSelect() {
    this.visible = false;
    this.showIconStyle = this.editableApp.appIcon;
  }

  onConfirmIcon() {
    this.visible = false;
    this.editableApp.appIcon = this.showIconStyle;
  }

  onClearClick() {
    this.editableApp.appTitle = this.appStore.appTitle;
    //this.editableApp.moduleName = this.appStore.moduleName;
    this.editableApp.versionNo = this.appStore.versionNo;
    this.showIconStyle = this.appStore.appIcon;
    this.editableApp.appIcon = this.appStore.appIcon;
    this.appPages = [...this.appStore.appPages]
  }

  onModifyClick() {
    this.tableVisible = true
  }

  onCancelModify() {
    this.tableVisible = false;
  }

  onApplyModify(appPages: AppPage[]) {
    this.tableVisible = false;
    this.appPages = [...appPages];
  }

  onRemoveClick(appPage: AppPage) {
    this.appPages = this.appPages?.filter((v) => v._id !== appPage._id)
  }

  onDeleteClick() {
    this.deleteVisible = true;
  }

  onCancelDelete() {
    this.deleteVisible = false;
  }

  onConfirmDelete() {
    this.#appStoresService.pubAppStore(this.appStore, 'appStore.delete')
    this.router.navigate(['/']);
  }

  onCreateClick() {
    this.appStore = Object.assign({}, this.editableApp);
    this.appStore.appPages = [...this.appPages];
    this.#appStoresService.pubAppStore(this.appStore, 'appStore.insert');
    this.appStore = new AppStore();
    this.editableApp = Object.assign({}, this.appStore);
    this.appPages = [...this.appStore.appPages]
  }

  onSaveClick() {
    this.appStore = Object.assign({}, this.editableApp);
    this.appStore.appPages = [...this.appPages];
    this.#appStoresService.pubAppStore(this.appStore, 'appStore.update');
  }
}
