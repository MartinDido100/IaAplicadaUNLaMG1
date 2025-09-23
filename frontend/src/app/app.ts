import { Component, ChangeDetectionStrategy, inject, OnInit} from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { Header } from "./shared/header/header";
import { Footer } from "./shared/footer/footer";
import { MovieService } from './services/movie-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})  
export class App implements OnInit {
  private movieService = inject(MovieService);

  ngOnInit() {
    this.movieService.getGenres().subscribe();
  }

}
