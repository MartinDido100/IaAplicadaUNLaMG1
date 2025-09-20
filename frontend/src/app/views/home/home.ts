import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MovieCard } from '../../shared/movie-card/movie-card';
import { MovieService } from '../../services/movie-service';
import { Movie } from '../../interfaces/Movie';
import { Recommendations } from "../recommendations/recommendations";

@Component({
  selector: 'app-home',
  imports: [MovieCard, Recommendations],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class Home implements OnInit{
  popularMovies = signal<Movie[]>([]);
  topRatedMovies = signal<Movie[]>([]);
  readonly movieService = inject(MovieService);

  ngOnInit(): void {
    this.movieService.getPopularMovies().subscribe(movies => {
      this.popularMovies.set(movies);
    });

    this.movieService.getTopRatedMovies().subscribe(movies => {
      this.topRatedMovies.set(movies);
    });
  }
}
