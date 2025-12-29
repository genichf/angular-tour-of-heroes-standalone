import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';
import { MessageService } from './message.service';

@Injectable({ providedIn: 'root' })
export class HeroService {
  private http = inject(HttpClient);
  private messageService = inject(MessageService);

  private heroesUrl = 'api/heroes';  // URL to web api

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  // 🟢 Глобальний стан: список героїв
  private heroesSignal = signal<Hero[]>([]);
  // 🔵 Публічний доступ до списку (тільки для читання)
  readonly heroes = this.heroesSignal.asReadonly();

  // 🟢 Новий сигнал для відстеження завантаження
  isLoading = signal<boolean>(false);

  /** GET: Отримати героїв і оновити сигнал */
  getHeroes(): void {
    this.isLoading.set(true); // Починаємо завантаження
    this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap(_ => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    ).subscribe(heroes => {
      this.heroesSignal.set(heroes);
      this.isLoading.set(false); // Завершили завантаження
    });
  }

  /** GET: Отримати героя за ID. Повертає `undefined`, якщо не знайдено */
  getHeroNo404<Data>(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/?id=${id}`;
    return this.http.get<Hero[]>(url).pipe(
      map(heroes => heroes[0]),
      tap(h => {
        const outcome = h ? 'fetched' : 'did not find';
        this.log(`${outcome} hero id=${id}`);
      }),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  /** GET: Отримати героя за ID */
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  /** GET: Пошук героїв за назвою (залишаємо Observable для компонента пошуку) */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
         this.log(`found heroes matching "${term}"`) :
         this.log(`no heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  //////// Save methods //////////

  /** POST: Додати героя та оновити сигнал */
  addHero(hero: Hero): void {
    this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    ).subscribe(newHero => {
      // ВАЖЛИВО: Оновлюємо сигнал тільки ТУТ і один раз.
      if (newHero && newHero.id) {
        this.heroesSignal.update(heroes => [...heroes, newHero]);
      }
    });
  }

  /** DELETE: Видалити героя та оновити сигнал */
  deleteHero(id: number): void {
    const url = `${this.heroesUrl}/${id}`;
    this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    ).subscribe(() => {
      // Оновлюємо сигнал локально, щоб не робити getHeroes() знову
      this.heroesSignal.update(heroes => heroes.filter(h => h.id !== id));
    });
  }

  /** PUT: Оновити героя на сервері та в сигналі */
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => {
        this.log(`updated hero id=${hero.id}`);
        // Оновлюємо локальний стан сигналу
        this.heroesSignal.update(heroes => 
          heroes.map(h => h.id === hero.id ? hero : h)
        );
      }),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}