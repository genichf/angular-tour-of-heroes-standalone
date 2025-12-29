import { Component, inject, signal, input, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Location, UpperCasePipe } from '@angular/common';
import { HeroService } from '../hero.service';
import { Hero } from '../hero';

@Component({
  selector: 'app-hero-detail',
  imports: [
    // CommonModule, - більше не потрібний
    FormsModule,
    // AsyncPipe,- більше не потрібний
    UpperCasePipe,
  ],
  templateUrl: './hero-detail.html',
  styleUrl: './hero-detail.css',
})
export class HeroDetail {
  private heroService = inject(HeroService);
  private location = inject(Location);

  // ⚡️ Signal Input! 
  // Angular сам візьме 'id' з URL і покладе сюди, 
  // тому що назва збігається з параметром у routes: { path: 'detail/:id' }
  id = input<string>(); 

  // Внутрішній сигнал для героя, якого ми редагуємо
  hero = signal<Hero | undefined>(undefined);

  constructor() {
    // 🔄 Кожного разу, коли id() змінюється (наприклад, перейшли з одного героя на іншого),
    // ми автоматично завантажуємо нові дані.
    effect(() => {
      const heroId = Number(this.id());
      if (heroId) {
        this.heroService.getHero(heroId).subscribe(h => this.hero.set(h));
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    const currentHero = this.hero();
    if (currentHero) {
      this.heroService.updateHero(currentHero).subscribe(() => this.goBack());
    }
  }
}