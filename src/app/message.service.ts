import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MessageService {
  // 🟢 Створюємо сигнал як приватний стан (масив рядків)
  private messagesSignal = signal<string[]>([]);

  // 🔵 Публічний доступ тільки для читання
  readonly messages = this.messagesSignal.asReadonly();

  add(message: string) {
    // Використовуємо .update(), щоб додати нове повідомлення в кінець
    this.messagesSignal.update(m => [...m, message]);
  }

  clear() {
    // Повністю очищуємо масив
    this.messagesSignal.set([]);
  }
}