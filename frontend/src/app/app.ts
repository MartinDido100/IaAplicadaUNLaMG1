import { Component, signal, OnInit, inject, ChangeDetectionStrategy} from '@angular/core';
import { MovieService } from './services/movie-service';
import { Movie } from './interfaces/Movie';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App implements OnInit{
  ngOnInit(): void {
    this.movieService.getMovies().subscribe((data) => {
      this.movieData.set(data);
    });
  }

  private readonly movieService = inject(MovieService);
  movieData = signal<null | Movie>(null);

  protected readonly title = signal('frontend');
}
