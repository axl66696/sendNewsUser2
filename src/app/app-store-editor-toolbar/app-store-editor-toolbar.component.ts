import { Component, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToolBarComponent } from '@his-component/tool-bar/dist/tool-bar'

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
  @Input() customTemplate!: TemplateRef<any>;

  @Input() title!: string[];

  sideButton: boolean = false
}
