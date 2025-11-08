import { Component, ChangeDetectionStrategy, inject, OnInit} from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { Header } from "./shared/header/header";
import { Footer } from "./shared/footer/footer";
import { MovieService } from './services/movie-service';
import { Auth } from './services/auth';
import { ThemeService } from './services/theme';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})  
export class App implements OnInit {
  private movieService = inject(MovieService);
  private themeService = inject(ThemeService);
  readonly authService = inject(Auth);


  ngOnInit() {
    const token = localStorage.getItem('accessToken');

    if(token){
      this.authService.verifyToken().subscribe();
    }

    this.movieService.getGenres().subscribe();
  }

}
