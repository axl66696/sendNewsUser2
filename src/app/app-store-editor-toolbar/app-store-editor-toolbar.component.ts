import { Component, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'his-app-store-editor-toolbar',
  standalone: true,
  imports: [CommonModule,
            ButtonModule],
  templateUrl: './app-store-editor-toolbar.component.html',
  styleUrls: ['./app-store-editor-toolbar.component.scss']
})
export class AppStoreEditorToolbarComponent {
  @Input() customTemplate!: TemplateRef<any>;
}
