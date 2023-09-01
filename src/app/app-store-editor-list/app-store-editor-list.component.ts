import { CheckboxModule } from 'primeng/checkbox';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { AppStoreEditorToolbarComponent } from '../app-store-editor-toolbar/app-store-editor-toolbar.component';
import { RouterLink } from '@angular/router';
import { AppStore } from '@his-viewmodel/app-store-editor';
import { AppStoreService } from '../app-store.service';
import { Observable } from 'rxjs';
import { JSONCodec, Msg } from '@his-base/jetstream-ws';

@Component({
  selector: 'his-app-store-editor-list',
  standalone: true,
  imports: [CommonModule,
            TableModule,
            RadioButtonModule,
            FormsModule,
            DropdownModule,
            ButtonModule,
            CheckboxModule,
            AppStoreEditorToolbarComponent,
            RouterLink],
  templateUrl: './app-store-editor-list.component.html',
  styleUrls: ['./app-store-editor-list.component.scss'],
  providers: [AppStoreService]
})
export class AppStoreEditorListComponent {
  appStores: AppStore[] = [];
  condition = '請選擇查詢條件：';
  selectedSort = 1;
  selectedDrop = "";
  #appStoreService = inject(AppStoreService);
  appStores$!: Observable<Msg>;
  resultApps$?: Observable<Msg>;
  resultApps: AppStore[] = [];
  searchValue!: string;

  ngOnInit(): void {
    this.appStores$ = this.#appStoreService.getAppStoreList();

    this.appStores$.subscribe((msg: Msg) => {
      const jsonCodec = JSONCodec();
      this.appStores = jsonCodec.decode(msg.data) as AppStore[];
      this.resultApps = [...this.appStores]
    })
  }

  onSearchClick() {
    if(!this.searchValue)
    {
      this.resultApps = [...this.appStores]
      return
    }
    this.resultApps$ = this.#appStoreService.searchAppStore(this.searchValue)

    this.resultApps$.subscribe((msg: Msg) => {
      const jsonCodec = JSONCodec();
      this.resultApps = jsonCodec.decode(msg.data) as AppStore[];
    })
  }
}
