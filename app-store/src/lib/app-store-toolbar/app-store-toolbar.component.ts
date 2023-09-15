/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToolBarComponent } from '@his-directive/tool-bar/dist/tool-bar'

@Component({
  selector: 'his-app-store-toolbar',
  standalone: true,
  imports: [CommonModule,
            ButtonModule,
            ToolBarComponent],
  templateUrl: './app-store-toolbar.component.html',
  styleUrls: ['./app-store-toolbar.component.scss']
})
export class AppStoreToolbarComponent {
  /** 傳入的按鈕樣式
   * @type {TemplateRef<any>}
   * @memberof AppStoreToolbarComponent
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() customTemplate!: TemplateRef<any>;

  /** 傳入的頁面標題
   * @type {string[]}
   * @memberof AppStoreToolbarComponent
   */
  @Input() title!: string[];

  /** 控制tool-bar的button
   * @type {boolean}
   * @memberof AppStoreToolbarComponent
   */
  isSideButton: boolean = false
}
