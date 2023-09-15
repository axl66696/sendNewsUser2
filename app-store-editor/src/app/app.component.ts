import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AppStoreComponent } from 'app-store';

@Component({
  selector: 'his-root',
  standalone: true,
  imports: [CommonModule,
            RouterOutlet,
            AppStoreComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app-store-editor';
}
