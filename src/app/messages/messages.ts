import { Component, inject, signal } from '@angular/core';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-messages',
  imports: [],
  templateUrl: './messages.html',
  styleUrl: './messages.css',
})
export class Messages {
  // ⚡️ Тепер title — це сигнал. 
  // Навіть якщо він readonly, ми звертаємося до нього як до функції.
  protected readonly title = signal('Sample of Message');

  public messageService = inject(MessageService);
}
