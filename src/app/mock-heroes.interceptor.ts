import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { Observable, timer } from 'rxjs'; 
import { map } from 'rxjs/operators';
import { Hero } from './hero'; 

// Залишаємо масив тут
let HEROES: Hero[] = [
    { id: 12, name: 'Dr. Nice' }, { id: 13, name: 'Bombasto' },
    { id: 14, name: 'Celeritas' }, { id: 15, name: 'Magneta' },
    { id: 16, name: 'RubberMan' }, { id: 17, name: 'Dynama' },
    { id: 18, name: 'Dr. IQ' }, { id: 19, name: 'Magma' },
    { id: 20, name: 'Tornado' }
];

// 🟢 Зменшіть затримку до 500-1000мс, щоб додаток не здавався "гальмуючим"
const mockDelay = 500; 

function genId(): number {
    return HEROES.length > 0
        ? Math.max(...HEROES.map(hero => hero.id)) + 1
        : 11;
}

export const mockHeroesInterceptor: HttpInterceptorFn = (req, next) => {
    const { url: rawUrl, method, body } = req;
    const url = rawUrl.trim(); 
    
    if (!url.includes('api/heroes')) {
        return next(req);
    }

    let responseBody: any;
    let status = 200;

    // --- ЛОГІКА ОБРОБКИ ДАНИХ (БЕЗ ЗАТРИМКИ) ---
    if (method === 'GET') {
        if (url.endsWith('api/heroes')) { 
            responseBody = [...HEROES]; // Повертаємо копію
        } else {
            const urlObj = new URL(rawUrl, window.location.origin);
            const nameTerm = urlObj.searchParams.get('name');
            const idMatch = url.match(/api\/heroes\/(\d+)$/);
            const idParam = urlObj.searchParams.get('id'); 

            if (idParam) {
                const hero = HEROES.find(h => h.id === +idParam);
                responseBody = hero ? [hero] : []; 
            } else if (idMatch) {
                const id = +idMatch[1];
                responseBody = HEROES.find(h => h.id === id);
                if (!responseBody) status = 404; 
            } else if (nameTerm) {
                responseBody = HEROES.filter(h => h.name.toLowerCase().includes(nameTerm.toLowerCase()));
            }
        }
    }

    if (method === 'POST') {
        const newHero: Hero = { ...(body as Hero), id: genId() }; 
        HEROES = [...HEROES, newHero]; // Оновлюємо масив
        responseBody = newHero;
        status = 201;
    }

    if (method === 'PUT') {
        const updatedHero: Hero = body as Hero;
        HEROES = HEROES.map(h => h.id === updatedHero.id ? updatedHero : h);
        status = 204;
    }

    if (method === 'DELETE') {
        const id = +url.split('/').pop()!;
        HEROES = HEROES.filter(h => h.id !== id);
        status = 204;
    }

    // 🎯 ВІДПОВІДЬ ПРИХОДИТЬ ОДНИМ ПАКЕТОМ ПІСЛЯ ЗАТРИМКИ
    // Це запобігає "подвійному" баченню героя
    return timer(mockDelay).pipe(
        map(() => new HttpResponse({ status: status, body: responseBody }))
    ) as Observable<HttpResponse<any>>;
};