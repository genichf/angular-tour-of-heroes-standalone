import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeroService } from '../hero.service';
import { Hero } from '../hero';

@Component({
  selector: 'app-heroes',
  standalone: true,
  imports: [
    RouterLink,
    // AsyncPipe більше не потрібен, видаляємо його
  ],
  templateUrl: './heroes.html',
  styleUrl: './heroes.css',
})
export class Heroes implements OnInit {
  // 1. Використовуємо inject — це сучасний стиль Angular
  private heroService = inject(HeroService);

  // 2. Просто посилаємось на сигнал із сервісу
  // Тепер це "живий" список, який сам знає, коли оновитися
  heroes = this.heroService.heroes;
  // 🔵 Прокидаємо сигнал завантаження в шаблон
  isLoading = this.heroService.isLoading;

  ngOnInit(): void {
    // Завантажуємо дані при старті. Сигнал у сервісі заповниться, 
    // і цей компонент автоматично "прокинеться".
    this.heroService.getHeroes();
  }

  add(name: string): void {
    name = name.trim();
    if (!name) return;

    // Тільки один виклик! 
    // Не додавайте .subscribe() тут, бо він вже є в сервісі.
    this.heroService.addHero({ name } as Hero);
  }

  delete(hero: Hero): void {
    // Кажемо сервісу видалити героя.
    // Як тільки сервер відповість, сервіс оновить сигнал, 
    // і герой зникне з екрана автоматично.
    this.heroService.deleteHero(hero.id);
  }
}