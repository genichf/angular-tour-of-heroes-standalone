import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { map, Observable } from 'rxjs';
import { HeroSearch } from "../hero-search/hero-search";

@Component({
  selector: 'app-dashboard',
  imports: [
    AsyncPipe,
    RouterLink,
    HeroSearch,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
// 🎯 Зміна: Зберігаємо Observable, а не масив
  heroes$!: Observable<Hero[]>;

  constructor(private heroService: HeroService) { }

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
// 🎯 Зміна: Присвоюємо heroes$ Observable, який модифікується оператором map
    this.heroes$ = this.heroService.getHeroes().pipe(
      // Використовуємо map для обробки даних у потоці, а не в .subscribe()
      map(heroes => heroes.slice(1, 5)) 
    );
  }
}
