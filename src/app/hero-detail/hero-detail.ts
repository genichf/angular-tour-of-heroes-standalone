import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, Location, UpperCasePipe } from '@angular/common';

import { HeroService } from '../hero.service';
import {Hero} from '../hero';
import { Observable, switchMap, of, tap } from 'rxjs';

@Component({
  selector: 'app-hero-detail',
  imports: [
    CommonModule,
    FormsModule,
    AsyncPipe,
    UpperCasePipe,
  ],
  templateUrl: './hero-detail.html',
  styleUrl: './hero-detail.css',
})
export class HeroDetail  implements OnInit {
  // 🎯 Зміна 1: Тепер зберігаємо Observable з героєм.
  hero$!: Observable<Hero | undefined>;

  // 🎯 Зміна 2: Локальна змінна для роботи з [(ngModel)] та методом save()
  // Вона буде заповнена в шаблоні за допомогою AsyncPipe, 
  // або в методі ngOnInit, якщо використовуємо tap.
  hero: Hero | undefined;

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    // 🎯 Зміна: Використовуємо paramMap як Observable (більш ідіоматично)
    this.hero$ = this.route.paramMap.pipe(
      // switchMap перемикається від Observable параметрів до Observable героя
      switchMap(params => {
        const id = parseInt(params.get('id')!, 10);
        
        // 🟢 Перевіряємо наявність ID перед викликом сервісу
        if (id) {
          return this.heroService.getHero(id).pipe(
             // 🎯 Додатковий tap: Копіюємо героя в локальну змінну hero,
             // щоб save() міг її використовувати.
             tap(h => this.hero = h)
          );
        }
        return of(undefined); // Якщо ID немає, повертаємо undefined
      })
    );
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.hero) {
      // 🎯 Використовуємо локальну змінну hero для збереження змін
      this.heroService.updateHero(this.hero)
        .subscribe(() => this.goBack());
    }
  }
}
