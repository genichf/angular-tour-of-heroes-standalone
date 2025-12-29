import { Component, OnInit, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeroService } from '../hero.service';
import { HeroSearch } from "../hero-search/hero-search";

@Component({
  selector: 'app-dashboard',
  imports: [
    // AsyncPipe більше не потрібен
    RouterLink,
    HeroSearch,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private heroService = inject(HeroService);

  // 🧠 Створюємо обчислювальний сигнал. 
  // Він автоматично стежить за this.heroService.heroes() 
  // і оновлюється сам, коли змінюється основний список.
  topHeroes = computed(() => this.heroService.heroes().slice(1, 5));

  ngOnInit(): void {
    // Завантажуємо дані. Навіть якщо ми на Dashboard, 
    // сервіс оновить свій сигнал, і наш topHeroes() зреагує.
    this.heroService.getHeroes();
  }
}