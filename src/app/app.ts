import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Messages } from "./messages/messages";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Messages],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = 'Tour of Heroes';
}
