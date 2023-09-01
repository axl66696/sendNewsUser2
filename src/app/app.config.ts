import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import '@angular/compiler';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { JetstreamWsService } from '@his-base/jetstream-ws';
import { JetstreamMangerService } from '@his-base/jetstream-manager';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withComponentInputBinding()), provideAnimations(), provideHttpClient(),
    {
      provide: JetstreamWsService,
      useValue: new JetstreamWsService({ name: 'OPD'})
    },
    JetstreamMangerService
  ]
};
