// src/app/mock-heroes.interceptor.ts
import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
// 🎯 Вносимо зміни в імпорти RxJS: використовуємо timer та map
import { Observable, timer, of } from 'rxjs'; 
import { map } from 'rxjs/operators';
import { Hero } from './hero'; 

// 🟢 Дані: Винесені поза функцію для збереження стану між запитами
const HEROES: Hero[] = [
    { id: 12, name: 'Dr. Nice' }, { id: 13, name: 'Bombasto' },
    { id: 14, name: 'Celeritas' }, { id: 15, name: 'Magneta' },
    { id: 16, name: 'RubberMan' }, { id: 17, name: 'Dynama' },
    { id: 18, name: 'Dr. IQ' }, { id: 19, name: 'Magma' },
    { id: 20, name: 'Tornado' }
];

const mockDelay = 3000; 

function genId(): number {
    return HEROES.length > 0
        ? Math.max(...HEROES.map(hero => hero.id)) + 1
        : 11;
}

// 🎯 Функціональний Інтерцептор
export const mockHeroesInterceptor: HttpInterceptorFn = (req, next) => {
    // КРИТИЧНЕ ВИПРАВЛЕННЯ 1: Очищення URL
    const { url: rawUrl, method, body } = req;
    const url = rawUrl.trim(); 
    
    // КРИТИЧНЕ ВИПРАВЛЕННЯ 2: Перевірка без початкового слешу
    if (!url.includes('api/heroes')) {
        return next(req);
    }
    console.log(">>> INTERCEPTOR LOADED: Testing:", url); 

    // --- GET (All, By ID, Search) ---
    if (method === 'GET') {
        
        let responseBody: any;
        let status = 200;
        
        // 🟢 GET ALL HEROES
        if (url.endsWith('api/heroes')) { 
             console.log(">>> INTERCEPTED: Returning All Heroes JSON!");
             responseBody = HEROES;
             status = 200;
        } 
        // 🟢 GET: HERO BY ID або SEARCH
        else {
            const urlObj = new URL(rawUrl, window.location.origin);
            const nameTerm = urlObj.searchParams.get('name');
            const idMatch = url.match(/api\/heroes\/(\d+)$/);
            const idParam = urlObj.searchParams.get('id'); 
            
            if (idParam) { // getHeroNo404: api/heroes/?id=X
                const hero = HEROES.find(h => h.id === +idParam);
                responseBody = hero ? [hero] : []; 
            } else if (idMatch) { // getHero: api/heroes/X
                const id = +idMatch[1];
                responseBody = HEROES.find(h => h.id === id);
                if (!responseBody) status = 404; 
            } else if (nameTerm) { // searchHeroes: api/heroes/?name=term
                responseBody = HEROES.filter(h => h.name.toLowerCase().includes(nameTerm.toLowerCase()));
            } else {
                status = 404;
            }
        }
        
        // 🎯 ВИКОРИСТАННЯ TIMER: Повернення відповіді після затримки
        return timer(mockDelay).pipe(
            map(() => new HttpResponse({ status: status, body: responseBody }))
        ) as Observable<HttpResponse<any>>;
    }

    // --- POST (Add) ---
    if (url.endsWith('api/heroes') && method === 'POST') {
      const newHero: Hero = { ...(body as Hero), id: genId() }; 
      HEROES.push(newHero);
      return timer(mockDelay).pipe(
        map(() => new HttpResponse({ status: 201, body: newHero }))
      ) as Observable<HttpResponse<any>>;
    }
    
    // --- PUT (Update) ---
    if (url.includes('api/heroes') && method === 'PUT') {
      const updatedHero: Hero = body as Hero;
      const index = HEROES.findIndex(h => h.id === updatedHero.id);
      if (index > -1) HEROES[index] = updatedHero;
      return timer(mockDelay).pipe(
        map(() => new HttpResponse({ status: 204, body: null }))
      ) as Observable<HttpResponse<any>>;
    }
    
    // --- DELETE ---
    if (url.match(/api\/heroes\/(\d+)$/) && method === 'DELETE') {
      const id = +url.split('/').pop()!;
      const index = HEROES.findIndex(h => h.id === id);
      if (index > -1) HEROES.splice(index, 1);
      return timer(mockDelay).pipe(
        map(() => new HttpResponse({ status: 204, body: null }))
      ) as Observable<HttpResponse<any>>;
    }
    
    // 🛑 ФІНАЛЬНА ЗАПОБІЖНА СІТКА
    return timer(mockDelay).pipe(
        map(() => new HttpResponse({ status: 404, statusText: 'Mock API Method Not Implemented' }))
    ) as Observable<HttpResponse<any>>;
};