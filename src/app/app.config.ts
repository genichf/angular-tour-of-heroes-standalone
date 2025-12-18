import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // 🏆 Найкращий сучасний вибір:
    provideZonelessChangeDetection(), 
    
    provideRouter(routes),
    provideHttpClient(withInterceptors([])),
  ]
};