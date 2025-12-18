import { Component } from '@angular/core';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-messages',
  imports: [],
  templateUrl: './messages.html',
  styleUrl: './messages.css',
})
export class Messages {
  protected readonly title = 'Sample of Message';

  constructor(public messageService: MessageService) {}
}
