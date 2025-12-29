import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { mockHeroesInterceptor } from './mock-heroes.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // 🏆 Найкращий сучасний вибір:
    provideZonelessChangeDetection(), 
    
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([mockHeroesInterceptor])),
  ]
};