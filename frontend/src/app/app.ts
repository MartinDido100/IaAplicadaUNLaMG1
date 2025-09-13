import { Component, signal, ChangeDetectionStrategy} from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { Header } from "./shared/header/header";
import { Footer } from "./shared/footer/footer";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})  
export class App{}
