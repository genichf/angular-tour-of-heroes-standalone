import { Component, signal, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeroService } from '../hero.service';

import {Hero} from '../hero';
import { Observable } from 'rxjs';





@Component({
  selector: 'app-heroes',
  imports: [
    RouterLink,
    AsyncPipe,
  ],
  templateUrl: './heroes.html',
  styleUrl: './heroes.css',
})
export class Heroes implements OnInit {
// Використовуємо Observable, щоб працювати з AsyncPipe
  heroes$!: Observable<Hero[]>;

  constructor(private heroService: HeroService) { }

  ngOnInit(): void {
    this.getHeroes();
}

  getHeroes(): void {
    // this.heroService.getHeroes()
    //   .subscribe(heroes => this.heroes = heroes);
    this.heroes$ = this.heroService.getHeroes();
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.heroService.addHero({ name } as Hero)
      .subscribe(() => {
        this.getHeroes();
      });
  }

  delete(hero: Hero): void {
    // this.heroes = this.heroes.filter(h => h !== hero);
    // this.heroService.deleteHero(hero.id).subscribe();
    this.heroService.deleteHero(hero.id)
      .subscribe(() => {
        // Після успішного видалення, повторно завантажуємо список
        this.getHeroes();
      });
  }
}

