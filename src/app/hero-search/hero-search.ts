import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop'; // 🪄 Магія перетворення
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  imports: [
    // AsyncPipe більше не потрібен
    RouterLink,
  ],
  templateUrl: './hero-search.html',
  styleUrl: './hero-search.css',
})
export class HeroSearch {
  private heroService = inject(HeroService);
  private searchTerms = new Subject<string>();

  // ⚡️ Перетворюємо Observable у Signal
  // toSignal автоматично підписується на потік і відписується, коли компонент знищується
  heroes = toSignal(
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if (!term.trim()) return of([]);
        return this.heroService.searchHeroes(term);
      })
    ),
    { initialValue: [] } // Замінює startWith(''), дає початковий стан сигналу
  );

  search(term: string): void {
    this.searchTerms.next(term);
  }
}
