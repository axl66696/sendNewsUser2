/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToolBarComponent } from '@his-directive/tool-bar/dist/tool-bar'

@Component({
  selector: 'his-app-store-editor-toolbar',
  standalone: true,
  imports: [CommonModule,
            ButtonModule,
            ToolBarComponent],
  templateUrl: './app-store-editor-toolbar.component.html',
  styleUrls: ['./app-store-editor-toolbar.component.scss']
})
export class AppStoreEditorToolbarComponent {
  /** 傳入的按鈕樣式
   * @type {TemplateRef<any>}
   * @memberof AppStoreEditorToolbarComponent
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() customTemplate!: TemplateRef<any>;

  /** 傳入的頁面標題
   * @type {string[]}
   * @memberof AppStoreEditorToolbarComponent
   */
  @Input() title!: string[];

  /** 控制tool-bar的button
   * @type {boolean}
   * @memberof AppStoreEditorToolbarComponent
   */
  sideButton: boolean = false
}
