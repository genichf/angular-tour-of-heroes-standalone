import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';

import {
   debounceTime, distinctUntilChanged, startWith, switchMap
 } from 'rxjs';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  imports: [
    AsyncPipe,
    RouterLink,
  ],
  templateUrl: './hero-search.html',
  styleUrl: './hero-search.css',
})
export class HeroSearch implements OnInit {
  heroes$!: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
this.heroes$ = this.searchTerms.pipe(
      // 🎯 КРОК 1: startWith('') - Видає порожній рядок негайно на старті. 
      // Це гарантує, що heroes$ має початкове значення, і AsyncPipe не буде null.
      startWith(''), 

      // КРОК 2: Чекаємо 300 мс (для debounce)
      debounceTime(300), 

      // КРОК 3: Ігноруйте, якщо термін не змінився
      distinctUntilChanged(), 

      // КРОК 4: switchMap - Перемикання на запит
      switchMap((term: string) => {
        if (!term.trim()) {
          // Якщо термін порожній (включаючи початковий '')
          return of([]); 
        }
        // Інакше, виконуйте пошук із затримкою
        return this.heroService.searchHeroes(term);
      }),
    );
  }
}
